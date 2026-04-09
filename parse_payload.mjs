import { ethers } from "ethers";

const raw = "0xd66c13618fd4cac184c131f375642226d4b89da19f04eac1e75321ec8c7d75f65dd2eb7347370a989e05b61ec8c98cf826c2450e323f0f09a2a78e67d0d38e5d01";

try {
  const tx = ethers.Transaction.from(raw);
  console.log("Parsed:", tx);
} catch (e) {
  console.error("Error parsing globally:", e.message);
}
