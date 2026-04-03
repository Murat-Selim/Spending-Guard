import { NextRequest, NextResponse } from "next/server"
import { checkPolicy } from "@/lib/policy-runner"
import { owsSendTx } from "@/lib/ows-signer"
import fs from "fs"
import path from "path"

export async function POST(req: NextRequest) {
  const { to, valueEth } = await req.json()
  const policyResult = checkPolicy(to, valueEth)

  if (!policyResult.allow) {
    return NextResponse.json({ success: false, blocked: true, reason: policyResult.reason })
  }

  try {
    const { hash } = await owsSendTx(to, valueEth)
    const today = new Date().toISOString().slice(0, 10)
    const logPath = path.resolve("spend-log.json")
    let log: Record<string, any> = {}
    try {
      log = JSON.parse(fs.readFileSync(logPath, "utf8"))
    } catch (e) {}

    if (!log[today]) {
      log[today] = { total: "0", txs: [] }
    }

    const currentTotal = parseFloat(log[today].total)
    log[today].total = (currentTotal + parseFloat(valueEth)).toString()
    log[today].txs.push({
      hash,
      to,
      value: valueEth,
      time: new Date().toISOString()
    })

    fs.writeFileSync(logPath, JSON.stringify(log, null, 2))
    return NextResponse.json({ success: true, hash })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
