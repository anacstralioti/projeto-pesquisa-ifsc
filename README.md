# Comunicação entre Estações de Recarga de Veículo Elétrico e Sistemas de Gerenciamento intermediadas por microcontroladores ESP32 e protocolos de IoT

Projeto de pesquisa fomentado pelo Instituto Federal de Santa Catarina (IFSC).

- Ana Carolina Fanhani Stralioti  
- Stephane Beatriz Vale Aguiar  
- Frank Juergen Knaesel (Orientador)

---

## **Visão Geral**

ste projeto apresenta a implementação de uma arquitetura de comunicação para estações de recarga de veículos elétricos (EVSE) utilizando microcontroladores ESP32 e o protocolo CoAP (Constrained Application Protocol). A solução visa superar as limitações de conectividade do padrão OCPP (Open Charge Point Protocol) em ambientes de rede instáveis. 
O sistema utiliza um Gateway intermediário para realizar a transcodificação de pacotes CoAP (baseados em UDP) em mensagens WebSocket (baseados em TCP), garantindo a interoperabilidade com servidores centrais de gerenciamento (CSMS).

---

## **Objetivos e Resultados Atingidos**

O projeto tem como propósito principal **propor e validar uma arquitetura de comunicação redundante** para estações de recarga de veículos elétricos, utilizando **ESP32** e o **protocolo CoAP** como camada alternativa ao **OCPP**.  

A seguir estão listados o **objetivo geral**, os **objetivos específicos** e os **resultados alcançados** durante a execução prática:

---

### **Objetivo Geral**

**Propor e analisar uma arquitetura de comunicação redundante e de maior alcance para estações de recarga de veículos elétricos, utilizando microcontroladores ESP32 e o protocolo CoAP como alternativa à comunicação OCPP direta.**

---

### **Objetivos Específicos**

| Objetivo Específico | Resultado Obtido | Evidência |
|----------------------|------------------|------------|
| **1. Desenvolver um protótipo de comunicação ponto a ponto entre dois ESP32s utilizando o protocolo CoAP.** | O cliente (EVSE) envia mensagens JSON; o gateway confirma via ACK. | Logs de rede e monitor serial. |
| **2. Analisar o potencial do uso de ESP32s e CoAP para estender o alcance da comunicação em redes de recarga.** | Baixo consumo de largura de banda e alta eficiência do CoAP/UDP. | Testes experimentais com UDP. |
| **3. Avaliar requisitos de recursos (memória, energia, largura de banda) da comunicação CoAP nos ESP32s.** | BOverhead reduzido (cabeçalho de 4 bytes) e economia de energia. | Monitor Serial. |
| **4. Encapsular mensagens OCPP no protocolo CoAP e validar a entrega no servidor.** | Gateway reencaminhou mensagens para o servidor via WebSocket com sucesso. | Logs no dashboard HTML. |
| **5. Desenvolver um dashboard HTML para visualização em tempo real das mensagens trafegadas.** | Visualização instantânea das mensagens trafegadas (exemplo: MeterValues). | Acesso local via `http://localhost:8080`. |


**Resultados alcançados:**  
| Métrica Avaliada | Resultado | Observação |
|----------------------|------------------|------------|
| Latência média | < 45 ms | Estimada entre transcodificação e rede local. |
| Taxa de sucesso | Alta estabilidade | ACKs validados pelo messageid original. |
| Encapsulamento | Validado | Mensagens confirmadas pelo servidor central. |
| Dashboard | Funcional | Exibição em tempo real de telemetria e status28. |

---

### **Conclusão dos Objetivos**

Todos os objetivos específicos foram **atingidos**.  

O protótipo demonstrou:
- **Viabilidade técnica** do uso de CoAP para comunicação entre ESP32s;  
- **Integração bem-sucedida** entre CoAP, UDP e WebSocket (OCPP);  
- **Eficiência e resiliência** em condições normais de rede;  
- **Capacidade de monitoramento em tempo real** via dashboard.  

Além disso, o projeto gerou resultados adicionais, como:
- Implementação de um **servidor OCPP personalizado em Node.js**;  
- Criação de um **painel HTML interativo** para análise ao vivo;  

Esses resultados consolidam o projeto com potencial de aplicação real em **infraestruturas de recarga inteligentes e IoT**.
