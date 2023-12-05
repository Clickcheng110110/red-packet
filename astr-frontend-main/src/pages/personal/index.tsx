import React, { useEffect } from "react";
import { Flex, Stack, Image, useToast } from "@chakra-ui/react";
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
import {
  cutZero,
  formatAddress,
  formatValue,
  fromWei,
  toWei,
} from "@/utils/common";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useTransaction from "@/hooks/useTransaction";
import uniswapV2PairABI from "@/contracts/abis/uniswapV2PairABI.json";

import ASTRToken from "@/assets/images/ASTRToken.png";
import USDTToken from "@/assets/images/USDTToken.png";
import panelBG1 from "@/assets/images/panelBG1.png";
import panelBG2 from "@/assets/images/panelBG2.png";
import panelBG3 from "@/assets/images/panelBG3.png";
import panelBG4 from "@/assets/images/panelBG4.png";
import Button from "@/theme/components/button";
import { blueButtonStyle } from "@/pages/myNFT";
import { useRouter } from "next/router";
import useErc20 from "@/hooks/useErc20";
import { toastSuccessConfig } from "@/components/NewHome";
import { TRANSFER_AMOUNT } from "@/components/Modals/InviteModalContent";
import { getUserInfo, userMessage } from "@/apis/v2";
import { useUserInfosContext } from "@/context/userInfoContext";

type Props = {
  // Add custom props here
};

export const SignUserButton = () => {
  const { data, isLoading, handleSignUserInfo } = useUserInfosContext();
  return (
    <Stack
      spacing={px2vw(20)}
      marginTop={px2vw(100)}
      marginBottom={px2vw(100)}
      justifyContent="center"
      alignItems="center"
    >
      <Text>为了保证您的数据安全，请先进行签名</Text>
      <BaseButton
        isLoading={isLoading}
        width={px2vw(246)}
        fontSize="18px"
        onClick={() => {
          handleSignUserInfo?.();
        }}
        colorScheme="gold"
        color="black.100"
      >
        签名
      </BaseButton>
    </Stack>
  );
};

function Index() {
  const router = useRouter();
  const toast = useToast();

  const { config, address } = useConfigContext();
  const { awardCenterContract } = useContractsContext();
  const { data, isLoading, handleSignUserInfo } = useUserInfosContext();
  const { t } = useTranslation(["lp"]);

  const getBalanceStatus = useQuery(
    ["getBalance", address, awardCenterContract?.address],
    async () => {
      const res = await getRewardBalance();
      return res?.toString();
    },
    {
      enabled: !!address && !!awardCenterContract?.address,
    }
  );

  const lscStatus = useErc20({
    tokenAddress: config?.astr as string,
    approveTokenAddress: config?.nftMarket as string,
  });

  const lsStatus = useErc20({
    tokenAddress: config?.ls as string,
    approveTokenAddress: config?.nftMarket as string,
  });

  const claimStatus = useTransaction(awardCenterContract?.withdraw, {
    wait: true,
  });

  const getRewardBalance = async () => {
    try {
      if (!address) return;
      const res = await awardCenterContract?.getBalance(address);
      return res;
    } catch (error) {}
  };

  const handleClaim = async () => {
    try {
      const payValue = toWei(TRANSFER_AMOUNT)?.toString();
      await claimStatus.run({
        value: payValue,
      });
      await getBalanceStatus.refetch();
      toast({
        ...toastSuccessConfig,
        title: "领取成功",
      });
      //   queryPoolState.refetch();
    } catch (error) {}
  };

  useEffect(() => {
    if (!address) return;

    handleSignUserInfo?.();
  }, [address]);

  if (!data)
    return (
      <Stack
        spacing={px2vw(20)}
        marginTop={px2vw(100)}
        marginBottom={px2vw(100)}
        justifyContent="center"
        alignItems="center"
      >
        <Text>为了保证您的数据安全，请先进行签名</Text>
        <BaseButton
          isLoading={isLoading}
          width={px2vw(246)}
          fontSize="18px"
          onClick={() => {
            handleSignUserInfo?.();
          }}
          colorScheme="gold"
          color="black.100"
        >
          签名
        </BaseButton>
      </Stack>
    );

  return (
    <Flex
      flexDirection="column"
      marginTop={{ base: px2vw(42), md: "80px" }}
      padding={{ base: `0 ${px2vw(20)} ${px2vw(20)}`, md: `0 0 60px` }}
      justifyContent="center"
      alignItems="center"
    >
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
        <LPInfoItem
          width={{ base: "100%", md: "inherit" }}
          justifyContent={{ base: "space-between", md: "center" }}
          label="我的身份"
          value={data?.idTypeName || "--"}
        />
        <LPInfoItem
          width={{ base: "100%", md: "inherit" }}
          justifyContent={{ base: "space-between", md: "center" }}
          label="推荐人"
          value={data?.root ? formatAddress(data?.root) : "--"}
        />
        <BaseButton
          needLogin
          width={{ base: px2vw(240), md: "170px" }}
          background="linear-gradient(180deg, #BBDFF1 0%, #C4A9F3 100%)"
          fontSize="20px"
          color="black.100"
        >
          邀请我的朋友
        </BaseButton>
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
        bgImage={panelBG4}
        bgSize="100% 100%"
        bgRepeat="no-repeat"

        // border="1px solid "
      >
        <LPInfoItem
          width={{ base: "100%", md: "inherit" }}
          justifyContent={{ base: "space-between", md: "center" }}
          label="LSC数量"
          value={formatValue(lscStatus?.balance)}
        />
        <LPInfoItem
          width={{ base: "100%", md: "inherit" }}
          justifyContent={{ base: "space-between", md: "center" }}
          label="LS数量"
          value={formatValue(lsStatus?.balance)}
        />
      </Stack>

      <Flex
        width="100%"
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
          {formatValue(getBalanceStatus?.data, true)} LSC
        </Text>
        <BaseButton
          onClick={handleClaim}
          isLoading={claimStatus.loading}
          needLogin
          width={{ base: px2vw(240), md: "170px" }}
          fontSize="20px"
          color="black.100"
          colorScheme="gold"
        >
          领取收益
        </BaseButton>
      </Flex>
      <Flex
        marginTop={px2vw(30)}
        width="100%"
        gap={px2vw(30)}
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
      >
        <BaseButton {...blueButtonStyle} width={px2vw(151)} height={px2vw(46)}>
          <Text fontSize="18px" type="gradient">
            NFT交易记录
          </Text>
        </BaseButton>
        <BaseButton
          onClick={() => {
            router.push("/personal/reward");
          }}
          {...blueButtonStyle}
          width={px2vw(151)}
          height={px2vw(46)}
        >
          <Text fontSize="18px" type="gradient">
            奖励发放记录
          </Text>
        </BaseButton>
        <BaseButton
          onClick={() => {
            router.push("/personal/operation");
          }}
          {...blueButtonStyle}
          width={px2vw(151)}
          height={px2vw(46)}
        >
          <Text fontSize="18px" type="gradient">
            运营中心
          </Text>
        </BaseButton>

        <BaseButton {...blueButtonStyle} width={px2vw(151)} height={px2vw(46)}>
          <Text fontSize="18px" type="gradient">
            节点活动中心
          </Text>
        </BaseButton>
        {/* <BaseButton colorScheme="black.100">奖励发放记录</BaseButton>
        <BaseButton width={px2vw(151)}>运营中心</BaseButton>
        <BaseButton height={px2vw(46)}>节点活动中心</BaseButton> */}
      </Flex>
    </Flex>
  );
}
export default Index;

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "cn", ["lp", "common"])),
  },
});
