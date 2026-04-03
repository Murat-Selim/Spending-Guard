#!/usr/bin/env node
const fs = require("fs")
const path = require("path")

const MAX_PER_TX = 0.005
const DAILY_CAP = 0.01

function main() {
  const stdin = fs.readFileSync(0, "utf8")
  const context = JSON.parse(stdin)
  const valueWei = BigInt(context.transaction.value)
  const valueEth = Number(valueWei) / 1e18

  const today = new Date().toISOString().slice(0, 10)
  const logPath = path.resolve("spend-log.json")
  let log = {}
  try {
    log = JSON.parse(fs.readFileSync(logPath, "utf8"))
  } catch (e) {}

  const dayData = log[today] || { total: "0", txs: [] }
  const dailyTotal = parseFloat(dayData.total)

  if (valueEth > MAX_PER_TX) {
    console.log(JSON.stringify({ allow: false, reason: "Exceeds per-tx limit of 0.005 ETH" }))
    return
  }

  if (dailyTotal + valueEth > DAILY_CAP) {
    console.log(JSON.stringify({ allow: false, reason: "Exceeds daily cap of 0.01 ETH" }))
    return
  }

  console.log(JSON.stringify({ allow: true }))
}

main()
