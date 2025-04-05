import fs from 'fs';
import https from 'https';
import FastifyServer from './infra/http/fastify/server';

// Caminho para os certificados SSL
const options = {
  // Se você tem um domínio e usou Certbot
  // cert: fs.readFileSync('/etc/letsencrypt/live/seudominio.com/fullchain.pem'),
  // key: fs.readFileSync('/etc/letsencrypt/live/seudominio.com/privkey.pem'),
  
  // Se você usou certificado autoassinado
  cert: fs.readFileSync('/etc/ssl/certs/selfsigned.crt'),
  key: fs.readFileSync('/etc/ssl/private/selfsigned.key'),
};

// Porta HTTPS
const HTTPS_PORT = 3003;

// Inicie o servidor Fastify normalmente (para HTTP)
FastifyServer.start();

// Obtenha a instância do servidor Fastify
const fastifyInstance = (FastifyServer as any).server;

// Configure o servidor para também escutar HTTPS
fastifyInstance.listen({
  port: HTTPS_PORT,
  host: '0.0.0.0',
  https: options
}, (err: Error | null) => {
  if (err) {
    console.error('Erro ao iniciar servidor HTTPS:', err);
    process.exit(1);
  }
  console.log(`Servidor HTTPS iniciado com sucesso na porta ${HTTPS_PORT}!`);
}); 