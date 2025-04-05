import fs from 'fs';
import https from 'https';
import http from 'http';

// Caminho para os certificados SSL
const options = {
  // Se você tem um domínio e usou Certbot
  // cert: fs.readFileSync('/etc/letsencrypt/live/seudominio.com/fullchain.pem'),
  // key: fs.readFileSync('/etc/letsencrypt/live/seudominio.com/privkey.pem'),
  
  // Se você usou certificado autoassinado
  cert: fs.readFileSync('/etc/ssl/certs/selfsigned.crt'),
  key: fs.readFileSync('/etc/ssl/private/selfsigned.key'),
};

// Porta para o servidor Fastify normal (HTTP)
const HTTP_PORT = 3002;
// Porta para o servidor HTTPS
const HTTPS_PORT = 3003;

// Inicia o servidor Fastify normal
import('./main');

// Cria um servidor HTTPS que encaminha requisições para o servidor Fastify
const httpsServer = https.createServer(options, (req, res) => {
  console.log(`Recebendo requisição HTTPS: ${req.method} ${req.url}`);
  
  // Se for uma requisição OPTIONS (preflight CORS), responda imediatamente
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }
  
  const proxyReq = http.request({
    host: 'localhost',
    port: HTTP_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  }, (proxyRes) => {
    try {
      // Verifica se os cabeçalhos já foram enviados
      if (!res.headersSent) {
        // Adiciona cabeçalhos CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // Envie os cabeçalhos de status e resposta
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      }
      // Pipe da resposta
      proxyRes.pipe(res);
    } catch (error) {
      console.error('Erro ao processar resposta:', error);
      // Se ainda não enviou cabeçalhos, envia erro 500
      if (!res.headersSent) {
        res.writeHead(500);
        res.end('Erro interno do servidor ao processar resposta');
      }
    }
  });

  req.pipe(proxyReq);

  proxyReq.on('error', (e) => {
    console.error('Erro ao encaminhar requisição:', e);
    // Verifica se os cabeçalhos já foram enviados
    if (!res.headersSent) {
      res.writeHead(500);
      res.end('Erro interno do servidor');
    }
  });
});

httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
  console.log(`Servidor HTTPS rodando na porta ${HTTPS_PORT}!`);
}); 