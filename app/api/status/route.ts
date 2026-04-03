import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  const today = new Date().toISOString().slice(0, 10)
  const logPath = path.resolve("spend-log.json")
  let log: Record<string, any> = {}
  try {
    log = JSON.parse(fs.readFileSync(logPath, "utf8"))
  } catch (e) {}

  const dayData = log[today] || { total: "0", txs: [] }
  const dailyCap = 0.01
  const dailySpent = parseFloat(dayData.total)
  const remaining = Math.max(0, dailyCap - dailySpent)

  return NextResponse.json({
    agentAddress: process.env.AGENT_ADDRESS,
    maxPerTx: "0.005",
    dailyCap: "0.01",
    dailySpent: dailySpent.toString(),
    remaining: remaining.toString(),
    txHistory: dayData.txs
  })
}
