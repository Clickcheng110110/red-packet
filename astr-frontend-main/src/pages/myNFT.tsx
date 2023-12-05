import { Box, ButtonProps, SimpleGrid, Flex, useToast } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetStaticProps } from "next";
import px2vw from "@/theme/utils/px2vw";
import Tabs from "@/components/Tabs";
import NFTTradingCard, {
  CardProps,
  TradingData,
} from "@/components/NFTTradingCard";
import { useTranslation } from "next-i18next";
import BaseButton from "@/components/BaseButton";
import { useConfigContext } from "@/context/ConfigContext";
import useModal from "@/hooks/useModal";
import SellModalContent from "@/components/Modals/SellModalContent";
import BigNumber from "bignumber.js";
import CancelSellModalContent from "@/components/Modals/CancelSellModalContent";
import SplitNFTModalContent from "@/components/Modals/SplitNFTModalContent";
import FetchTemplate from "@/components/FetchTemplate";
import NormalTabs from "@/components/NormalTabs";
import { useQuery } from "@tanstack/react-query";
import { getMyNFTInfo } from "@/apis/v2";
import { uniqBy } from "lodash";
import RefreshButton from "@/components/RefreshButton";
import MyNFTSelect from "@/components/MyNFTSelect";
import useSelect from "@/hooks/useSelect";

type Props = {
  // Add custom props here
};

export enum CardType {
  Init,
  NotSell = 1,
  Sell = 2,

  SplitSell,
}

export const blueButtonStyle: ButtonProps = {
  colorScheme: "black",
  color: "blue.500",
  border: "1px solid",
  borderColor: "blue.500",
  boxShadow: "",
};

export const defaultBody = {
  nftStatus: 0,
  page: 1,
  pageSize: 10,
};

export const selectOptions = [
  {
    name: "全部",
    value: 4,
  },
  {
    name: "I代卡",
    value: 1,
  },
  {
    name: "II代卡",
    value: 2,
  },
  {
    name: "III代卡",
    value: 3,
  },
];

