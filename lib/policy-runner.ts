import { spawnSync } from "child_process"
import path from "path"
import { ethers } from "ethers"

export function checkPolicy(to: string, valueEth: string): { allow: boolean; reason?: string } {
  const context = {
    transaction: {
      to,
      value: "0x" + ethers.parseEther(valueEth).toString(16),
      data: "0x"
    },
    chainId: "eip155:84532",
    timestamp: new Date().toISOString()
  }
  const result = spawnSync(
    process.execPath,
    [path.resolve("policy/max-spend.js")],
    { input: JSON.stringify(context), encoding: "utf8" }
  )
  return JSON.parse(result.stdout)
}
