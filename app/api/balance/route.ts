import { NextResponse } from "next/server"
import { provider } from "@/lib/ows-signer"

export async function GET() {
  const agentAddress = process.env.AGENT_ADDRESS
  if (!agentAddress) {
    return NextResponse.json({ error: "AGENT_ADDRESS not configured" }, { status: 500 })
  }
  const balance = await provider.getBalance(agentAddress)
  const balanceEth = Number(balance) / 1e18
  return NextResponse.json({ balance: balanceEth.toString() })
}
