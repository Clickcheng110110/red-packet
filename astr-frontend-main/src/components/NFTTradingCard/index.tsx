import { Text, Flex, FlexProps, Image } from "@chakra-ui/react";
import React, { useState } from "react";

import px2vw from "@/theme/utils/px2vw";
import { useTranslation } from "next-i18next";
import BaseButton, { BaseButtonProps } from "../BaseButton";
import dayjs from "dayjs";
import { swiperData } from "../NewHome";

import cardIndex from "@/assets/images/cardIndex.svg";

export interface TradingData {
  age: number;
  id: string;
  imageUrl: string;
  url: string;
  star: number;
  isDelete: string;
  price: number;
  nftStatus: number;
  sellPrice: number;
  splitPrice: string;
  sellTime: string;
  user: string;
  tokenId: string;
  coldTime: string;
  mintTime: string;
}

export interface CardProps extends FlexProps {
  data: TradingData;
  buttonProps?: {
    renderButton?: ({ data }: { data: TradingData }) => React.ReactNode;
  } & BaseButtonProps;
}

export const index: any = {
  1: "I",
  2: "II",
  3: "III",
};

function Index({ data, buttonProps, ...props }: CardProps) {
  const { age, tokenId, star, url, mintTime, price } = data;
  const [isHover, setIsHover] = useState(false);

  const { t } = useTranslation("market");

  const time = mintTime ? dayjs(mintTime).format("YYYY.MM.DD") : "--";

  return (
    <Flex
      pos="relative"
      border={{ base: "1px solid", lg: "none" }}
      borderColor={{ base: "white.20", lg: "transparent" }}
      w={{ base: px2vw(150), lg: "290px" }}
      // h={{ base: px2vw(238), lg: "438px" }}
      p={{ base: 0, lg: "1px" }}
      borderRadius={{ base: px2vw(20), lg: "16px" }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...props}
    >
      <Flex
        width={px2vw(50)}
        height={px2vw(50)}
        bgImage={cardIndex}
        borderTopLeftRadius={{ base: px2vw(20), lg: "16px" }}
        zIndex={2}
        position="absolute"
        left="0"
        top="0"
        color="black.100"
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          width={px2vw(30)}
          height={px2vw(30)}
          textAlign="center"
        >
          {index?.[`${age}`]}
        </Flex>
      </Flex>
      <Flex
        w={{ base: px2vw(150), lg: "288px" }}
        h={{ base: "100%", lg: "100%" }}
        p={{ base: 0, lg: "10px" }}
        zIndex={1}
        color="#fff"
        flexDir="column"
      >
        {/* 图片 */}
        <Flex
          justifyContent="center"
          alignItems="center"
          bgColor="white.10"
          flexShrink={0}
          bgSize="100% 100%"
          bgImage={url}
          w={{ base: "full", lg: "270px" }}
          h={{ base: px2vw(202), lg: "270px" }}
          borderRadius={{ base: px2vw(20), lg: "8px" }}
          // borderBottomRadius={{ base: 0, lg: "8px" }}
        >
          {/* <Image
            src={image}
            w={{ base: px2vw(83), lg: "150px" }}
            h={{ base: px2vw(24), lg: "44px" }}
          /> */}
        </Flex>
        {/* 名称 */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          px={{ base: px2vw(10), lg: "10px" }}
          my={{ base: px2vw(5), lg: "10px" }}
          color="white"
        >
          <Text
            fontWeight="400"
            fontSize={{ base: px2vw(12), lg: "16px" }}
            lineHeight={{ base: px2vw(12), lg: "22px" }}
          >
            {swiperData?.[`${star}`]?.name || "未知"}
          </Text>
          <Text
            fontWeight="400"
            fontSize={{ base: px2vw(12), lg: "16px" }}
            lineHeight={{ base: px2vw(12), lg: "22px" }}
          >
            #{tokenId}
          </Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          px={{ base: px2vw(10), lg: "10px" }}
          color="white.60"
        >
          <Text
            fontWeight="400"
            fontSize={{ base: px2vw(12), lg: "16px" }}
            lineHeight={{ base: px2vw(12), lg: "22px" }}
          >
            铸造时间
          </Text>
          <Text
            fontWeight="400"
            fontSize={{ base: px2vw(12), lg: "16px" }}
            lineHeight={{ base: px2vw(12), lg: "22px" }}
          >
            {time}
          </Text>
        </Flex>
        {buttonProps?.renderButton ? (
          buttonProps?.renderButton({ data: data })
        ) : (
          <BaseButton
            colorScheme="blue"
            mx="auto"
            my={px2vw(8)}
            w={{ base: `calc(100% - ${px2vw(10)})`, lg: "100%" }}
            h={{ base: px2vw(34), lg: "72px" }}
            fontSize={{ base: px2vw(12), lg: "24px" }}
            borderRadius={{ base: px2vw(8), lg: "8px" }}
            {...buttonProps}
          >
            {/* {buttonProps?.children || t("buy")} */}
            <Flex
              width="100%"
              justifyContent="space-between"
              alignItems="center"
              // color="black.100"
            >
              <Flex alignItems="flex-end">
                <Text fontSize="14px">{price}</Text>
                <Text fontSize="12px">USDT</Text>
              </Flex>

              <Text fontSize="14px">{buttonProps?.children}</Text>
            </Flex>
          </BaseButton>
        )}
      </Flex>
    </Flex>
  );
}
export default Index;
