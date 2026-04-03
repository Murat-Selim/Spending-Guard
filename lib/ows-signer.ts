import { ethers } from "ethers"
import { execSync } from "child_process"

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const AGENT_ADDRESS = process.env.AGENT_ADDRESS!

export async function owsSendTx(to: string, valueEth: string): Promise<{ hash: string }> {
  const txRequest = {
    from: AGENT_ADDRESS,
    to,
    value: ethers.parseEther(valueEth),
  }
  const populated = await provider.getFeeData()
  const tx = {
    to: txRequest.to,
    value: txRequest.value,
    chainId: 84532,
    nonce: await provider.getTransactionCount(process.env.AGENT_ADDRESS!),
    ...populated,
  }
  const unsigned = ethers.Transaction.from(tx).unsignedSerialized
  const signed = execSync(
    `ows sign tx --wallet my-agent --chain eip155:84532 --tx ${unsigned.slice(2)}`
  ).toString().trim()
  const broadcastTx = await provider.broadcastTransaction("0x" + signed)
  return { hash: broadcastTx.hash }
}

export { provider }
