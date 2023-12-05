import px2vw from "@/theme/utils/px2vw";
import {
  Flex,
  Input,
  Image,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useModal from "@/hooks/useModal";
import BuyModalContent from "@/components/Modals/BuyModalContent";

import NFTTradingCard, { TradingData } from "../NFTTradingCard";
import BaseButton from "../BaseButton";
import { useTranslation } from "react-i18next";
import { uniqBy } from "lodash";
import { getMarketNFT } from "@/apis/v2";
import { useQuery } from "@tanstack/react-query";
import RefreshButton from "../RefreshButton";
import magnifier from "@/assets/images/magnifier.svg";
export const defaultPageSize = 10;
export const currentAge = 1;

interface IProps {
  age: number;
  requestBody: { page: number; pageSize: number; tokenId: string };
  setBody: Dispatch<SetStateAction<any>>;
}

function Index({ age, requestBody, setBody }: IProps) {
  const { t } = useTranslation("common");
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [list, setList] = useState<TradingData[]>([]);
  const [tokenId, setTokenId] = useState("");
  const [finalTokenId, setFinalTokenId] = useState<number>();
  const [random, setRandom] = useState(0);
  const { data, isLoading, refetch } = useQuery(
    ["oneDataStatus", age, requestBody.page, finalTokenId, random],
    async ({ queryKey }) => {
      return getMarketNFT(
        queryKey[1] as number,
        queryKey[2] as number,
        requestBody.pageSize,
        queryKey[3] as string
      );
    },
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const [BuyModal, BuyModalStatus] = useModal(BuyModalContent, {
    modalBodyProps: {
      p: { base: px2vw(10), lg: "10px" },
    },
    hasTopRightCloseButton: false,
    hasBottomRightCloseButton: true,
    hasGradientBorder: false,
    // data: {
    //   activeItem: activeItem,
    // },
  });

  const handleRefresh = () => {
    const timeStrap = new Date().getTime();
    setIsRefreshed(true);
    setTokenId("");
    setFinalTokenId(undefined);
    setRandom(timeStrap);
    setBody((prev: any) => {
      const prevRequest = prev[`${age}`];
      prevRequest.page = 1;

      return {
        ...prev,
        [age]: prevRequest,
      };
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTokenId(e.target.value);
  };
  const handleSearch = () => {
    const timeStrap = new Date().getTime();
    setList([]);
    setRandom(timeStrap);
    setBody((prev: any) => {
      const prevRequest = prev[`${age}`];
      prevRequest.page = 1;
      return {
        ...prev,
        prevRequest,
      };
    });
    setFinalTokenId(Number(tokenId));
  };

  useEffect(() => {
    if (data) {
      setList(uniqBy([...list, ...data?.data?.list], "tokenId"));
    }
  }, [data]);

  useEffect(() => {
    if (isRefreshed) {
      if (!isLoading) {
        setIsRefreshed(false);
        setList([...data?.data?.list]);
      }
    }
  }, [isRefreshed, isLoading]);

  return (
    <Flex flexDir="column">
      <InputGroup margin={`20px 0`}>
        <Input
          value={tokenId}
          padding={px2vw(15)}
          onChange={handleChange}
          placeholder="搜索tokenId"
          borderRadius="23px"
          borderColor="#BBDFF1"
        />
        <InputRightElement marginRight="5px">
          <Image
            onClick={handleSearch}
            src={magnifier}
            width={px2vw(40)}
            height={px2vw(40)}
          />
        </InputRightElement>
      </InputGroup>

      <Flex flexWrap="wrap" id="scroll">
        {list?.length ? (
          list?.map((item: TradingData, index: number) => {
            return (
              <NFTTradingCard
                mr={{
                  base: `${(index + 1) % 2 === 0 ? 0 : px2vw(25)}`,
                  lg: `${(index + 1) % 4 === 0 ? 0 : "50px"}`,
                }}
                mb={{ base: px2vw(30), lg: "40px" }}
                buttonProps={{
                  children: "购买",
                  color: "black.100",
                  onClick: () => {
                    // setActiveItem(item);
                    BuyModalStatus?.onOpen({
                      ...item,
                      price: item.sellPrice,
                      refetch: handleRefresh,
                    });
                  },
                }}
                data={{ ...item, price: item.sellPrice }}
                key={index}
              />
            );
          })
        ) : (
          <Text textStyle="24" mx="auto">
            No Data
          </Text>
        )}
      </Flex>
      {list?.length && data?.data?.list.length === requestBody.pageSize ? (
        <BaseButton
          mx="auto"
          w={{ base: px2vw(275), lg: "275px" }}
          h={{ base: px2vw(46), lg: "46px" }}
          fontSize={{ base: px2vw(18), lg: "18px" }}
          lineHeight={{ base: px2vw(46), lg: "46px" }}
          borderRadius={{ base: px2vw(12), lg: "12px" }}
          onClick={() => {
            setBody((prev: any) => {
              const prevRequest = prev[`${age}`];
              prevRequest.page = prevRequest.page + 1;
              return {
                ...prev,
                [age]: prevRequest,
              };
            });
            // page[activeOption.id] = page[activeOption.id] + 8;
            // setPage(page + 1);
          }}
        >
          {t("more")}
        </BaseButton>
      ) : null}
      {BuyModal}
      {/* 刷新按钮 */}
      <RefreshButton isRefreshed={isRefreshed} onClick={handleRefresh} />
    </Flex>
  );
}
export default Index;
