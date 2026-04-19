import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Task 2: Automação de Reajustes (Engine de Simulação)
  // No MVP real, isso seria um Cron Job ou Cloud Function.
  app.get("/api/automations/check-readjustments", (req, res) => {
    console.log("Checking contracts for readjustment index updates (IGPM/IPCA)...");
    
    // Lógica de Negócio:
    // 1. Busca contratos cujo 'nextReadjustmentDate' é hoje.
    // 2. Consulta API do Banco Central ou IBGE para pegar o índice acumulado.
    // 3. Calcula o novo valor: Valor Atual * (1 + Indice).
    // 4. Grava no banco e dispara e-mail via SendGrid/Postmark.
    
    res.json({
      message: "Engine de automação processado com sucesso.",
      contractsProcessed: 5,
      timestamp: new Date().toISOString()
    });
  });

  // 2. Task 3: Integração de Pagamentos (Webhook Pix)
  // Endpoint que o PSP (ex: Stripe, Mercado Pago, Efí) chamaria.
  app.post("/api/webhooks/pix", async (req, res) => {
    const { transaction_id, status, amount, metadata } = req.body;

    console.log(`Recebido Webhook Pix: Transação ${transaction_id} - Status: ${status}`);

    if (status === "approved" || status === "completed") {
      const contractId = metadata?.contract_id;
      const paymentId = metadata?.payment_id;

      // Lógica de Negócio:
      // 1. Valida a assinatura do Webhook (Segurança).
      // 2. Localiza o documento 'payments/{paymentId}' no Firestore.
      // 3. Atualiza status para 'paid' e paymentDate para agora.
      // 4. Gatilha notificação push/email para o proprietário.
      
      console.log(`Baixa automática realizada para Contrato ${contractId}, Pagamento ${paymentId}`);
    }

    res.status(200).send("OK");
  });

  // 4. Task 4: Assinatura Eletrônica (Clicksign Mock API)
  app.post("/api/contracts/:id/send-to-sign", async (req, res) => {
    const { id } = req.params;
    const { tenantEmail } = req.body;

    console.log(`Solicitando assinatura para Contrato #${id} - Email: ${tenantEmail}`);

    // Simulação de chamada para Clicksign
    // await axios.post('https://app.clicksign.com/api/v1/documents', { ... });
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockSignatureKey = `cs_${Math.random().toString(36).substring(7)}`;

    res.json({
      success: true,
      message: "Documento enviado para assinatura via Clicksign.",
      signatureKey: mockSignatureKey,
      clicks_url: `https://app.clicksign.com/doc/${mockSignatureKey}`
    });
  });

  // 5. Task 5: Webhook de Assinatura (Simulação de Retorno)
  app.post("/api/webhooks/signature", async (req, res) => {
    const { event, document_key, status } = req.body;

    console.log(`Recebido Webhook de Assinatura: Documento ${document_key} - Evento: ${event}`);

    // No mundo real, aqui você usaria o document_key para encontrar o contrato no BD
    // e atualizar o status para 'signed' se event === 'signature_completed'
    
    if (event === "signature_completed" || status === "signed") {
      // Gatilha lógica de backend: 
      // 1. Gera o PDF final com o selo de autenticidade
      // 2. Envia cópia para todas as partes
      // 3. Ativa o contrato no sistema financeiro
      console.log(`Contrato associado à chave ${document_key} foi marcado como ASSINADO.`);
    }

    res.status(200).json({ status: "success", received: true });
  });

  // 6. Configuração do Vite para desenvolvimento ou produção
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PropTech Server rodando em http://localhost:${PORT}`);
  });
}

startServer();
