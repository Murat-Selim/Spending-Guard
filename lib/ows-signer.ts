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
  let gasLimit = BigInt(21000)
  try {
    gasLimit = await provider.estimateGas(txRequest)
  } catch (e) {
    console.warn("Gas estimation failed, defaulting to 21000", e)
  }

  const tx = {
    to: txRequest.to,
    value: txRequest.value,
    chainId: 84532,
    nonce: await provider.getTransactionCount(AGENT_ADDRESS),
    gasLimit,
    ...populated,
  }

  const txObj = ethers.Transaction.from(tx)
  const unsigned = txObj.unsignedSerialized
  
  const signedSig = execSync(
    `ows sign tx --wallet my-agent --chain eip155:84532 --tx ${unsigned.slice(2)}`
  ).toString().trim()
  
  txObj.signature = ethers.Signature.from("0x" + signedSig)
  const fullySigned = txObj.serialized

  const broadcastTx = await provider.broadcastTransaction(fullySigned)
  return { hash: broadcastTx.hash }
}

export { provider }
