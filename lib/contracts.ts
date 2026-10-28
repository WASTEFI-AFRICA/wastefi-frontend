/**
 * The WasteFi smart contracts deployed on Stellar testnet.
 *
 * Copied from deployed_addresses_testnet.json in wastefi-contracts, which
 * scripts/deploy-testnet.sh rewrites on every deployment. Update this file when that
 * one changes. Testnet is reset from time to time, so these links stop resolving
 * after a reset until the contracts are redeployed.
 */

export const CONTRACT_NETWORK = "Stellar testnet";
export const CONTRACT_DEPLOYED_ON = "2026-10-28";
export const CONTRACT_DEPLOYER = "GBPLV2IDOG7E2UQEDHTN2ZZA3OGUECFHM5F54S3F65QEUR5EATJA3Y4L";

export interface DeployedContract {
  key: string;
  name: string;
  purpose: string;
  address: string;
}

export const DEPLOYED_CONTRACTS: DeployedContract[] = [
  { key: "waste_token", name: "Waste Token", purpose: "The reward token, with a capped supply", address: "CDOK6OEYIINSA2KP23UU72BSNST7PFNVD67DI2PDELCZIQYUV7XK7SH6" },
  { key: "collector_registry", name: "Collector Registry", purpose: "Who is registered and whether they are active", address: "CCP4QOY57OKA6DNRU2XG5AD5B2YSVNSUG7BRVWR5XJRDMGY62VQ7JHII" },
  { key: "collection_point", name: "Collection Point", purpose: "Registered, verified collection points", address: "CDDY7OUFFZ32K2FCISKMKN2B7BPPFW7PS7OE4GHFXX5WR4547C4MOA34" },
  { key: "material_pricing", name: "Material Pricing", purpose: "Price per kilogram for each material", address: "CA6BP7PC7OPZPT4MFHIJAPXB237BVP72GVNVPI67GPH3QYYBCJDN2Z5G" },
  { key: "reputation", name: "Reputation", purpose: "Collector scores from verified history", address: "CCXDYT3RIM2D356CYUZJ7SVD5PRFUVNJDZDAKSI5WITMMW5QMXZHIB5A" },
  { key: "waste_transaction", name: "Waste Transaction", purpose: "Records and verifies each delivery", address: "CAFC4QX3LOQKTPZLWJ52XXE7H5NO7PGVBG4IVGA4BN3E6YT6TIDDL7UP" },
  { key: "payment_distribution", name: "Payment Distribution", purpose: "Records the payout and mints WASTE when it completes", address: "CARON3S57TTYVHG7C3DMOGIQH5GSYTAOOH325AOX5KQJRYGSFD3RT2JO" },
];

export function contractExplorerUrl(address: string): string {
  return `https://stellar.expert/explorer/testnet/contract/${address}`;
}

export function accountExplorerUrl(address: string): string {
  return `https://stellar.expert/explorer/testnet/account/${address}`;
}
