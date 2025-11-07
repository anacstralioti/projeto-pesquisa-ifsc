#include <WiFi.h>
#include <WebServer.h>
#include <coap-simple.h>
#include <WebSocketsClient.h>
#include <SPIFFS.h>
#include <ESPmDNS.h>

const char* ssid = "SERGIO_2G";
const char* password = "an27li08se";
const char* ocppServer = "192.168.1.17";
const uint16_t ocppPort = 8080;
const int coapPort = 5685;

WebServer server(80);
WiFiUDP udp;
Coap coap(udp);
WebSocketsClient wsOCPP;

void callbackCoAP(CoapPacket &packet, IPAddress ip, int port) {
  Serial.printf("Callback CoAP acionado de %s:%d\n", ip.toString().c_str(), port);
  String payload;
  for (int i = 0; i < packet.payloadlen; i++) payload += (char)packet.payload[i];
  Serial.println("Conteúdo: " + payload);

  wsOCPP.sendTXT(payload);
  coap.sendResponse(ip, port, packet.messageid);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando Gateway...");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.printf("\n Wi-Fi conectado! IP: %s\n", WiFi.localIP().toString().c_str());

  if (!SPIFFS.begin(true)) Serial.println("SPIFFS falhou");
  else Serial.println("SPIFFS montado com sucesso");
 
  if (udp.begin(coapPort)) Serial.printf("UDP escutando na porta %d\n", coapPort);
  else Serial.println("Falha ao iniciar UDP!");

  coap.server(callbackCoAP, "ocpp/msg");
  coap.start();

  wsOCPP.begin(ocppServer, ocppPort, "/");
  wsOCPP.setReconnectInterval(5000);
  wsOCPP.enableHeartbeat(15000, 3000, 2);

  Serial.println("Gateway pronto!");
}

void loop() {
  int tam = udp.parsePacket();
  if (tam) {
    Serial.printf("Pacote UDP bruto recebido de %s (%d bytes)\n",
                  udp.remoteIP().toString().c_str(), tam);
  }

  coap.loop();
  wsOCPP.loop();
}
