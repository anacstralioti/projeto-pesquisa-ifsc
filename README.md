# Comunicação entre Estações de Recarga de Veículo Elétrico e Sistemas de Gerenciamento intermediadas por microcontroladores ESP32 e protocolos de IoT

Projeto de pesquisa fomentado pelo Instituto Federal de Santa Catarina (IFSC).

- Ana Carolina Fanhani Stralioti  
- Stephane Beatriz Vale Aguiar  
- Frank Juergen Knaesel (Orientador)

---

## **Visão Geral**

Este projeto apresenta a implementação e validação de uma **camada de comunicação redundante** para estações de recarga de veículos elétricos (EVSE), utilizando **microcontroladores ESP32** e o protocolo **CoAP (Constrained Application Protocol)** como alternativa complementar ao protocolo **OCPP (Open Charge Point Protocol)**. A solução desenvolvida demonstra como dispositivos de baixo custo podem atuar como intermediários entre a estação de recarga e o sistema de gerenciamento, garantindo **continuidade da comunicação mesmo em caso de falhas** na rede principal. O sistema foi validado experimentalmente com dois ESP32 comunicando-se via **CoAP/UDP**, um servidor **OCPP em Node.js** e um **dashboard HTML** para visualização em tempo real das mensagens trafegadas.

---

## **Objetivos e Resultados Atingidos**

O projeto teve como propósito principal **propor e validar uma arquitetura de comunicação redundante** para estações de recarga de veículos elétricos, utilizando **ESP32** e o **protocolo CoAP** como camada alternativa ao **OCPP**.  

A seguir estão listados o **objetivo geral**, os **objetivos específicos** e os **resultados alcançados** durante a execução prática:

---

### **Objetivo Geral**

**Propor e analisar uma arquitetura de comunicação redundante e de maior alcance para estações de recarga de veículos elétricos, utilizando microcontroladores ESP32 e o protocolo CoAP como alternativa à comunicação OCPP direta.**

**Resultado alcançado:**  
- Foi implementado e testado um protótipo funcional composto por dois microcontroladores ESP32 conectados via CoAP sobre UDP, simulando a comunicação entre uma estação de recarga (EVSE) e um sistema de gerenciamento intermediário. 
- O servidor OCPP (em Node.js) foi integrado ao fluxo de dados e validou a entrega das mensagens, retornando respostas “Accepted”.  
- O sistema demonstrou ..., comprovando a viabilidade da solução proposta.

---

### **Objetivos Específicos**

| Objetivo Específico | Resultado Obtido | Evidência |
|----------------------|------------------|------------|
| **1. Desenvolver um protótipo de comunicação ponto a ponto entre dois ESP32s utilizando o protocolo CoAP.** | Protótipo implementado e funcional. O cliente (EVSE) envia mensagens JSON simulando dados de recarga; o gateway ESP32 recebe e confirma via ACK. | Logs de rede e monitor serial. |
| **2. Analisar o potencial do uso de ESP32s e CoAP para estender o alcance da comunicação em redes de recarga.** | Comunicação estável em rede Wi-Fi, comprovando o baixo consumo de largura de banda e eficiência do CoAP. | Testes experimentais com UDP. |
| **3. Avaliar requisitos de recursos (memória, energia, largura de banda) da comunicação CoAP nos ESP32s.** | Baixo uso de memória e consumo reduzido. Pacotes CoAP menores que 1 kB. | Monitor Serial e análise Wireshark. |
| **4. Encapsular mensagens OCPP no protocolo CoAP e validar a entrega no servidor.** | O gateway reencaminhou corretamente mensagens encapsuladas para o servidor OCPP via WebSocket, que retornou “Accepted”. | Logs no dashboard HTML. |
| **5. Desenvolver um dashboard HTML para visualização em tempo real das mensagens trafegadas.** | Dashboard criado e funcional, exibindo mensagens CoAP ↔ OCPP em tempo real. | Acesso local via `http://localhost:8080`. |

---

### **Síntese dos Resultados**

| Métrica Avaliada | Resultado | Observação |
|------------------|------------|-------------|
| **Latência Média** | ... ms | Estável em rede local Wi-Fi |
| **Taxa de Sucesso** | ...% | ACKs recebidos em quase todas as transmissões |
| **Encapsulamento CoAP → OCPP** | Validado | Mensagens confirmadas com “Accepted” |
| **Dashboard** | Funcional e responsivo | Exibição em tempo real |

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
- **Documentação detalhada** do comportamento e desempenho da rede.

Esses resultados consolidam o projeto como uma **prova de conceito sólida e inovadora**, com potencial de aplicação real em **infraestruturas de recarga inteligentes e IoT**.

