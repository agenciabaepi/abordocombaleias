# Como subir o site na Hostinger

O projeto pode ser publicado na Hostinger de duas formas: como **app Node.js** (recomendado) ou como **site estático**.

---

## Opção 1: Node.js na Hostinger (recomendado)

Disponível em planos **Business** ou **Cloud** da Hostinger. O painel permite conectar um repositório e rodar Next.js.

### 1. Deixar o projeto no GitHub

1. Crie um repositório no GitHub (ex.: `abordocombaleias`).
2. No seu projeto, execute:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/abordocombaleias.git
git branch -M main
git push -u origin main
```

**Importante:** Os 200 frames em WebP precisam estar em `public/frames/` (nomes `1_00000.webp` a `1_00199.webp`). Se hoje estão em `src/frames/`, copie para `public/frames/` antes do commit, pois o servidor vai servir de `public/`.

### 2. Configurar na Hostinger

**Importante:** o deploy precisa ser um **Node.js Web App**, não um site comum com repositório Git. Se o log do deploy mostrar mensagens como *"Looking for composer.lock"* / *"composer.json file was not found"* e terminar sem rodar `npm install` ou `npm run build`, o site foi criado como **PHP**. Nesse caso, remova esse site e crie de novo seguindo os passos abaixo (escolhendo **Node.js Apps** ao adicionar o site).

> **Se ainda aparece "Looking for composer.lock" no log:** você está fazendo deploy em um **site do tipo PHP**, não em um Node.js Web App. No passo "Add Website", é obrigatório escolher a opção **"Node.js Apps"** (ou "Aplicações Node.js"). Se essa opção não existir no seu painel, o plano pode não incluir Node.js (é preciso plano Business ou Cloud).

1. Acesse o **hPanel** da Hostinger.
2. Vá em **Websites** → **Add Website** (adicionar site).
3. **Escolha "Node.js Apps"** (não "Website" nem opção que use apenas Git sem Node).
4. Selecione **Import Git Repository**, autorize o GitHub se pedir e escolha o repositório `agenciabaepi/abordocombaleias`.
5. Na tela de **Build settings** (configurações de build), confira ou defina:
   - **Branch:** `main`
   - **Install command:** `npm ci` (ou deixe o padrão sugerido)
   - **Build command:** `npm run build`
   - **Start command:** `npm run start` ou `npm run start -- -p $PORT` (a Hostinger pode preencher automaticamente)
   - **Diretório raiz:** em branco (projeto na raiz do repo)
   - **Node.js:** 18, 20 ou 22 (LTS)
6. Clique em **Deploy**. O deploy correto vai clonar o repo, rodar `npm ci`, `npm run build` e `npm run start` — sem procurar `composer.lock`.

### 3. Domínio

No mesmo painel, associe o domínio **abordocombaleias.com.br** à aplicação Node.js. A Hostinger costuma orientar o passo a passo de DNS.

### 4. Como fazer deploy das atualizações (por aqui)

Sempre que você alterar o projeto e quiser atualizar o site no ar:

1. **No seu computador (projeto local):** commitar e enviar as mudanças para o GitHub na branch **main**:
   ```bash
   git add .
   git commit -m "Descrição da alteração"
   git push origin main
   ```
2. **Na Hostinger:** o deploy pode ser automático (cada push na `main` dispara um novo build) ou manual:
   - Se for **automático:** não precisa fazer nada; aguarde o build terminar e o site atualiza.
   - Se for **manual:** entre no painel do site (Node.js Web App) → **Deployments** (ou **Redeploy** / **Deploy**) → clique em **Deploy** (ou **Redeploy**) para rodar o build de novo com o código mais recente do GitHub.

Para saber se é automático, veja nas configurações do app Node.js na Hostinger se existe opção tipo “Auto-deploy on push” ou “Deploy on git push”. Se existir e estiver ligada, basta dar `git push origin main` daqui e o deploy roda sozinho.

---

## Opção 2: Site estático (qualquer plano)

Se o seu plano for só **hospedagem compartilhada** (sem Node.js), dá para publicar como site estático.

### 1. Gerar o export estático

No `next.config.mjs` já existe suporte a export. Rode no seu computador:

```bash
npm run build
```

O resultado fica na pasta `.next`. Para a Hostinger no modo estático é preciso usar **export estático**. Avise se for usar essa opção que eu te passo o `next.config` exato e o comando (ex.: `npx next build` com `output: 'export'`).

### 2. Enviar os arquivos

1. No hPanel, abra **Gerenciador de arquivos** ou use **FTP**.
2. Vá até a pasta do domínio (geralmente `public_html`).
3. Envie todo o conteúdo da pasta gerada (no caso de export estático, seria a pasta `out`).

**Atenção:** No export estático, a pasta `public/` (incluindo `public/frames/`) precisa estar refletida na pasta que você sobe, senão a animação não carrega.

---

## Resumo rápido (Node.js na Hostinger)

1. Coloque os frames em `public/frames/` e suba o código no GitHub.
2. No hPanel → Node.js → Criar aplicação → Conectar GitHub.
3. Build: `npm ci && npm run build` | Início: `npm run start`.
4. Apontar o domínio para a aplicação.

Se você disser qual plano Hostinger tem (compartilhado, Business, Cloud ou VPS), dá para detalhar só o caminho que se aplica ao seu caso.
