const { execSync } = require("child_process");
const { ethers } = require("ethers");

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
  const u = ethers.Transaction.from(tx).unsignedSerialized;
  console.log("u:", u);
  const out = execSync(`ows sign tx --wallet my-agent --chain eip155:84532 --tx ${u.slice(2)}`).toString().trim();
  console.log("out:", out);
}
run();
