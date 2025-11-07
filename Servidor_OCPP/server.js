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

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor HTTP + OCPP ativo em: http://localhost:${PORT}`);
  console.log(`Também acessível via IP local da rede Wi-Fi.`);
});

const wss = new WebSocketServer({ server });
let totalMsgs = 0;

wss.on("connection", (ws, req) => {
  console.log("Novo Gateway conectado ao servidor OCPP.");

  ws.on("message", (msg) => {
    totalMsgs++;
    const data = msg.toString();
    const time = new Date().toLocaleString("pt-BR");

    console.log(`[${totalMsgs}] ${time} → ${data}`);

    fs.appendFileSync(logFile, `[${time}] ${data}\n`);

    ws.send(JSON.stringify({
      tipo: "OCPPResponse",
      status: "Accepted",
      recebido_em: time
    }));

    wss.clients.forEach((client) => {
      if (client.readyState === 1 && client !== ws) {
        client.send(JSON.stringify({
          tipo: "Broadcast",
          origem: "ServidorOCPP",
          mensagem: data,
          hora: time
        }));
      }
    });
  });

  ws.on("close", () => console.log("Conexão encerrada com o Gateway."));
  ws.on("error", (err) => console.error("Erro no WebSocket:", err.message));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});
