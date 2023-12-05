import React from "react";
import { Flex, Stack, Image } from "@chakra-ui/react";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import type { GetStaticProps } from "next";

import Text from "@/components/Text";
import LPInfoItem from "@/components/LPInfoItem";

import BaseButton from "@/components/BaseButton";
import AddLPModalContent from "@/components/Modals/AddLPModalContent";
import RemoveLPModalContent from "@/components/Modals/RemoveLpModalContent";
import useModal from "@/hooks/useModal";
import { useConfigContext } from "@/context/ConfigContext";
import { useContractsContext } from "@/context/ContractsContext";
import { IPool, MSPID } from "@/config";
import { erc20Abi } from "@/contracts/abis";
import px2vw from "@/theme/utils/px2vw";
import { USDTPrice, getASTRPrice } from "@/utils/astr";
import { cutZero, formatValue, fromWei } from "@/utils/common";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useTransaction from "@/hooks/useTransaction";
import uniswapV2PairABI from "@/contracts/abis/uniswapV2PairABI.json";

import ASTRToken from "@/assets/images/ASTRToken.png";
import USDTToken from "@/assets/images/USDTToken.png";
import panelBG1 from "@/assets/images/panelBG1.png";
import panelBG2 from "@/assets/images/panelBG2.png";
import panelBG3 from "@/assets/images/panelBG3.png";

type Props = {
  // Add custom props here
};