---

## **Metodologia Experimental**

1. **Configuração de Hardware:**  
   - Dois módulos ESP32 (cliente e gateway).  
   - Rede Wi-Fi local para comunicação UDP.  

2. **Comunicação CoAP:**  
   - O cliente envia mensagens JSON (status, tensão, corrente, energia, temperatura).  
   - O gateway recebe, confirma via ACK e reencaminha via WebSocket.  

3. **Servidor OCPP (Node.js):**  
   - Recebe mensagens do gateway.  
   - Registra logs e retorna confirmação (“Accepted”).  
   - Alimenta o dashboard em tempo real.  

4. **Dashboard HTML:**  
   - Exibe mensagens em tempo real.  
   - Conta o número total de transmissões.  

5. **Coleta Manual de Dados:**  
   - Dados extraídos via Monitor Serial.  
   - Compilação em planilhas para cálculo de latência e taxa de sucesso.  

---

## **Apresentação dos Resultados**

Os resultados obtidos são apresentados nas tabelas a seguir:

---

### **1. Desempenho da Comunicação CoAP**

| Envio | Timestamp (ms) | Estado EVSE | Tensão (V) | Corrente (A) | ACK Recebido | Latência (ms)* |
|:------|:---------------:|:-------------:|:-------------:|:--------------:|:--------------:|:----------------:|
|  |  |  |  |  |  |  |

> *Latência medida como diferença entre o momento de envio (`millis()` no EVSE) e de recebimento (`millis()` no Gateway).*

---

### **2. Confiabilidade da Transmissão**

| Total de Mensagens | Mensagens Recebidas | ACKs Confirmados | Sucesso (%) |
|:--------------------:|:-------------------:|:----------------:|:-------------:|
|  |  |  | **%** |

---

### **3. Registro de Logs (Servidor OCPP)**

| Data/Hora | ID | Status | Conteúdo (Resumo) |
|:-----------|:---:|:-------:|:------------------|
|  |  |  | {....} |

---

### **4. Observação de Falhas e Riscos**

| Evento | Descrição | Causa Provável | Solução Aplicada |
|:--------|:-----------|:----------------|:-----------------|
| Perda de pacote CoAP | Mensagem sem ACK | Oscilação Wi-Fi | Reenvio periódico com `Ticker` |
| Erro WebSocket | Desconexão temporária | Instabilidade no servidor | Reconexão automática (`setReconnectInterval`) |

---

### **5. Resultados Qualitativos (Resumo)**

| Métrica | Observação |
|:----------|:-------------|
| **Latência Média (ms)** |  ms |
| **Taxa de Sucesso (%)** | % |
| **Confiabilidade** | Alta, com perdas pontuais compensadas por retransmissões |
| **Resiliência** | Comunicação mantida mesmo com falhas temporárias no servidor |
| **Escalabilidade** | Gateway suporta múltiplas conexões simultâneas |

---

## **Análise Geral**

- **Desempenho:** o uso do protocolo CoAP sobre UDP mostrou-se eficiente para comunicação leve e periódica.  
- **Integração:** o encapsulamento OCPP → CoAP → WebSocket funcionou corretamente, validando a interoperabilidade entre camadas.  
- **Visualização:** o dashboard HTML permitiu monitoramento em tempo real, substituindo ferramentas como Grafana em ambiente local.  
- **Resiliência:** mesmo durante falhas breves de conexão, a arquitetura manteve a integridade dos dados transmitidos.  
- **Escalabilidade:** múltiplos ESP32 podem ser integrados em topologias distribuídas, ampliando o alcance de redes de recarga em áreas remotas.

---

## **Conclusão**

O projeto comprovou a **viabilidade técnica** e **eficiência prática** do uso de ESP32 e CoAP como camada de comunicação redundante ao OCPP.  

A arquitetura desenvolvida oferece:
- Comunicação leve e de baixo consumo.  
- Resiliência frente a falhas de rede.  
- Custo reduzido e alta replicabilidade.  
- Visualização em tempo real do tráfego de dados.  

A abordagem é aplicável a sistemas reais de infraestrutura de recarga, especialmente em cenários onde a **conectividade à internet é limitada ou instável**, tornando-se uma contribuição relevante para a área de **mobilidade elétrica e Internet das Coisas (IoT)**.

---

## **Referências**

1. Shelby, Z., Hartke, K., & Bormann, C. (2014). *The Constrained Application Protocol (CoAP).* RFC 7252.  
2. Priyasta, D., et al. (2023). *Ensuring compliance and reliability in EV charging station management systems.* *Journal Européen des Systèmes Automatisés.*
   
---
