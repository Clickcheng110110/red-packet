import { Signer, ethers } from 'ethers';
import uniswapV2PairABI from '@/contracts/abis/uniswapV2PairABI.json';
import BigNumber from 'bignumber.js';

export const defaultASTRPrice = 0.15;
export const USDTPrice = '1';

export const getASTRPrice = async (
  lp: string,
  signerOrProvider: ethers.providers.Web3Provider | Signer
) => {
  const pairAddress = lp;
  // 创建 Uniswap V2 Pair 合约实例
  const uniswapV2Pair = new ethers.Contract(
    pairAddress as string,
    uniswapV2PairABI,
    signerOrProvider
  );
  // 获取交易对的储备量
  const reserves = await uniswapV2Pair.getReserves();
  const reserve0 = reserves._reserve0;
  const reserve1 = reserves._reserve1;
  // 计算价格
  let astrPrice;
  if (new BigNumber(reserve0 / 1).eq(0)) {
    // 如果交易为0， 则取公售价格
    astrPrice = `${defaultASTRPrice}`;
  } else {
    const price = reserve1 / reserve0;
    astrPrice = new BigNumber(USDTPrice).times(price).toString();
  }
  return astrPrice;
};