function Index() {
  const { config, provider, signerOrProvider, address } = useConfigContext();
  const { masterChiefContract, lpContract } = useContractsContext();
  const { t } = useTranslation(["lp"]);
  const claim = useTransaction(masterChiefContract?.claim, {
    wait: true,
  });

  const astrPriceState = useQuery({
    queryKey: ["handleGetAstrPrice", config],
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const res = await handleGetAstrPrice();
      return res;
    },
    refetchInterval: 5000,
  });

  const queryPoolState = useQuery({
    queryKey: ["queryPool", astrPriceState?.data, address],
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      if (!queryKey[2]) return null;
      const res = await queryPool();
      return res;
    },
    refetchInterval: 5000,
  });

  const astrPrice = astrPriceState?.data as string;
  const tvl = queryPoolState?.data?.[0]?.tvl;
  const apr = queryPoolState?.data?.[0]?.apr;
  const stakeBalance = queryPoolState?.data?.[0]?.stakeBalance?.toString();
  const lpBalance = queryPoolState?.data?.[0]?.lpBalance?.toString();
  const pendingReward = queryPoolState?.data?.[0]?.pendingReward?.toString();

  const claimDisabled = new BigNumber(pendingReward).lte(0);

  const [AddLPModal, addlpStatus] = useModal(AddLPModalContent, {
    width: 335,
    data: {
      lpBalance,
      refetch: queryPoolState.refetch,
    },
  });
  const [RemoveLPModal, removelpStatus] = useModal(RemoveLPModalContent, {
    width: 335,
    data: {
      stakeBalance,
      refetch: queryPoolState.refetch,
    },
  });

  const queryPool = async () => {
    const initPools = config?.stakePools;
    try {
      const masterChef = config?.masterChief;
      let totalTvl = "0";
      const list = await Promise.all(
        initPools?.map(async (item: IPool) => {
          let stakedToken;
          let tvl = "0";
          let pendingReward;
          let stakeBalance;
          let lpBalance;

          if (item.token === ethers.constants.AddressZero) {
            stakedToken = await provider?.getBalance(masterChef as string);
          } else {
            const tokenContarct = new ethers.Contract(
              item?.token,
              erc20Abi,
              signerOrProvider
            );

            stakedToken = await tokenContarct.balanceOf(masterChef);
          }
          // 二池
          // lp
          // 创建 Uniswap V2 Pair 合约实例
          const uniswapV2Pair = new ethers.Contract(
            item?.token,
            uniswapV2PairABI,
            provider
          );
          // 获取交易对的储备量
          const reserves = await uniswapV2Pair.getReserves();
          const reserve0 = reserves._reserve0;
          const reserve1 = reserves._reserve1;
          // console.log('获取交易对的储备量:', reserves, reserve0, reserve1)
          // 获取 LP Token 总供应量

          const totalSupply = await uniswapV2Pair.totalSupply();

          // 计算 1 个 LP Token 对应的底层资产数量
          const underlyingAssetsPerLPToken0 = new BigNumber(totalSupply / 1).eq(
            0
          )
            ? 0
            : reserve0 / totalSupply;
          const underlyingAssetsPerLPToken1 = new BigNumber(totalSupply / 1).eq(
            0
          )
            ? 0
            : reserve1 / totalSupply;
          // console.log(`1 LP Token = ${underlyingAssetsPerLPToken0} Token0`)
          // console.log(`1 LP Token = ${underlyingAssetsPerLPToken1} Token1`)

          tvl = new BigNumber(
            ethers.utils.formatUnits(stakedToken.toString(), 18)
          )
            .times(underlyingAssetsPerLPToken0)
            .times(astrPrice)
            .plus(
              new BigNumber(
                ethers.utils.formatUnits(stakedToken.toString(), 18)
              )
                .times(underlyingAssetsPerLPToken1)
                .times(USDTPrice)
            )
            .toString();

          totalTvl = new BigNumber(totalTvl).plus(tvl).toString();
          // APR = （每秒产量 × Token 价格 × 秒数每年）/ 质押总量
          const apr =
            tvl !== "0"
              ? new BigNumber(item?.rewardPerSecond)
                  .div(1e18)
                  .times(astrPrice)
                  .times(365 * 24 * 60 * 60)
                  .div(tvl)
                  .toString()
              : undefined;

          if (address) {
            const data = await Promise.all([
              masterChiefContract?.pendingReward(item.pid, address as string),
              lpContract?.balanceOf(address as string),
              masterChiefContract?.userInfo(item.pid, address),
            ]);
            pendingReward = fromWei(data[0]?.toString()).toString();
            lpBalance = fromWei(data[1]?.toString()).toString();
            stakeBalance = fromWei(data[2]?.amount?.toString());
          }

          return {
            ...item,
            tvl,
            apr,
            pendingReward,
            stakeBalance,
            lpBalance,
          };
        })
      );
      return list;
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetAstrPrice = async () => {
    try {
      const astrPrice = await getASTRPrice(
        config?.lp as string,
        provider as ethers.providers.Web3Provider
      );
      return astrPrice;
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleClaim = async () => {
    try {
      await claim.run(MSPID.LP);
      queryPoolState.refetch();
    } catch (error) {}
  };

  return (
    <Flex
      flexDirection="column"
      marginTop={{ base: px2vw(42), md: "80px" }}
      padding={{ base: `0 ${px2vw(20)} ${px2vw(20)}`, md: `0 0 60px` }}
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="row"
        spacing="10px"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          width={{ base: px2vw(86), md: "100%" }}
          type="gradient"
          fontSize={{ base: px2vw(20), md: "36px" }}
          fontWeight="700"
        >
          {t("stakeLpToEarnAstr")}
        </Text>
        <Image width="49px" src={ASTRToken} />
      </Stack>
      <Stack
        spacing={{ base: px2vw(20), md: "0" }}
        flexDirection={{ base: "column", md: "row" }}
        width={{ base: px2vw(330), md: "960px" }}
        // height={px2vw(300)}
        margin={{ base: `${px2vw(40)} 0`, md: "40px 0" }}
        justifyContent="space-between"
        alignItems={{ base: "center", md: "center" }}
        padding={{ base: px2vw(30), md: "25px 30px" }}
        // bgColor="black.500"
        boxShadow="0px 4px 40px rgba(6, 16, 43, 0.65)"
        // borderRadius="40px"
        bgImage={panelBG1}
        bgSize="100% 100%"
        bgRepeat="no-repeat"
        // border="1px solid "
      >
        <Text type="gradient" fontSize="24px" fontWeight="600">
          LSC/USDT
        </Text>
        <LPInfoItem
          width={{ base: "100%", md: "inherit" }}
          justifyContent={{ base: "space-between", md: "center" }}
          label="TVL"
          value={`$ ${formatValue(tvl)}`}
        />
        <LPInfoItem
          width={{ base: "100%", md: "inherit" }}
          justifyContent={{ base: "space-between", md: "center" }}
          label="APR"
          value={`${
            apr ? cutZero(new BigNumber(apr).times(100).toFormat(2)) : "--"
          }%`}
        />
        <BaseButton
          needLogin
          onClick={addlpStatus.onOpen}
          width={{ base: px2vw(240), md: "170px" }}
          background="linear-gradient(180deg, #BBDFF1 0%, #C4A9F3 100%)"
          fontSize="20px"
          color="black.100"
        >
          添加流动性
        </BaseButton>
      </Stack>
      <Stack
        direction={{ base: "column", md: "row" }}
        width={{ base: "100%", md: "960px" }}
        spacing={{ base: px2vw(40), md: "40px" }}
      >
        <Flex
          direction="column"
          flex="1"
          height={{ base: px2vw(298), md: "298px" }}
          padding="30px 0"
          alignItems="center"
          boxShadow="0px 4px 40px rgba(6, 16, 43, 0.65)"
          bgImage={panelBG2}
          bgSize="100% 100%"
        >
          <Text
            type="gradient"
            fontSize={{ base: px2vw(24), md: "15px" }}
            fontWeight="500"
          >
            {t("myAstrUsdtLp")}
          </Text>
          <Stack
            marginTop={{ base: px2vw(40), md: "40px" }}
            marginBottom={{ base: px2vw(15), md: "15px" }}
            direction="row"
            spacing={{ base: px2vw(10), md: "10px" }}
          >
            <Image src={ASTRToken} width={{ base: px2vw(40), md: "40px" }} />
            <Image src={USDTToken} width={{ base: px2vw(40), md: "40px" }} />
          </Stack>
          <Text
            marginBottom={{ base: px2vw(40), md: "40px" }}
            fontSize="18px"
            fontWeight="600"
            fontFamily="PingFang SC"
          >
            {formatValue(stakeBalance)}
          </Text>
          <Stack direction="row" spacing={{ base: px2vw(15), md: "40px" }}>
            <BaseButton
              needLogin
              onClick={removelpStatus.onOpen}
              width={{ base: px2vw(140), md: "170px" }}
              border="1px solid #BBDFF1"
              bgColor="black.100"
            >
              <Text type="gradient" fontSize="20px">
                {t("removeLp")}
              </Text>
            </BaseButton>
            <BaseButton
              needLogin
              onClick={addlpStatus.onOpen}
              width={{ base: px2vw(140), md: "170px" }}
              fontSize="20px"
              color="black.100"
              background="linear-gradient(180deg, #BBDFF1 0%, #C4A9F3 100%)"
            >
              {t("addLp")}
            </BaseButton>
          </Stack>
        </Flex>
        <Flex
          direction="column"
          flex="1"
          height={{ base: px2vw(298), md: "298px" }}
          padding="30px 0"
          //   justifyContent="center"
          alignItems="center"
          boxShadow="0px 4px 40px rgba(6, 16, 43, 0.65)"
          bgImage={panelBG3}
          bgSize="100% 100%"
        >
          <Text
            type="gradient"
            fontSize={{ base: px2vw(24), md: "15px" }}
            fontWeight="500"
          >
            {t("myRewards")}
          </Text>
          <Stack
            marginTop={{ base: px2vw(40), md: "40px" }}
            marginBottom={{ base: px2vw(15), md: "15px" }}
            direction="row"
            spacing={{ base: px2vw(10), md: "10px" }}
          >
            <Image src={ASTRToken} width="40px" />
          </Stack>
          <Text
            marginBottom={{ base: px2vw(40), md: "40px" }}
            fontSize="18px"
            fontWeight="600"
            fontFamily="PingFang SC"
          >
            {formatValue(pendingReward)}
          </Text>
          <BaseButton
            onClick={handleClaim}
            isLoading={claim.loading}
            isDisabled={claimDisabled}
            needLogin
            width={{ base: px2vw(240), md: "170px" }}
            fontSize="20px"
            color="black.100"
            colorScheme="gold"
          >
            {t("Claim")}
          </BaseButton>
        </Flex>
      </Stack>
      {AddLPModal}
      {RemoveLPModal}
    </Flex>
  );
}
export default Index;

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "cn", ["lp", "common"])),
  },
});
