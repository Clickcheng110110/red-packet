import { Image, Text, Flex, useToast } from "@chakra-ui/react";

import { IModalContentProps } from "@/hooks/useModal";
import { useTranslation } from "next-i18next";
import px2vw from "@/theme/utils/px2vw";
import image from "@/assets/images/image1.png";
import BaseButton from "../BaseButton";
import { TradingData } from "../NFTTradingCard";
import { useConfigContext } from "@/context/ConfigContext";
import { ethers } from "ethers";
import useTransaction from "@/hooks/useTransaction";
import { useContractsContext } from "@/context/ContractsContext";
import { swiperData, toastSuccessConfig } from "../NewHome";
import useErc20 from "@/hooks/useErc20";
import { OperationVerifyStatus } from "@/apis/v2";

export interface Data {
  activeItem: TradingData;
  refresh?: () => void;
}

function BuyModalContent({ data, onClose }: IModalContentProps<any>) {
  const { t } = useTranslation("market");
  const toast = useToast();
  const { config, handleSignFunction } = useConfigContext();
  const { nftMarketContract } = useContractsContext();

  const { isEnough, approveState, isLoading } = useErc20({
    tokenAddress: config?.usdt as string,
    approveTokenAddress: config?.nftMarket as string,
    approveAmount: data?.price,
  });

  // 购买
  const { run: runBuy, loading: loadingBuy } = useTransaction(
    nftMarketContract?.buyItem,
    { wait: true }
  );

  // buy点击事件
  const buy = async () => {
    try {
      await handleSignFunction?.(data?.tokenId, OperationVerifyStatus.BUYING);
      await runBuy(data?.tokenId, {
        value: ethers.utils.parseUnits("0.0001"),
      });

      toast({
        ...toastSuccessConfig,
        title: "购买成功",
      });
    } catch (err) {
      console.log(err, "err");
    } finally {
      await data?.refetch();
      onClose?.();
    }
  };

  return (
    <Flex flexDir="column">
      {/* 图片 */}
      <Flex
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        w="full"
        flexShrink={0}
        marginTop={px2vw(30)}
        h={{ base: px2vw(250), lg: "315px" }}
        borderRadius={{ base: px2vw(8), lg: "8px" }}
      >
        <Image
          src={data?.url || image}
          w={px2vw(215)}
          h={px2vw(290)}
          borderRadius={{ base: px2vw(8), lg: "8px" }}
        />
      </Flex>
      <Flex
        pl={{ base: px2vw(10), lg: "10px" }}
        flexDir="column"
        boxSizing="border-box"
      >
        <Flex
          mt={{ base: px2vw(18), lg: "18px" }}
          mb={{ base: px2vw(20), lg: "20px" }}
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text
            fontSize="20px"
            color="white.100"
            textStyle="text"
            fontWeight="500"
          >
            {swiperData?.[`${(data as TradingData).star}`]?.name || "未知"}
          </Text>
          {/* 名称 */}
          <Text
            fontSize="20px"
            color="white.100"
            textStyle="text"
            fontWeight="500"
          >
            #{data?.tokenId}
          </Text>
        </Flex>
        {/* button */}
        {!isLoading && !isEnough && (
          <BaseButton
            mx="auto"
            onClickCapture={() => {
              approveState.run();
            }}
            isLoading={approveState.loading}
            colorScheme="gold"
            my={px2vw(8)}
            w={{ base: `calc(100% - ${px2vw(10)})`, lg: "100%" }}
            h={{ base: px2vw(46), lg: "72px" }}
            fontSize={{ base: px2vw(12), lg: "24px" }}
            borderRadius={{ base: px2vw(23), lg: "23px" }}
            onClick={() => buy()}
          >
            <Flex
              width="100%"
              justifyContent="center"
              alignItems="center"
              color="black.100"
            >
              <Text fontSize="14px" fontWeight="600">
                授权USDT
              </Text>
            </Flex>
          </BaseButton>
        )}
        {!isLoading && (
          <BaseButton
            isDisabled={!isEnough}
            isLoading={loadingBuy}
            mx="auto"
            colorScheme="gold"
            my={px2vw(8)}
            w={{ base: `calc(100% - ${px2vw(10)})`, lg: "100%" }}
            h={{ base: px2vw(46), lg: "72px" }}
            fontSize={{ base: px2vw(12), lg: "24px" }}
            borderRadius={{ base: px2vw(23), lg: "23px" }}
            onClick={() => buy()}
          >
            <Flex
              width="100%"
              justifyContent="center"
              alignItems="center"
              color="black.100"
            >
              <Text fontSize="14px" fontWeight="600">
                确认{data?.price}USDT购买此NFT
              </Text>
            </Flex>
          </BaseButton>
        )}
      </Flex>
    </Flex>
  );
}

export default BuyModalContent;
