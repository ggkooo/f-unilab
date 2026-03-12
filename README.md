# UniLab Frontend Totem

Aplicacao frontend do fluxo de senhas e atendimento da UniLab.

O projeto foi desenvolvido com React + TypeScript + Vite e possui duas areas principais:

- Tela publica para emissao de senha.
- Tela protegida de atendente para chamar e concluir senhas.

## Sumario

- Visao geral
- Stack e dependencias
- Estrutura do projeto
- Requisitos
- Configuracao do ambiente
- Execucao local
- Rotas da aplicacao
- Integracao com API
- Autenticacao e sessao
- Scripts disponiveis
- Padroes de desenvolvimento
- Troubleshooting

## Visao geral

Principais funcionalidades implementadas:

- Emissao de senha por tipo de servico.
- Feedback visual de sucesso e erro no fluxo de emissao.
- Painel de atendente com:
  - fila em espera,
  - atendimento atual,
  - historico de concluidos.
- Chamada de senha e conclusao de atendimento via API.
- Selecao de senha por tipo na tela do atendente.
- Polling automatico para manter fila/historico atualizados.

## Stack e dependencias

- React 19
- TypeScript 5
- Vite 7
- React Router DOM 7
- ESLint 9
- Tailwind CSS (utilizado via CDN no `index.html`)
- Google Material Icons Outlined

## Estrutura do projeto

```text
.
|-- .env
|-- .env.example
|-- index.html
|-- package.json
|-- src/
|   |-- App.tsx
|   |-- main.tsx
|   |-- auth/
|   |   |-- session.ts
|   |-- components/
|   |   |-- auth/
|   |   |   |-- ProtectedRoute.tsx
|   |   |-- layout/
|   |   |   |-- Footer/index.tsx
|   |   |   |-- Header/index.tsx
|   |   |   |-- Layout/index.tsx
|   |   |-- ui/
|   |       |-- ActionCard/index.tsx
|   |       |-- CustomSelect/index.tsx
|   |-- screens/
|   |   |-- GetTicket/
|   |   |   |-- components/
|   |   |   |   |-- GetTicketFeedback.tsx
|   |   |   |   |-- GetTicketHero.tsx
|   |   |   |   |-- ServiceOptionsGrid.tsx
|   |   |   |-- constants.ts
|   |   |   |-- index.tsx
|   |   |   |-- types.ts
|   |   |-- Attendent/
|   |       |-- components/
|   |       |   |-- AttendantTopBar.tsx
|   |       |   |-- CurrentAttendanceCard.tsx
|   |       |   |-- HistorySection.tsx
|   |       |   |-- WaitingQueueSection.tsx
|   |       |-- index.tsx
|   |       |-- types.ts
|   |       |-- utils.ts
|   |-- services/
|       |-- apiConfig.ts
|       |-- attendantService.ts
|       |-- ticketService.ts
```

## Requisitos

- Node.js 20+
- npm 10+

## Configuracao do ambiente

1. Instale as dependencias:

```bash
npm install
```

2. Configure as variaveis de ambiente a partir do `.env.example`:

```bash
cp .env.example .env
```

Se estiver no Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Ajuste os valores no `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TICKETS_PATH=/tickets
VITE_API_KEY=your-api-key-here
VITE_API_TIMEOUT_MS=10000
```

Descricao das variaveis:

- `VITE_API_BASE_URL`: URL base da API.
- `VITE_API_TICKETS_PATH`: caminho base do recurso de senhas.
- `VITE_API_KEY`: chave opcional enviada como `X-API-KEY`.
- `VITE_API_TIMEOUT_MS`: timeout das requisicoes em milissegundos.

## Execucao local

Suba o servidor de desenvolvimento:

```bash
npm run dev
```

URL padrao do Vite:

- `http://localhost:5173`

Para validar build de producao:

```bash
npm run build
```

Para visualizar o build local:

```bash
npm run preview
```

## Rotas da aplicacao

As rotas estao definidas no `src/App.tsx`:

- `/`: tela publica de emissao de senha (`GetTicket`).
- `/attendent`: tela protegida de atendimento (`Attendant`).

## Integracao com API

### Configuracao central

Arquivo: `src/services/apiConfig.ts`

- Normaliza URL base e paths.
- Concentra `baseUrl`, `ticketsPath`, `apiKey` e `timeoutMs`.

### Fluxo GetTicket

Arquivo: `src/services/ticketService.ts`

Endpoint principal:

- `POST {baseUrl}{ticketsPath}`

Body esperado:

```json
{
  "service_type": "Atendimento Normal"
}
```

Comportamento:

- Timeout com `AbortController`.
- Leitura de mensagem da API (`message`) quando disponivel.
- Fallback para mensagens padrao em timeout/falha de rede.

### Fluxo Attendent

Arquivo: `src/services/attendantService.ts`

Operacoes implementadas:

- `GET {baseUrl}{ticketsPath}`: lista fila e filtra pendentes.
- `GET {baseUrl}{ticketsPath}/completed`: lista historico concluido.
- `POST {baseUrl}{ticketsPath}/{id}/call`: chama senha.
- `PATCH {baseUrl}{ticketsPath}/{id}/complete`: conclui senha.

Headers utilizados conforme contexto:

- `Content-Type: application/json`
- `X-API-KEY: <VITE_API_KEY>` (quando definido)
- `Authorization: Bearer <token>` (rotas autenticadas)

## Autenticacao e sessao

Arquivos principais:

- `src/auth/session.ts`
- `src/components/auth/ProtectedRoute.tsx`

Regras atuais:

- Sessao lida de `sessionStorage` na chave `totem_auth`.
- `ProtectedRoute` exige `access_token` para liberar rota protegida.
- Sem token, o usuario e redirecionado para `/login`.

Formato esperado da sessao (resumo):

- `data.access_token`
- `data.user.login`
- `data.user.is_admin`

## Scripts disponiveis

- `npm run dev`: sobe ambiente de desenvolvimento.
- `npm run build`: executa type-check e build de producao.
- `npm run preview`: publica build local para validacao.
- `npm run lint`: executa lint do projeto.

## Padroes de desenvolvimento

- Camada de API separada em `services`.
- Componentes de tela separados por responsabilidade.
- Tipos e utilitarios isolados por modulo (`types.ts`, `utils.ts`).
- Erros de rede e timeout tratados explicitamente.

## Troubleshooting

Problemas comuns:

- `Falha de comunicacao com a API`:
  - verifique se backend esta ativo,
  - confirme `VITE_API_BASE_URL` e `VITE_API_TICKETS_PATH`.
- Erro de autorizacao em rotas de atendente:
  - confirme presenca do token em `sessionStorage` (`totem_auth`),
  - valide expiracao do token no backend.
- Build falha por tipos:
  - execute `npm run build` para ver erro completo,
  - ajuste imports/caminhos conforme estrutura atual de pastas.

## Status atual

- Fluxo de emissao funcionando com feedback.
- Tela de atendente modularizada por componentes e service dedicado.
- Build de producao validado com sucesso.