function Index() {
  const { address } = useConfigContext();
  const { t } = useTranslation(["myNFT", "market", "common"]);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [random, setRandom] = useState(0);
  const [list, setList] = useState<TradingData[]>([]);
  const [current, onSelect] = useSelect(selectOptions[0].value);
  const [page, setPage] = useState(defaultBody.page);
  const { data, isLoading } = useQuery(
    ["getMyNFTInfo", address, page, random, current],
    async ({ queryKey }) => {
      if (!queryKey[1]) return [];

      const defaultParams = {
        address: address as `0x${string}`,
        nftStatus: defaultBody.nftStatus,
        page,
        pageSize: defaultBody.pageSize,
      };
      const params =
        current === 4
          ? { ...defaultParams }
          : { ...defaultParams, age: current };

      const res = await getMyNFTInfo(params);
      return res.data.list;
    },
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: !!address,
    }
  );

  const [SellModal, sellModalStatus] = useModal(SellModalContent);
  const [CancelModal, CancelModalStatus] = useModal(CancelSellModalContent);
  const [SplitModal, SplitModalStatus] = useModal(SplitNFTModalContent);
  const [index, setIndex] = useState(0);

  const categoryData = useMemo(() => {
    if (!list)
      return {
        all: [],
        onSale: [],
        notOnSale: [],
      };
    const onSaleData = list.filter((item: TradingData) => {
      return item.nftStatus === CardType.Sell;
    });

    const notOnSaleData = list.filter((item: TradingData) => {
      return item.nftStatus === CardType.NotSell;
    });
    return {
      all: list,
      onSale: onSaleData,
      notOnSale: notOnSaleData,
    };
  }, [list]);

  const handleSell = (data: any) => {
    sellModalStatus.onOpen({
      ...data,
      refetch: handleRefresh,
    });
  };

  const getButtonProps = (data: TradingData) => {
    switch (data.nftStatus) {
      case CardType.Init:
        return {
          renderButton: <></>,
        };
      case CardType.Sell:
        return {
          ...blueButtonStyle,
          children: t("cancel"),
          onClick: () => {
            CancelModalStatus.onOpen({
              ...data,
              status: data.nftStatus,
              refetch: handleRefresh,
            });
          },
        };
      case CardType.NotSell:
        return Number(data.price) >= 1000 ? (
          data.age < 3 ? (
            {
              color: "black.100",
              bgColor: "purple.100",
              children: "拆分",
              onClick: () => {
                SplitModalStatus.onOpen({
                  ...data,
                  status: CardType.SplitSell,
                  refetch: handleRefresh,
                });
              },
            }
          ) : (
            <></>
          )
        ) : (
          {
            color: "black.100",
            children: t("sell"),
            onClick: () => {
              handleSell({
                ...data,
                setIndex,
                refetch: handleRefresh,
              });
            },
          }
        );

      default:
        return {
          renderButton: <></>,
        };
    }
  };

  const render = (data: TradingData[]) => {
    return (data || []).map((item: TradingData) => {
      const buttonProps = getButtonProps(item) as CardProps["buttonProps"];
      return (
        <NFTTradingCard key={item.id} buttonProps={buttonProps} data={item} />
      );
    });
  };

  const handleRefresh = () => {
    const timeStrap = new Date().getTime();
    setIsRefreshed(true);
    setPage(1);
    setRandom(timeStrap);
  };

  const handleTabsChange = (index: number) => {
    setIndex(index);
  };

  useEffect(() => {
    if (data) {
      setList(uniqBy([...list, ...data], "tokenId"));
    }
  }, [data]);

  useEffect(() => {
    if (isRefreshed) {
      if (!isLoading) {
        setIsRefreshed(false);
        setList([...data]);
      }
    }
  }, [isRefreshed, isLoading]);

  console.log("current", current);

  return (
    <Flex
      flexDirection="column"
      minH="70vh"
      // position="absolute"
      margin={{ base: px2vw(20), md: "39px 60px 0 60px" }}
    >
      <Box position="relative">
        <NormalTabs
          index={index}
          onChange={handleTabsChange}
          tabProps={{
            px: px2vw(15),
          }}
          data={[
            {
              label: t("All of Mine"),
              content: (
                <Flex justifyContent="center">
                  <FetchTemplate
                    loading={isLoading && list.length === 0}
                    empty={list?.length === 0}
                  >
                    <SimpleGrid
                      width="100%"
                      minChildWidth={{ base: px2vw(150), lg: "290px" }}
                      spacing={{ base: px2vw(20), md: "40px" }}
                    >
                      {render(categoryData.all)}
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </SimpleGrid>
                  </FetchTemplate>
                </Flex>
              ),
            },
            {
              label: t("On Sale"),
              content: (
                <Flex justifyContent="center">
                  <FetchTemplate
                    loading={isLoading}
                    empty={categoryData.onSale?.length === 0}
                  >
                    <SimpleGrid
                      width="100%"
                      minChildWidth={{ base: px2vw(150), lg: "290px" }}
                      spacing={{ base: px2vw(20), md: "40px" }}
                    >
                      {render(categoryData.onSale)}
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </SimpleGrid>
                  </FetchTemplate>
                </Flex>
              ),
            },
            {
              label: t("Not On Sale"),
              content: (
                <Flex justifyContent="center">
                  <FetchTemplate
                    loading={isLoading}
                    empty={categoryData.notOnSale?.length === 0}
                  >
                    <SimpleGrid
                      width="100%"
                      minChildWidth={{ base: px2vw(150), lg: "290px" }}
                      spacing={{ base: px2vw(20), md: "40px" }}
                    >
                      {render(categoryData.notOnSale)}
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </SimpleGrid>
                  </FetchTemplate>
                </Flex>
              ),
            },
          ]}
        />

        <MyNFTSelect
          pannelStyle={{
            width: px2vw(129),
            border: "1px solid",
            borderColor: "purple.100",
            bgColor: "black.100",
            color: "purple.100",
          }}
          position="absolute"
          right={px2vw(-5)}
          top={px2vw(-5)}
          width={px2vw(40)}
          height={px2vw(50)}
          // overflow="hidden"
          backgroundColor="black.100"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          defaultValue={current}
          options={selectOptions}
          onSelectChange={(item) => {
            handleRefresh();
            onSelect(item.value);
          }}
        />
      </Box>
      {list?.length && data?.length === defaultBody.pageSize ? (
        <BaseButton
          margin="0 auto"
          w={{ base: px2vw(275), lg: "275px" }}
          h={{ base: px2vw(46), lg: "46px" }}
          fontSize={{ base: px2vw(18), lg: "18px" }}
          lineHeight={{ base: px2vw(46), lg: "46px" }}
          borderRadius={{ base: px2vw(12), lg: "12px" }}
          onClick={() => {
            setPage(page + 1);
          }}
        >
          加载更多
        </BaseButton>
      ) : null}
      {/* 刷新按钮 */}
      <RefreshButton isRefreshed={isRefreshed} onClick={handleRefresh} />
      {/* <BaseButton
        mx="auto"
        w={{ base: px2vw(275), lg: "275px" }}
        h={{ base: px2vw(46), lg: "46px" }}
        fontSize={{ base: px2vw(18), lg: "18px" }}
        lineHeight={{ base: px2vw(46), lg: "46px" }}
        borderRadius={{ base: px2vw(12), lg: "12px" }}
        onClick={() => {
          // page[activeOption.id] = page[activeOption.id] + 8;
          // setPage(page + 1);
        }}
      >
        显示更多
      </BaseButton> */}

      {SellModal}
      {CancelModal}
      {SplitModal}
    </Flex>
  );
}
export default Index;

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "cn", [
      "myNFT",
      "market",
      "common",
    ])),
  },
});
