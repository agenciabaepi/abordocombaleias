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

1. Acesse o **hPanel** da Hostinger.
2. Vá em **Avançado** → **Node.js** (ou **Aplicações Node.js**).
3. Clique em **Criar aplicação** e conecte o repositório do GitHub (autorize se pedir).
4. Defina:
   - **Branch:** `main`
   - **Comando de build:** `npm ci && npm run build`
   - **Comando de início:** `npm run start`
   - **Diretório raiz:** (deixe em branco se o projeto estiver na raiz do repo)
5. Defina a **versão do Node.js** (18, 20 ou 22).
6. Salve e faça o **deploy**. A Hostinger vai instalar dependências, rodar o build e iniciar com `npm run start` (a porta é definida por eles via `PORT`).

### 3. Domínio

No mesmo painel, associe o domínio **abordocombaleias.com.br** à aplicação Node.js. A Hostinger costuma orientar o passo a passo de DNS.

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
