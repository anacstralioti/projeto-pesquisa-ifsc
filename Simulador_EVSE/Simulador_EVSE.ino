#include <WiFi.h>
#include <coap-simple.h>
#include <ArduinoJson.h>
#include <Ticker.h>

const char* ssid = "SERGIO_2G";
const char* password = "an27li08se";
IPAddress gatewayIP(192, 168, 1, 18); // IP do Gateway

WiFiUDP udp;
Coap coap(udp);
Ticker envioPeriodico;

String gerarMensagemEVSE() {
  DynamicJsonDocument doc(256);
  const char* estados[] = {"Available","Charging","Faulted","Finishing"};
  doc["station_id"]="EVSE_01";
  doc["status"]=estados[random(0,4)];
  doc["voltage"]=random(220,240);
  doc["current"]=random(8,32);
  doc["energy_kWh"]=random(100,300)/10.0;
  doc["temperature"]=random(20,40);
  doc["timestamp"]=millis()/1000;
  String json; serializeJson(doc,json); return json;
}

void callbackResposta(CoapPacket&,IPAddress, int){ Serial.println("ACK do Gateway!"); }

void enviarMensagem(){
  String msg=gerarMensagemEVSE();
  Serial.println("Enviando CoAP → Gateway:");
  Serial.println(msg);
  int r=coap.put(gatewayIP,5685,"ocpp/msg",msg.c_str());
  Serial.printf("Resultado envio CoAP: %d\n",r);
}

void setup(){
  Serial.begin(115200);
  Serial.println("Iniciando EVSE...");

  WiFi.begin(ssid,password);
  while(WiFi.status()!=WL_CONNECTED){delay(500);Serial.print(".");}
  Serial.printf("\n Wi-Fi conectado! IP: %s\n",WiFi.localIP().toString().c_str());

  Serial.println("Enviando pacote UDP de teste...");
  udp.beginPacket(gatewayIP,5685);
  udp.print("ping");
  udp.endPacket();
  Serial.println("Pacote UDP de teste enviado!");

  coap.response(callbackResposta);
  coap.start();
  envioPeriodico.attach(10,enviarMensagem);
  Serial.println("EVSE pronto!");
}

void loop(){ coap.loop(); }
