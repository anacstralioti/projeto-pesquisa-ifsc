import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const app = express();

const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const logFile = path.join(logDir, "registros.txt");

function logDetalhado(mensagem, tipo = "info") {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] [${tipo.toUpperCase()}] ${mensagem}`;
  console.log(logMsg);
  fs.appendFileSync(logFile, logMsg + '\n');
}

const server = app.listen(PORT, "0.0.0.0", () => {
  logDetalhado(`Servidor iniciado na porta ${PORT}`);
  logDetalhado(`Acesse: http://localhost:${PORT}`);
  logDetalhado(`IP da rede: http://192.168.1.6:${PORT}`, "network");
});

const wss = new WebSocketServer({ 
  server,
  perMessageDeflate: false,
  clientTracking: true,
  maxPayload: 1048576 
});

let totalMsgs = 0;

wss.on("connection", (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  const clientPort = req.socket.remotePort;
  
  logDetalhado(`NOVA CONEXÃO WebSocket de ${clientIP}:${clientPort}`, "connection");
  logDetalhado(`URL solicitada: ${req.url}`, "debug");
  logDetalhado(`Headers: ${JSON.stringify(req.headers)}`, "debug");
  
  console.log("Novo Gateway conectado ao servidor OCPP.");
  
  // teste mensagem de boas-vindas
  setTimeout(() => {
    if (ws.readyState === 1) { 
      ws.send(JSON.stringify({
        tipo: "welcome",
        mensagem: "Conexão estabelecida com sucesso!",
        serverTime: new Date().toISOString(),
        clientIP: clientIP
      }));
      logDetalhado(` Mensagem de boas-vindas enviada para ${clientIP}`, "success");
    }
  }, 500);


ws.on("message", (msg) => {
  const data = msg.toString();
  const time = new Date().toLocaleString("pt-BR");
  const clientIP = req.socket.remoteAddress;

  totalMsgs++;
  
  console.log(`[${totalMsgs}] ${time} → ${data}`);
  fs.appendFileSync(logFile, `[${time}] ${data}\n`);

  // detecta se é o ESP
  const isFromESP32 = clientIP !== "127.0.0.1";
  const isFromBrowser = clientIP === "127.0.0.1";

  // resposta para quem enviou
  if (isFromESP32) {
    ws.send(JSON.stringify({
      tipo: "OCPPResponse",
      status: "Accepted",
      recebido_em: time,
      mensagem_id: totalMsgs
    }));
  }

  // prepara mensagem para o dashboard
  let messageForDashboard = data;
  
  // se for OCPP do ESP32
  if (isFromESP32 && data.trim().startsWith('[')) {
    try {
      const ocppData = JSON.parse(data);
      if (Array.isArray(ocppData) && ocppData.length >= 3) {
        const [type, id, action] = ocppData;
        messageForDashboard = `⚡ OCPP [${action}] (ID: ${id})`;
      }
    } catch (e) {
    }
  }

  // BROADCAST para todos
  wss.clients.forEach((client) => {
    if (client.readyState === 1 && client !== ws) {
      // para localhost
      if (client._socket.remoteAddress === "127.0.0.1") {
        client.send(messageForDashboard);
      }
      // para ESP32 (comando do dashboard)
      else if (isFromBrowser && data.trim().startsWith('[')) {
        // envia comando OCPP direto para ESP32
        client.send(data);
      }
    }
  });
});
  ws.on("close", (code, reason) => {
    logDetalhado(`Conexão encerrada com ${clientIP}`, "disconnect");
    logDetalhado(`Código: ${code}, Razão: ${reason || 'Nenhuma'}`, "debug");
    console.log("Conexão encerrada com o Gateway.");
  });

  ws.on("error", (err) => {
    logDetalhado(`Erro WebSocket com ${clientIP}: ${err.message}`, "error");
    console.error("Erro no WebSocket:", err.message);
  });
  
  logDetalhado(`Handshake WebSocket completo com ${clientIP}`, "success");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});
//rota de status
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    port: PORT,
    connections: wss.clients.size,
    messages: totalMsgs,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

//rota para teste websocket
app.get("/test-websocket", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Teste WebSocket</title>
    </head>
    <body>
      <h1>Teste WebSocket Manual</h1>
      <button onclick="connect()">Conectar</button>
      <button onclick="sendTest()">Enviar Teste</button>
      <div id="log"></div>
      <script>
        let ws;
        function connect() {
          ws = new WebSocket('ws://192.168.1.5:8080');
          ws.onopen = () => log('Conectado');
          ws.onmessage = (e) => log('e.data');
          ws.onerror = (e) => log('Erro: ' + e.message);
          ws.onclose = () => log('Desconectado');
        }
        function sendTest() {
          if (ws && ws.readyState === 1) {
            ws.send('{"teste":"mensagem do navegador"}');
            log('Enviado');
          }
        }
        function log(msg) {
          document.getElementById('log').innerHTML += '<p>' + msg + '</p>';
        }
        connect();
      </script>
    </body>
    </html>
  `);
});

logDetalhado("Servidor OCPP iniciando...", "system");