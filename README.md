# Backend do Sistema de Rachas

## Sobre o Projeto

O Backend do Sistema de Rachas é responsável por toda a lógica de negócio, persistência de dados e API REST para o gerenciamento de partidas de futebol recreativo ("rachas" ou "peladas").

## Tecnologias

- **Node.js**: Ambiente de execução JavaScript
- **TypeScript**: Superset tipado de JavaScript
- **Fastify**: Framework web de alta performance
- **MongoDB**: Banco de dados NoSQL
- **JWT**: Autenticação baseada em tokens
- **Swagger**: Documentação de API
- **Vitest**: Framework de testes

## Arquitetura

O projeto segue princípios de Clean Architecture e Domain-Driven Design (DDD):

- **Domain**: Contém as entidades de negócio e regras centrais
- **Application**: Implementa casos de uso que orquestram as entidades
- **Infrastructure**: Fornece implementações concretas de repositórios e serviços

## Estrutura de Diretórios

```
sistema-de-rachas/
├── src/
│   ├── application/       # Casos de uso e serviços de aplicação
│   ├── domain/            # Entidades, interfaces de repositório e regras de negócio
│   ├── infra/             # Implementações de repositórios, controllers e serviços externos
│   │   ├── database/      # Configuração e adaptadores de banco de dados
│   │   ├── http/          # Controllers e rotas
│   │   └── services/      # Implementações de serviços externos
│   ├── types/             # Definições de tipos TypeScript
│   └── utils/             # Utilitários diversos
├── database/              # Scripts e configurações do banco de dados
├── dist/                  # Código compilado (gerado pelo build)
└── tests/                 # Testes automatizados
```

## Instalação e Execução

### Pré-requisitos

- Node.js 18+
- MongoDB 6+
- Yarn ou NPM

### Configuração Local

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd sistema-de-rachas-backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente (copie .env.example para .env e ajuste conforme necessário)
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

### Execução com Docker

```bash
# Construa e inicie o container
docker-compose up -d
```

## API e Endpoints

A documentação completa da API está disponível através do Swagger:

```
http://localhost:3002/docs
```

### Principais Endpoints

- **POST /api/v1/auth/login**: Autenticação de usuários
- **GET /api/v1/matches**: Lista de partidas
- **POST /api/v1/matches**: Criação de partida
- **GET /api/v1/soccer-fields**: Lista de campos
- **POST /api/v1/payments**: Registro de pagamentos

## Implantação

O backend está configurado para implantação em ambientes como:

- **EC2**: Utilizando PM2 para gerenciamento de processos
- **Docker**: Utilizando a configuração no Dockerfile e docker-compose.yaml

### PM2 (para EC2)

```bash
# Build da aplicação
npm run build

# Iniciar com PM2
pm2 start ecosystem.config.js
```

## Desenvolvimento

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento com hot-reload
- `npm run build`: Compila o TypeScript para JavaScript
- `npm run start`: Inicia o servidor a partir do código compilado
- `npm test`: Executa os testes automatizados
- `npm run lint`: Verifica o código com ESLint

## Licença

ISC 