import { Flex, Image, SimpleGrid, Spinner, useToast } from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import px2vw from "@/theme/utils/px2vw";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Text from "@/components/Text";
import BaseButton from "@/components/BaseButton";

import close from "@/assets/images/close.svg";
import FetchTemplate from "@/components/FetchTemplate";
import { useConfigContext } from "@/context/ConfigContext";
import { defaultBody } from "./myNFT";
import { useEffect, useState } from "react";
import { MergeStatus, getMyNFTInfo, nftMergeResult } from "@/apis/v2";
import { useQuery } from "@tanstack/react-query";
import { TradingData } from "@/components/NFTTradingCard";
import { uniqBy } from "lodash";
import SynthesisCard from "@/components/SynthesisCard";
import {
  toastErrorConfig,
  toastSuccessConfig,
  toastWarningConfig,
} from "@/components/NewHome";
import { useContractsContext } from "@/context/ContractsContext";
import useTransaction from "@/hooks/useTransaction";
import { sleep, toWei } from "@/utils/common";
import { TRANSFER_AMOUNT } from "@/components/Modals/InviteModalContent";
import { useRouter } from "next/router";
import useModal from "@/hooks/useModal";
import MergeSuccessModalContent from "@/components/Modals/MergeSuccuessModalContent";
import MergeFailedModalContent from "@/components/Modals/MergeFailedModalContent";
import RefreshButton from "@/components/RefreshButton";

type Props = {
  // Add custom props here
};

