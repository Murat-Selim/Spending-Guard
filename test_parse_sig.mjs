import { ethers } from "ethers";

const sigHex = "0x2091f9bc83d372567434cf639f9ffb411368f842480a188aa766b63ae878db0a2aa19a7ce7cb8d9500d0d44135d745d4b4fa3239b87d9ebb77aad55724b0901a00";

try {
  // Is it r (32), s (32), v (1)?
  const r = sigHex.slice(0, 66);
  const s = "0x" + sigHex.slice(66, 130);
  const v = "0x" + sigHex.slice(130, 132);
  console.log({r, s, parseIntV: parseInt(v, 16)});

  const sig = ethers.Signature.from(sigHex);
  console.log("ethers sig parsed natively:", sig);
} catch (e) {
  console.error("Error natively parsing:", e.message);
}
