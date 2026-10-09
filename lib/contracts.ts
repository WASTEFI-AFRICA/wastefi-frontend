/**
 * The WasteFi smart contracts deployed on Stellar testnet.
 *
 * Copied from deployed_addresses_testnet.json in wastefi-contracts, which
 * scripts/deploy-testnet.sh rewrites on every deployment. Update this file when that
 * one changes. Testnet is reset from time to time, so these links stop resolving
 * after a reset until the contracts are redeployed.
 */

export const CONTRACT_NETWORK = "Stellar testnet";
export const CONTRACT_DEPLOYED_ON = "2026-10-09";
export const CONTRACT_DEPLOYER = "GBPLV2IDOG7E2UQEDHTN2ZZA3OGUECFHM5F54S3F65QEUR5EATJA3Y4L";

export interface DeployedContract {
  key: string;
  name: string;
  purpose: string;
  address: string;
}

export const DEPLOYED_CONTRACTS: DeployedContract[] = [
  { key: "waste_token", name: "Waste Token", purpose: "The reward token, with a capped supply", address: "CBSHEPK3FDF4E4A3NE25S6M4RDTJOJZGQVDG7PDLM4R2YLLBJMYTHDCS" },
  { key: "collector_registry", name: "Collector Registry", purpose: "Who is registered and whether they are active", address: "CC6OULJTBVRE3TJBEXG5TAUIFXDF2JAARMSK6EKDCYK6FPQFCRUUKHJE" },
  { key: "collection_point", name: "Collection Point", purpose: "Registered, verified collection points", address: "CDXRC6LFSXMSIHU3NXEOQE4OM7BA45NTYJS3LUSNEX7Q54LNUSKKPL33" },
  { key: "material_pricing", name: "Material Pricing", purpose: "Price per kilogram for each material", address: "CBDQDXBEG7V3URBZR5HAOZF4ESICV3UZ5WDEO6NJQ5E2QLKPBEDVW45D" },
  { key: "reputation", name: "Reputation", purpose: "Collector scores from verified history", address: "CARIL3VA74YS6JYA6P4D4MDAW3GFMSMWJ4JUMTM3RZWDKOTUU5ZIVWJG" },
  { key: "waste_transaction", name: "Waste Transaction", purpose: "Records and verifies each delivery", address: "CDB2G3EVSRIG5UKRTEKGFT3CM6VJYAFVAQAV2DLOTC6U3UISSLB4LV2X" },
  { key: "payment_distribution", name: "Payment Distribution", purpose: "Records the payout owed for a verified delivery", address: "CDEXPCJ7IR3LL7GW3QWETNOTISUYWUCKPUJ2JPKPKYTMKDTVXVWJJYKN" },
];

export function contractExplorerUrl(address: string): string {
  return `https://stellar.expert/explorer/testnet/contract/${address}`;
}

export function accountExplorerUrl(address: string): string {
  return `https://stellar.expert/explorer/testnet/account/${address}`;
}
