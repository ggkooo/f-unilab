# UniLab Tickets Manager

Frontend application for creating digital service tickets for UniLab attendance flows.

The project is built with React + TypeScript + Vite and currently provides a single ticket request flow with service options, API integration, and user feedback handling.

## Features

- Ticket creation screen with service cards.
- Visual layout with reusable `Header`, `Footer`, and `Layout` components.
- Ticket request sent to API through a dedicated service layer.
- API configuration via environment variables.
- Automatic success message dismissal after 3 seconds.
- Error feedback handling for API/network/timeout cases.
- Route-based entry point using `react-router-dom`.

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- React Router DOM 7
- ESLint 9
- Tailwind CSS (via CDN in `index.html`)
- Google Material Icons (Outlined)

## Project Structure

```text
.
|-- index.html
|-- package.json
|-- src/
|   |-- App.tsx
|   |-- main.tsx
|   |-- vite-env.d.ts
|   |-- assets/
|   |   |-- logo-unilab.png
|   |-- components/
|   |   |-- layout/
|   |   |   |-- Footer/index.tsx
|   |   |   |-- Header/index.tsx
|   |   |   |-- Layout/index.tsx
|   |   |-- ui/
|   |   |   |-- ActionCard/index.tsx
|   |-- screens/
|   |   |-- GetTicket/
|   |   |   |-- components/
|   |   |   |   |-- GetTicketFeedback.tsx
|   |   |   |   |-- GetTicketHero.tsx
|   |   |   |   |-- ServiceOptionsGrid.tsx
|   |   |   |-- constants.ts
|   |   |   |-- index.tsx
|   |   |   |-- types.ts
|   |-- services/
|   |   |-- apiConfig.ts
|   |   |-- ticketService.ts
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and update values if needed:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TICKETS_PATH=/tickets
VITE_API_KEY=your-api-key-here
VITE_API_TIMEOUT_MS=10000
```

Variables:

- `VITE_API_BASE_URL`: API base URL.
- `VITE_API_TICKETS_PATH`: Tickets endpoint path.
- `VITE_API_KEY`: Optional API key sent as `X-API-KEY`.
- `VITE_API_TIMEOUT_MS`: Request timeout in milliseconds.

### 3. Run locally

```bash
npm run dev
```

App default URL: `http://localhost:5173`

## Available Scripts

- `npm run dev`: Start development server.
- `npm run build`: Type-check and build production bundle.
- `npm run preview`: Preview production build locally.
- `npm run lint`: Run ESLint.

## Routing

- `/`: Get Ticket screen.

Routing is configured in `src/App.tsx` with `BrowserRouter` and `Routes`.

## API Integration

Ticket creation is isolated in `src/services/ticketService.ts`.

### Request

- Method: `POST`
- URL: `${VITE_API_BASE_URL}${VITE_API_TICKETS_PATH}`
- Headers:
  - `Content-Type: application/json`
  - `X-API-KEY: <VITE_API_KEY>` (only when provided)
- Body:

```json
{
  "service_type": "Atendimento Normal"
}
```

### Service behavior

- Uses `AbortController` timeout based on `VITE_API_TIMEOUT_MS`.
- Parses API error message when available (`message` field).
- Returns fallback messages for timeout and network failures.

## UI and UX Behavior

- Service cards trigger ticket creation.
- While submitting, the selected card subtitle changes to a loading message.
- On success:
  - Shows success feedback.
  - Automatically hides feedback after 3 seconds.
- On failure:
  - Shows error feedback and keeps it visible until next interaction.

## Code Organization Notes

- Screen container logic is in `src/screens/GetTicket/index.tsx`.
- Visual sections were split into focused components:
  - hero block
  - feedback alert
  - service options grid
- API settings are centralized in `src/services/apiConfig.ts`.

## Security Notes

- `.env` files are ignored by Git.
- Keep real API keys only in local or secret-managed environments.
- Commit only `.env.example` with placeholder values.

## Current Status

- Main ticket flow implemented and build passing.
- Modular structure ready for additional screens and services.
