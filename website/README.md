# 💍 Kafamento — Fabio & Karina

> O Rio encontra SP. Site de casamento do Fabio (paulistano) e da Karina (carioca), que se casam em **22 de novembro**, em São Paulo. Domínio: **kafamento.com.br**.

Site completo com confirmação de presença (RSVP), lista de presentes com cotas, pagamentos via Mercado Pago, e-mails transacionais e painel administrativo.

---

## 🧱 Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — design system "O Rio encontra SP"
- **Supabase** — PostgreSQL + Auth + Storage
- **Mercado Pago** — Checkout Pro + Webhook
- **Resend** — e-mails transacionais
- **Vercel** — deploy

### Identidade visual

| Token | Cor | Uso |
|-------|-----|-----|
| `oceano` | `#006994` | Azul oceano (ondas de Copacabana) |
| `areia` | `#E8D5B0` | Areia da praia |
| `urbano` | `#3A3A3A` | Cinza urbano (concreto paulistano) |
| `offwhite` | `#FAF9F6` | Fundo |

Tipografia: **Playfair Display** (títulos) + **Inter** (corpo). Componentes decorativos reutilizáveis: `WaveDivider`/`CopacabanaWaves` (ondas do calçadão) e `SaoPauloSilhouette`/`RioSpEmblem` (silhueta de SP).

---

## 🚀 Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Copie o exemplo e preencha:

```bash
cp .env.example .env.local
```

| Variável | Onde obter |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (**secreta!**) |
| `MERCADOPAGO_ACCESS_TOKEN` | Mercado Pago → Suas integrações → Credenciais |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Mercado Pago → Credenciais (public key) |
| `RESEND_API_KEY` | Resend → API Keys |
| `RESEND_FROM_EMAIL` | Remetente verificado (ex: `Kafamento <casal@kafamento.com.br>`) |
| `ADMIN_EMAIL` | E-mail autorizado no painel `/admin` |
| `NEXTAUTH_SECRET` | String aleatória (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_BASE_URL` | `https://kafamento.com.br` (ou `http://localhost:3000` em dev) |

### 3. Banco de dados (Supabase)

No **SQL Editor** do Supabase, rode na ordem:

1. `supabase/schema.sql` — cria tabelas (`rsvps`, `gifts`, `gift_quotas`, `recados`), índices, RLS e bucket de Storage.
2. `supabase/seed.sql` — popula os presentes de exemplo com suas cotas.

> **Segurança (RLS):** as tabelas têm Row Level Security **ativo e sem políticas para o papel anônimo**. Todo acesso a dados acontece no servidor com a *service role key* (que ignora RLS). A *anon key* no navegador é usada apenas para o login do Auth.

### 4. Criar o usuário admin

No painel do Supabase → **Authentication → Users → Add user**, crie um usuário com o e-mail definido em `ADMIN_EMAIL` e uma senha. É com ele que você entra em `/admin`.

### 5. Rodar

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O painel fica em `/admin` (login em `/admin/login`).

---

## 💳 Configurar o webhook do Mercado Pago

O fluxo de presente:

1. Convidado clica em **Presentear** → `POST /api/checkout` cria uma **preferência** (Checkout Pro) com `external_reference` ligando as cotas escolhidas.
2. Convidado é redirecionado ao Checkout Pro e paga (cartão, Pix ou boleto).
3. O Mercado Pago notifica o **webhook** → `POST /api/webhooks/mercadopago`.
4. O webhook consulta o pagamento; se `approved`, marca as cotas como **`paid`**, grava `mercadopago_payment_id` e dispara o e-mail de agradecimento via Resend.

### Passos no painel do Mercado Pago

1. Vá em **Suas integrações → (sua aplicação) → Webhooks** (ou *Notificações*).
2. Cadastre a URL de produção:
   ```
   https://kafamento.com.br/api/webhooks/mercadopago
   ```
3. Marque o evento **Pagamentos** (`payment`).
4. Salve. Use o **modo de teste** com as credenciais `TEST-...` antes de ir para produção.

> A `notification_url` também é enviada por requisição na criação da preferência (em `src/app/api/checkout/route.ts`), então o webhook funciona mesmo sem o cadastro manual — mas cadastrar no painel é o recomendado.

### Testar localmente

Use um túnel (ex: `ngrok http 3000`) e aponte temporariamente `NEXT_PUBLIC_BASE_URL` para a URL do túnel, ou cadastre a URL do túnel no painel do MP.

---

## 📧 E-mails (Resend)

- **RSVP confirmado** → e-mail de boas-vindas ao convidado.
- **Presente pago** → e-mail de agradecimento ao pagador.

Verifique seu domínio no Resend e ajuste `RESEND_FROM_EMAIL`. Sem `RESEND_API_KEY`, os envios são apenas ignorados (o app continua funcionando).

---

## 🗂️ Estrutura

```
src/
├── app/
│   ├── (site)/                 # Site público (Navbar + Footer)
│   │   ├── page.tsx            # Home (hero + contador)
│   │   ├── nossa-historia/     # Timeline + mural de recados
│   │   ├── informacoes/        # Local, dress code, mapa
│   │   ├── cronograma/         # Linha do tempo do dia
│   │   ├── presentes/          # Lista de presentes
│   │   ├── confirmar-presenca/ # RSVP
│   │   └── faq/                # Accordion
│   ├── admin/
│   │   ├── login/              # Login (Supabase Auth)
│   │   └── (dash)/             # Área protegida
│   │       ├── page.tsx        # Dashboard
│   │       ├── rsvps/          # Confirmações + export CSV
│   │       ├── presentes/      # CRUD de presentes + cotas
│   │       └── pagamentos/     # Histórico de pagamentos
│   └── api/
│       ├── rsvp/               # Salva RSVP + e-mail
│       ├── recados/            # Mural de recados
│       ├── checkout/           # Cria preferência Mercado Pago
│       ├── webhooks/mercadopago/  # Confirma pagamentos
│       └── admin/gifts/        # CRUD de presentes (protegido)
├── components/                 # UI + decorativos (ondas, silhueta)
├── lib/                        # supabase, mercadopago, email, utils
└── middleware.ts               # Refresh de sessão no /admin
supabase/
├── schema.sql                  # Tabelas, RLS, Storage
└── seed.sql                    # Presentes de exemplo
```

---

## ☁️ Deploy na Vercel

1. Importe o repositório na Vercel (root: `website/`).
2. Configure **todas** as variáveis de ambiente do `.env.example` em *Project Settings → Environment Variables*.
3. Aponte o domínio `kafamento.com.br`.
4. Após o deploy, cadastre o webhook do Mercado Pago com a URL de produção.

Tudo no fuso **America/Sao_Paulo** (datas formatadas via `Intl` com `timeZone`).

---

Feito com café paulistano ☕ e água de coco carioca 🥥.
