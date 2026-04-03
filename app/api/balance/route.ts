import { NextResponse } from "next/server"
import { provider } from "@/lib/ows-signer"

export async function GET() {
  const balance = await provider.getBalance(process.env.AGENT_ADDRESS!)
  const balanceEth = Number(balance) / 1e18
  return NextResponse.json({ balance: balanceEth.toString() })
}
