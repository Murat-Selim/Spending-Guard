import { execSync } from "child_process";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
async function run() {
  const tx = {
    to: "0x1234567890123456789012345678901234567890",
    value: 1000n,
    chainId: 84532,
    nonce: 0,
    gasLimit: 21000n,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 1000000000n,
  }
  const txObj = ethers.Transaction.from(tx);
  const unsigned = txObj.unsignedSerialized;
  const out = execSync(`ows sign tx --wallet my-agent --chain eip155:84532 --tx ${unsigned.slice(2)}`).toString().trim();
  
  txObj.signature = ethers.Signature.from("0x" + out);
  console.log("fullySigned:", txObj.serialized);
  
  // Just parsing it back to verify
  const parsedBack = ethers.Transaction.from(txObj.serialized);
  console.log("Recovered from:", parsedBack.from);
}
run();
