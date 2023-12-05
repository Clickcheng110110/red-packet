import React, { useEffect, useState } from "react";
import {
  Flex,
  Stack,
  InputRightElement,
  InputGroup,
  useToast,
} from "@chakra-ui/react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import BaseButton from "@/components/BaseButton";
import { IModalContentProps } from "@/hooks/useModal";
import { formatValue, fromWei, getTimeDiff, toWei } from "@/utils/common";
import Text from "@/components/Text";
import BaseInput from "@/components/BaseInput";

import { useContractsContext } from "@/context/ContractsContext";
import useTransaction from "@/hooks/useTransaction";
import { CardType } from "@/pages/myNFT";
import { useConfig, useConfigContext } from "@/context/ConfigContext";
import useErc721 from "@/hooks/useErc721";
import useErc20 from "@/hooks/useErc20";
import { TRANSFER_AMOUNT } from "./InviteModalContent";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { toastSuccessConfig } from "../NewHome";
import Fee, { OperateEnum, ValuesEnum } from "../Fee";
import { OperationVerifyStatus } from "@/apis/v2";

BigNumber.config({ EXPONENTIAL_AT: 99 });

const getCanOperation = () => {
  const currentTime = dayjs(); // 获取当前时间
  const startOfDay = currentTime.startOf("day"); // 当天的零点
  const nineAM = startOfDay.add(9, "hour"); // 每天的早上9点
  const midnight = startOfDay.add(24, "hour"); // 每天的零点
  const isCanOperation =
    currentTime.isAfter(nineAM) && currentTime.isBefore(midnight);
  return isCanOperation;
};

export const successToastConfig = {
  position: "top",
  title: "挂单成功",
  status: "success",
  duration: 9000,
  isClosable: true,
};

const SellModalContent = ({ data, onClose }: IModalContentProps<any>) => {
  const { nftMarketContract } = useContractsContext();
  const { config, handleSignFunction } = useConfigContext();

  const { t } = useTranslation(["myNFT"]);
  const toast = useToast();
  const sellStatus = useTransaction(nftMarketContract?.listItem, {
    wait: true,
  });
  const [feeAndPriceData, setFeeAndPriceData] = useState<any>();

  const { price, fee } = feeAndPriceData ?? {};

  const nftStatus = useErc721({
    tokenAddress: config?.nft as string,
    approveTokenAddress: config?.nftMarket as string,
    tokenId: data?.tokenId,
  });

  const tokenStatus = useErc20({
    tokenAddress: config?.astr as string,
    approveTokenAddress: config?.nftMarket as string,
    approveAmount: price?.toString(),
  });

  const lsStatus = useErc20({
    tokenAddress: config?.ls as string,
    approveTokenAddress: config?.nftMarket as string,
    approveAmount: toWei(feeAndPriceData?.lsAmount || 0)?.toString(),
  });

  const isLoading =
    nftStatus?.isLoading || tokenStatus?.isLoading || lsStatus?.isLoading;

  // const isOperationTime = getCanOperation();
  const isCanCell = nftStatus.isApproved && tokenStatus?.isEnough;

  const isFeeNotEnough = tokenStatus.balance
    ? new BigNumber(tokenStatus.balance).lt(
        fromWei(fee?.toString())?.toString()
      )
    : false;

  const isLSNotEnough = tokenStatus.balance
    ? new BigNumber(tokenStatus.balance).lt(
        feeAndPriceData?.lsAmount?.toString()
      )
    : false;

  const isSellDisabled =
    !isCanCell ||
    isFeeNotEnough ||
    isLSNotEnough ||
    (feeAndPriceData?.type === ValuesEnum.LSLSC && !feeAndPriceData?.lsAmount);

  const getFeeData = (data: any) => {
    setFeeAndPriceData(data);
  };

  const handleSell = async () => {
    try {
      const tokenId = data?.tokenId;
      const payValue = toWei(TRANSFER_AMOUNT)?.toString();
      const lsAmount =
        feeAndPriceData?.type === ValuesEnum.LSC
          ? 0
          : toWei(feeAndPriceData.lsAmount)?.toString();

      await handleSignFunction?.(data?.tokenId, OperationVerifyStatus.LISTING);

      await sellStatus.run(tokenId, lsAmount, {
        value: payValue,
      });

      toast({
        ...toastSuccessConfig,
        title: "挂单成功",
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      await data?.refetch();
      onClose?.();
    }
  };

  return (
    <Stack
      spacing={{ base: "20px" }}
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text type="gradient" fontSize="20px" fontWeight="700">
        挂单
      </Text>
      <Stack width="100%">
        <Flex width="100%" justifyContent="space-between" alignItems="center">
          <Text type="gradient" fontSize="18px" fontWeight="400">
            售卖单价
          </Text>
          <Text fontSize="18px" color="white.100">
            {formatValue(price?.toString(), true, 2)} USDT
          </Text>
        </Flex>
      </Stack>

      <Fee data={data} type={OperateEnum.Sell} onGetData={getFeeData} />

      <Stack
        spacing="20px"
        direction="column"
        width="100%"
        justifyContent="center"
      >
        <>
          {!isLoading && !tokenStatus?.isEnough && (
            <BaseButton
              colorScheme="gold"
              color="black.100"
              fontSize="18px"
              isDisabled={tokenStatus?.isEnough}
              onClick={() => {
                tokenStatus?.approveState?.run?.();
              }}
              isLoading={tokenStatus?.approveState?.loading}
            >
              {t("Approve LSC")}
            </BaseButton>
          )}

          {!isLoading &&
            feeAndPriceData?.lsAmount > 0 &&
            !lsStatus?.isEnough && (
              <BaseButton
                colorScheme="gold"
                color="black.100"
                fontSize="18px"
                isDisabled={lsStatus?.isEnough}
                onClick={() => {
                  lsStatus?.approveState?.run?.();
                }}
                isLoading={lsStatus?.approveState?.loading}
              >
                授权LS
              </BaseButton>
            )}

          {!isLoading && !nftStatus?.isApproved && (
            <BaseButton
              colorScheme="gold"
              color="black.100"
              fontSize="18px"
              isDisabled={nftStatus?.isApproved}
              onClick={() => {
                nftStatus?.approveState?.run?.();
              }}
              isLoading={nftStatus?.approveState?.loading}
            >
              {t("Approve NFT")}
            </BaseButton>
          )}
          {!isLoading && (
            <BaseButton
              colorScheme="gold"
              fontSize="18px"
              isDisabled={isSellDisabled}
              isLoading={sellStatus?.loading}
              onClick={handleSell}
              color="black.100"
            >
              {t("Confirm to Sell")}
            </BaseButton>
          )}
        </>
      </Stack>
    </Stack>
  );
};

export default SellModalContent;