function Index() {
  const { address, config } = useConfigContext();
  const router = useRouter();
  const toast = useToast();
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [showResultLoading, setShowResultLoading] = useState(false);
  const [random, setRandom] = useState(0);
  const { nftContract, nftMergeContract } = useContractsContext();
  const [list, setList] = useState<TradingData[]>([]);
  const [page, setPage] = useState(defaultBody.page);
  const [selectList, setSelectList] = useState<TradingData[]>([]);

  const batchApproveStatus = useTransaction(nftContract?.batchApprove, {
    wait: true,
  });

  const addMergeStatus = useTransaction(nftMergeContract?.addMerge, {
    wait: true,
  });

  const isDisabled = selectList.length !== 5;
  const tokenIds = selectList.map((item) => item.tokenId);
  const { data, isLoading, refetch } = useQuery(
    ["getMyThirdNFTInfo", address, page, random],
    async ({ queryKey }) => {
      if (!queryKey[1]) return [];
      const res = await getMyNFTInfo({
        address: address as `0x${string}`,
        nftStatus: 1,
        age: 3,
        page,
        pageSize: defaultBody.pageSize,
      });
      return res.data.list;
    },
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: !!address,
    }
  );

  const isBatchApproveStatus = useQuery(
    ["isBatchApproveStatus", address, selectList],
    async () => {
      const res = await getIsBatchApprove();
      return res;
    },
    {
      cacheTime: 0,
      enabled: !!address && !isDisabled,
      refetchOnWindowFocus: false,
    }
  );

  const getResultStatus = useQuery(
    ["getResultStatus", addMergeStatus?.result?.hash],
    async () => {
      const res = await handleGetResult();
      return res;
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!addMergeStatus?.result?.hash,
    }
  );

  const [MergeSuccessModal, mergeSuccessModalStatus] = useModal(
    MergeSuccessModalContent,
    {
      hasTopRightCloseButton: false,
    }
  );
  const [MergeFailedModal, mergeFailedModalStatus] = useModal(
    MergeFailedModalContent,
    {
      hasTopRightCloseButton: false,
    }
  );

  const handleSelect = (data: TradingData) => {
    const isSameStar = selectList.find((item) => item.star !== data.star);
    if (isSameStar) {
      toast({
        title: "只能选择相同星座的卡片",
        ...toastWarningConfig,
      });
      return;
    }

    const findIndex = selectList.findIndex(
      (item) => item.tokenId === data.tokenId
    );
    if (findIndex > -1) {
      selectList.splice(findIndex, 1);
    } else {
      if (selectList.length >= 5) {
        toast({
          title: "最多只能选择5张卡片",
          ...toastWarningConfig,
        });
        return;
      }
      selectList.push(data);
    }
    setSelectList([...selectList]);
  };

  const handleRefresh = () => {
    const timeStrap = new Date().getTime();
    setIsRefreshed(true);
    setPage(1);
    setRandom(timeStrap);
  };

  const handleGetResult = async () => {
    let result = null;

    try {
      while (true) {
        await sleep(2500);
        const res = await nftMergeResult(addMergeStatus?.result?.hash);
        console.log("res", res);
        if (
          res?.data &&
          res?.data?.mergeStatus !== MergeStatus.Continue &&
          res?.data?.mergeStatus !== MergeStatus.Pending
        ) {
          result = res?.data;

          break;
        }
      }
      return result;
    } catch (error) {
      console.log("error", error);
      toast({
        title: "获取结果失败",
        ...toastErrorConfig,
      });
    } finally {
      handleRefresh();
      setShowResultLoading(false);
    }
  };
  const handleRoute = () => {
    router.push("/synthesis");
  };

  const getIsBatchApprove = async () => {
    try {
      const res = await nftContract?.isBatchApprove(
        config?.nftMerge as `0x${string}`,
        tokenIds
      );
      return res;
    } catch (error) {
      console.log("error", error);
    }
  };

  const render = () => {
    return (list || []).map((item) => {
      const isSelect =
        selectList.findIndex(
          (selectItem) => selectItem.tokenId === item.tokenId
        ) > -1;

      return (
        <SynthesisCard
          onClick={() => {
            handleSelect(item);
          }}
          isSelect={isSelect}
          key={item.tokenId}
          data={item}
        />
      );
    });
  };

  const handleSync = async () => {
    try {
      const payValue = toWei(TRANSFER_AMOUNT)?.toString();
      await addMergeStatus.run(tokenIds, {
        value: payValue,
      });
      setShowResultLoading(true);
      setSelectList([]);
    } catch (error) {}
  };

  useEffect(() => {
    if (isRefreshed) {
      if (!isLoading) {
        setIsRefreshed(false);
        setList([...(data?.data?.list || [])]);
      }
    }
  }, [isRefreshed, isLoading]);

  useEffect(() => {
    if (data) {
      setList(uniqBy([...list, ...data], "tokenId"));
    }
  }, [data]);

  useEffect(() => {
    if (getResultStatus?.data) {
      if (getResultStatus?.data?.mergeStatus === MergeStatus.Success) {
        mergeSuccessModalStatus.onOpen(getResultStatus?.data);
        return;
      }
      if (getResultStatus?.data?.mergeStatus === MergeStatus.Failed) {
        mergeFailedModalStatus.onOpen(getResultStatus?.data);
        return;
      }

      if (getResultStatus?.data?.mergeStatus === MergeStatus.InValid) {
        toast({
          title: "合并失败,请稍后重试",
          ...toastWarningConfig,
        });
        return;
      }
    } else {
    }
  }, [getResultStatus?.data]);

  return (
    <>
      {showResultLoading && (
        <Flex
          zIndex={99999}
          position="fixed"
          height="100vh"
          width="100vw"
          bgColor="black.40"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner width="60px" height="60px" />
        </Flex>
      )}

      <Flex
        position="relative"
        flexDirection="column"
        bgColor="#313F46"
        padding={px2vw(20)}
        alignItems="center"
      >
        <Image
          onClick={handleRoute}
          position="absolute"
          top={px2vw(26)}
          right={px2vw(30)}
          src={close}
          ignoreFallback
        />

        <Text fontSize="24px" marginTop={px2vw(8)} type="gradient">
          合并NFT碎片
        </Text>
        <Text marginTop={px2vw(18)} marginBottom={px2vw(40)} fontSize="12px">
          5张3代卡合并1张一代卡，合卡成功获得卡片价值0-10倍等值LSC作为奖励。合卡失败随机销毁一张3代卡，随机补偿价值50%
          - 100%的LS稳定币。
        </Text>

        <Flex
          minHeight="80vh"
          alignItems="center"
          width="100%"
          justifyContent="center"
        >
          <FetchTemplate loading={false} empty={list.length === 0}>
            <SimpleGrid
              width="100%"
              minChildWidth={{ base: px2vw(150), lg: "290px" }}
              spacing={{ base: px2vw(22), md: "40px" }}
            >
              {render()}
            </SimpleGrid>
          </FetchTemplate>
        </Flex>
        {list?.length && data?.length === defaultBody.pageSize ? (
          <BaseButton
            margin="15px auto"
            w={{ base: px2vw(275), lg: "275px" }}
            h={{ base: px2vw(46), lg: "46px" }}
            fontSize={{ base: px2vw(18), lg: "18px" }}
            lineHeight={{ base: px2vw(46), lg: "46px" }}
            borderRadius={{ base: px2vw(12), lg: "12px" }}
            onClick={() => {
              setPage(page + 1);
            }}
            bgColor="#313F46"
          >
            加载更多
          </BaseButton>
        ) : null}

        {!isDisabled && !isBatchApproveStatus.data && (
          <BaseButton
            isLoading={
              isBatchApproveStatus.isLoading || batchApproveStatus.loading
            }
            margin="15px auto"
            w={{ base: px2vw(275), lg: "275px" }}
            h={{ base: px2vw(46), lg: "46px" }}
            fontSize={{ base: px2vw(18), lg: "18px" }}
            lineHeight={{ base: px2vw(46), lg: "46px" }}
            borderRadius={{ base: px2vw(23), lg: "12px" }}
            onClick={async () => {
              await batchApproveStatus.run(config?.nftMerge, tokenIds);
              await isBatchApproveStatus.refetch();
              toast({
                title: "授权成功",
                ...toastSuccessConfig,
              });
            }}
            colorScheme="gold"
            color="black.100"
          >
            授权合并
          </BaseButton>
        )}
        <BaseButton
          isDisabled={isDisabled || !isBatchApproveStatus.data}
          isLoading={addMergeStatus.loading}
          margin="15px auto"
          w={{ base: px2vw(275), lg: "275px" }}
          h={{ base: px2vw(46), lg: "46px" }}
          fontSize={{ base: px2vw(18), lg: "18px" }}
          lineHeight={{ base: px2vw(46), lg: "46px" }}
          borderRadius={{ base: px2vw(23), lg: "12px" }}
          onClick={handleSync}
          colorScheme="gold"
          color="black.100"
        >
          合并
        </BaseButton>
        {/* {addMergeStatus.result && !getResultStatus.data && (
          <BaseButton
            isDisabled={true}
            margin="15px auto"
            w={{ base: px2vw(275), lg: "275px" }}
            h={{ base: px2vw(46), lg: "46px" }}
            fontSize={{ base: px2vw(18), lg: "18px" }}
            lineHeight={{ base: px2vw(46), lg: "46px" }}
            borderRadius={{ base: px2vw(23), lg: "12px" }}
            colorScheme="gold"
            color="black.100"
          >
            等待结果中
          </BaseButton>
        )} */}

        <RefreshButton isRefreshed={isRefreshed} onClick={handleRefresh} />
      </Flex>
      {MergeSuccessModal}
      {MergeFailedModal}
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "cn", [
      "myNFT",
      "market",
      "common",
    ])),
  },
});

export default Index;
