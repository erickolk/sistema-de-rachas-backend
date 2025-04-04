# Configuração de CI/CD para o Backend

Este documento explica como configurar o pipeline de CI/CD para implantar automaticamente o backend em uma instância EC2 usando GitHub Actions.

## Pré-requisitos

1. Um repositório GitHub para o código do backend
2. Uma instância EC2 com Node.js, npm e PM2 instalados
3. Acesso SSH à instância EC2

## Configuração dos Secrets no GitHub

Para permitir que o pipeline de CI/CD acesse a instância EC2, você precisa configurar os seguintes secrets no seu repositório GitHub:

1. Acesse o repositório no GitHub
2. Vá para "Settings" > "Secrets and variables" > "Actions"
3. Clique em "New repository secret"
4. Configure os seguintes secrets:

### Secrets obrigatórios

| Nome do Secret | Descrição | Como obter |
|---------------|-----------|------------|
| `EC2_SSH_KEY` | Chave SSH privada para acessar a instância EC2 | Arquivo de chave privada do par de chaves usado para a instância EC2 (geralmente um arquivo .pem) |
| `EC2_HOST` | Endereço IP público ou DNS da instância EC2 | Dashboard do EC2 no console AWS |
| `EC2_USER` | Nome do usuário para SSH na instância EC2 | Geralmente `ec2-user` para Amazon Linux, `ubuntu` para Ubuntu, etc. |

## Configuração da Chave SSH

Para configurar a chave SSH para o GitHub Actions:

1. Se você ainda não tem um par de chaves SSH:
   ```bash
   ssh-keygen -t rsa -b 4096 -f ec2_deploy_key
   ```
   Isso gerará dois arquivos: `ec2_deploy_key` (chave privada) e `ec2_deploy_key.pub` (chave pública)

2. Adicione a chave pública à instância EC2:
   ```bash
   ssh-copy-id -i ec2_deploy_key.pub ec2-user@seu-ec2-host
   ```
   Ou manualmente adicionando o conteúdo de `ec2_deploy_key.pub` ao arquivo `~/.ssh/authorized_keys` na instância EC2

3. Adicione o conteúdo da chave privada (`ec2_deploy_key`) como secret `EC2_SSH_KEY` no GitHub

## Preparação da Instância EC2

1. Crie o diretório para o projeto (se ainda não existir):
   ```bash
   mkdir -p /home/ec2-user/sistema-de-rachas-backend
   ```

2. Instale as dependências necessárias:
   ```bash
   sudo yum update -y  # Para Amazon Linux
   sudo yum install -y nodejs npm  # Ou use o gerenciador de pacotes apropriado
   
   # Instale o PM2 globalmente
   npm install -g pm2
   ```

## Funcionamento do Pipeline

O pipeline de CI/CD configurado no arquivo `.github/workflows/deploy-ec2.yml` executa as seguintes etapas:

1. **Build e Teste**:
   - Checkout do código
   - Instalação das dependências
   - Execução dos testes
   - Compilação do TypeScript para JavaScript

2. **Deploy**:
   - Configuração do acesso SSH
   - Compactação dos arquivos necessários
   - Transferência dos arquivos para a instância EC2
   - Extração dos arquivos no servidor
   - Instalação das dependências de produção
   - Reinício da aplicação com PM2

## Verificação do Deploy

Após configurar o pipeline e fazer um push para a branch `main`, você pode:

1. Verificar o status do deploy nas "Actions" do GitHub
2. Verificar os logs do PM2 na instância EC2:
   ```bash
   ssh ec2-user@seu-ec2-host
   pm2 logs
   ```
3. Testar a API acessando um endpoint, por exemplo:
   ```bash
   curl http://seu-ec2-host:3002/api/v1/health
   ```

## Solução de Problemas

Se o deploy falhar, verifique:

1. Os logs nas Actions do GitHub
2. Se todos os secrets estão configurados corretamente
3. Se a instância EC2 está acessível via SSH
4. Os logs do PM2:
   ```bash
   pm2 logs
   ```
5. O status do PM2:
   ```bash
   pm2 status
   ``` 