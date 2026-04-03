# Spending Guard

OWS (Open Wallet Standard) policy-gated AI agent spending demo on Base Sepolia.

## Architecture

```
Next.js Frontend → API Routes → OWS Policy Check → OWS Sign TX → Base Sepolia Broadcast
```

## Prerequisites

- Node.js 18+
- OWS CLI installed and configured with wallet `my-agent`
- Base Sepolia testnet ETH in agent wallet

## Getting Started

First, install dependencies:

```bash
npm install
```

Configure environment variables in `.env.local`:

```
AGENT_ADDRESS=0x6374B101994e769C11D2BCCEE4278dFD8dd21d76
RPC_URL=https://sepolia.base.org
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
├── policy/
│   └── max-spend.js          # OWS policy executable
├── lib/
│   ├── ows-signer.ts         # OWS transaction signing
│   └── policy-runner.ts      # Policy execution wrapper
├── app/
│   ├── page.tsx              # Main UI
│   ├── layout.tsx            # Root layout
│   └── api/
│       ├── send/             # POST /api/send - Send transaction
│       ├── status/           # GET /api/status - Agent status
│       └── balance/          # GET /api/balance - Agent balance
├── spend-log.json            # Spending log (auto-updated)
└── .env.local                # Environment variables
```

## OWS Policy

The `policy/max-spend.js` enforces:
- **Max per transaction:** 0.005 ETH
- **Daily cap:** 0.01 ETH

## API Endpoints

### POST /api/send
Send a transaction (policy-gated).
```json
{ "to": "0x...", "valueEth": "0.001" }
```

### GET /api/status
Get agent status and spending summary.

### GET /api/balance
Get agent ETH balance.

## Key Rules

- OWS `execSync` only runs server-side in `lib/` files
- No private keys stored anywhere
- Policy checks run before every transaction
- Spending logged to `spend-log.json`

## Learn More

- [OWS Documentation](https://openwallet.sh/)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Next.js Documentation](https://nextjs.org/docs)
