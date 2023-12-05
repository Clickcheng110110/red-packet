import { bscTestnet, bsc } from "viem/chains";
import { Chain } from "wagmi";
import ASTRToken from "@/assets/images/ASTRToken.png";
import USDTToken from "@/assets/images/USDTToken.png";

export enum CoinEnum {
  "ASTR-USDT" = "ASTR-USDT",
}

export enum MSPID {
  LP = 0,
}

export enum PriceCate {
  Chainlink = "Chainlink",
  UniswapV2 = "UniswapV2",
}

export interface IPool {
  name: CoinEnum;
  icon1: string;
  icon2?: string;
  token: string;
  priceCategory: PriceCate;
  priceAddr?: string;
  decimals: number;
  pid: number;
  rewardPerSecond: string;
  ipo: string;
  tvl?: string;
  apr?: string;
  staked?: string;
  claimable?: string;
}

export interface IConfig {
  astr: string;
  usdt: string;
  lp: string;
  masterChief: string;
  ido: string;
  chainInfo: Chain;
  stakePools: any;
  userBind: string;
  nftMarket: string;
  nft: string;
  ls: string;
  burn: string;
  nftMerge: string;
  awardCenter: string;
}

const config: Record<Chain["id"], IConfig> = {
  [bscTestnet.id]: {
    astr: "0x5839240cAE7dabA5993E3D9b12A65A9868041E6A",
    usdt: "0x59f201CC9966946EfCE51c52de8Ae8C55E5FdCae",
    lp: "0xF44c5A51bE033a1d8c9Bd194484A7c4758EB336c",
    masterChief: "0xc19C629CCf63B4197fe4dE7F9A14A8EA985eF5AD",
    ido: "0x3FCF153371eCf98a26FDBEBC1fB71C8adA95d52E",
    userBind: "0xD38549F8E818A96efFB2d3F419675A2DF909bD36",
    nftMarket: "0x6B14eD9Ebe883928C9470518dC0009DB4D3364E4",
    nft: "0xFb07BdDC590371f89E5779eCbCc6Dfa014CC1eA4",
    ls: "0x2D3B3F21854895BaB64C005DAfFf0c2E4db0DBAa",
    nftMerge: "0xbdbdaf6ff37fe2ec2284d15332a0afba0db5988e",
    burn: "0xFecD4840d2857a3860ca4B54efCE86F9bD312fde",
    awardCenter: "0x8318C5cF7A4C74096eb6629dcD613723939F2E9B",
    chainInfo: bscTestnet,
    stakePools: [
      {
        name: CoinEnum["ASTR-USDT"],
        icon1: ASTRToken,
        icon2: USDTToken,
        token: "0x78c9Fc8891A0623C4e4d31A53d56cf8E761CafD9",
        priceCategory: PriceCate.UniswapV2,
        decimals: 18,
        pid: MSPID.LP,
        rewardPerSecond: "321502057613168724",
      },
    ],
  },
  [bsc.id]: {
    astr: "0x2b3559c3DBdB294cbb71f2B30a693F4C6be6132d",
    usdt: "0x55d398326f99059ff775485246999027b3197955",
    lp: "0xfa80b6d671B9c4322cD34AD6C8F79B3494A3e310",
    masterChief: "0x2C28e2Cd0c591aca928d39b3439285BE976657EB",
    ido: "0x03e60C5a7115ea50b4dafCB00abD8E96c0a19D2b",
    userBind: "0xedF16632CaC24aBA5541128daDC6a66e08160913",
    nftMarket: "0xe7C77e58adaD0B1BE4360c0C7bEc4FD853F07FEe",
    nft: "0xC3a28b7ea6F36F897517bF51CCDC29A6384a13Fa",
    ls: "0x2D3B3F21854895BaB64C005DAfFf0c2E4db0DBAa",
    nftMerge: "0x7366FD8033b88DaC0b7CF6A70b6100C66a843b2f",
    burn: "0xFecD4840d2857a3860ca4B54efCE86F9bD312fde",
    awardCenter: "",
    chainInfo: bsc,
    stakePools: [
      {
        name: CoinEnum["ASTR-USDT"],
        icon1: ASTRToken,
        icon2: USDTToken,
        token: "0xfa80b6d671B9c4322cD34AD6C8F79B3494A3e310",
        priceCategory: PriceCate.UniswapV2,
        decimals: 18,
        pid: MSPID.LP,
        rewardPerSecond: "50000000000000000",
      },
    ],
  },
};

export default config;
