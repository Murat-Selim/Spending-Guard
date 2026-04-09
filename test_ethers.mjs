import { ethers } from "ethers";
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
  const u = ethers.Transaction.from(tx).unsignedSerialized;
  console.log("type2:", u, u.slice(2));

  const tx0 = {
    to: "0x1234567890123456789012345678901234567890",
    value: 1000n,
    chainId: 84532,
    nonce: 0,
    gasLimit: 21000n,
    gasPrice: 1000000000n,
  }
  const u0 = ethers.Transaction.from(tx0).unsignedSerialized;
  console.log("type0:", u0, u0.slice(2));
}
run();
