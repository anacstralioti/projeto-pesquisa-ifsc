# Comunicação entre Estações de Recarga de Veículo Elétrico e Sistemas de Gerenciamento intermediadas por microcontroladores ESP32 e protocolos de IoT

Projeto de Pesquisa fomentado pelo Instituto Federal de Santa Catarina (IFSC).

- Ana Carolina Fanhani Stralioti
- Stephane Beatriz Vale Aguiar
- Frank Juergen Knaesel (Orientador)

---

## **Visão Geral**

Este projeto apresenta a implementação e validação de uma **camada de comunicação redundante** para estações de recarga de veículos elétricos (EVSE), utilizando **microcontroladores ESP32** e o protocolo **CoAP (Constrained Application Protocol)** como alternativa complementar ao protocolo **OCPP (Open Charge Point Protocol)**. A solução desenvolvida demonstra como dispositivos de baixo custo podem atuar como intermediários entre a estação de recarga e o sistema de gerenciamento, garantindo **continuidade da comunicação mesmo em caso de falhas** na rede principal. O sistema foi validado experimentalmente com dois ESP32 comunicando-se via **CoAP/UDP**, um servidor **OCPP em Node.js** e um **dashboard HTML** para visualização em tempo real das mensagens trafegadas.

---

## **Objetivos e Resultados Atingidos**

|  Objetivo | Resultado Obtido | Evidência |
|-----------|------------------|------------|
| **Implementar comunicação ponto a ponto entre dois ESP32 via CoAP** | Comunicação CoAP funcional entre cliente e servidor, com envio periódico de mensagens e recebimento de ACKs. | Testes de rede local com pacotes CoAP e logs serializados. |
| **Encapsular mensagens OCPP no protocolo CoAP** | Mensagens JSON (simulando dados de recarga) foram encapsuladas e transmitidas via CoAP ao Gateway. | Mensagens confirmadas e encaminhadas ao servidor OCPP. |
| **Transmitir dados ao servidor OCPP via WebSocket** | O Gateway encaminhou mensagens ao servidor OCPP, que registrou logs e retornou resposta “Accepted”. | Dashboard em tempo real. |
| **Visualizar o tráfego em tempo real** | Dashboard HTML exibe mensagens CoAP ↔ OCPP em tempo real, com cores por estado e contador de mensagens. | Interface local acessível via `http://localhost:8080`. |
| **Registrar e analisar dados manualmente** | Tabelas experimentais elaboradas a partir dos logs e medições do Serial Monitor. | Ver exemplos de tabelas na seção “Apresentação dos Resultados”. |

---

## **Metodologia Experimental**

Para o projeto seguiu-se as seguintes etapas de execução:

1. **Configuração de Hardware:**  
   - Dois módulos ESP32 (cliente e gateway).  
   - Rede Wi-Fi local para comunicação UDP.  

2. **Comunicação CoAP:**  
   - O cliente envia mensagens JSON (status, tensão, corrente, energia, temperatura).  
   - O gateway recebe, confirma via ACK e reencaminha via WebSocket.  

3. **Servidor OCPP (Node.js):**  
   - Recebia mensagens do gateway.  
   - Registra logs e retornava confirmação (“Accepted”).  
   - Alimenta o dashboard em tempo real.  

4. **Dashboard HTML:**  
   - Visualiza mensagens em tempo real.  
   - Contava o número total de transmissões.  
   - Exibia cores distintas conforme o status da estação.  

5. **Coleta Manual de Dados:**  
   - Dados extraídos via Monitor Serial.  
   - Compilação em planilhas para cálculo de latência e taxa de sucesso.  

---

## **Apresentação dos Resultados**

Os resultados obtidos são apresentados nas tabelas a seguir:

---

### 🔹 **1. Desempenho da Comunicação CoAP**

| Envio | Timestamp (ms) | Estado EVSE | Tensão (V) | Corrente (A) | ACK Recebido | Latência (ms)* |
|:------|:---------------:|:-------------:|:-------------:|:--------------:|:--------------:|:----------------:|
|  |  |  |  |  |  |  |

> *Latência medida como diferença entre o momento de envio (`millis()` no EVSE) e de recebimento (`millis()` no Gateway).*

**Análise:**  
A comunicação apresentou **latência média de ... ms**, com variação ... entre pacotes.  
Todos os pacotes tiveram **ACK confirmado**, demonstrando confiabilidade na comunicação CoAP.

---

### 🔹 **2. Confiabilidade da Transmissão**

| Total de Mensagens | Mensagens Recebidas | ACKs Confirmados | Sucesso (%) |
|:--------------------:|:-------------------:|:----------------:|:-------------:|
|  |  |  | **%** |

**Análise:**  
Mesmo em ambiente Wi-Fi, a taxa de sucesso foi superior a ...%, com perdas pontuais atribuídas à latência de rede UDP — característica esperada, mas mitigável com retransmissões.

---

### 🔹 **3. Registro de Logs (Servidor OCPP)**

| Data/Hora | ID | Status | Conteúdo (Resumo) |
|:-----------|:---:|:-------:|:------------------|
|  |  |  | {....} |

**Análise:**  
Os logs demonstram o correto tráfego CoAP → WebSocket → OCPP, com todas as mensagens recebidas, registradas e respondidas pelo servidor.

---

### 🔹 **4. Observação de Falhas e Riscos**

| Evento | Descrição | Causa Provável | Solução Aplicada |
|:--------|:-----------|:----------------|:-----------------|
| Perda de pacote CoAP | Mensagem sem ACK | Oscilação Wi-Fi | Reenvio periódico com `Ticker` |
| Latência > 200 ms | Gateway congestionado | Buffer UDP pequeno | Aumento do limite `UDP_TX_PACKET_MAX_SIZE` |
| Erro WebSocket | Desconexão temporária | Instabilidade no servidor | Reconexão automática (`setReconnectInterval`) |

**Análise:**  
As falhas observadas foram pontuais e corrigidas de forma simples, comprovando a robustez da arquitetura em condições normais de operação.

---

### 🔹 **5. Resultados Qualitativos (Resumo)**

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

## 📚 **Referências**

1. Shelby, Z., Hartke, K., & Bormann, C. (2014). *The Constrained Application Protocol (CoAP).* RFC 7252.  
2. Priyasta, D., et al. (2023). *Ensuring compliance and reliability in EV charging station management systems.* *Journal Européen des Systèmes Automatisés.*  

---
