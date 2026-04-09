import { ethers } from "ethers";
async function run() {
  const tx = {
    to: "0x1234567890123456789012345678901234567890",
    value: 1000n,
    chainId: 84532,
    nonce: 0,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 1000000000n,
  }
  const u = ethers.Transaction.from(tx).unsignedSerialized;
  console.log("type2 no gasLimit:", u, u.slice(2));
}
run();
