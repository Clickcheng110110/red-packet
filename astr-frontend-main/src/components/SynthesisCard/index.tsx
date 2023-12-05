import { Text, Flex, FlexProps, Image } from "@chakra-ui/react";
import React, { useState } from "react";

import px2vw from "@/theme/utils/px2vw";
import { useTranslation } from "next-i18next";
import BaseButton, { BaseButtonProps } from "../BaseButton";
import dayjs from "dayjs";
import { swiperData } from "../NewHome";

import cardIndex from "@/assets/images/cardIndex.svg";
import switchUnactive from "@/assets/images/switch.svg";
import switchActive from "@/assets/images/switchActive.svg";
import { formatValue } from "@/utils/common";

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
  isSelect?: boolean;
  buttonProps?: {
    renderButton?: ({ data }: { data: TradingData }) => React.ReactNode;
  } & BaseButtonProps;
}

export const index: any = {
  1: "I",
  2: "II",
  3: "III",
};

function Index({ data, isSelect = false, buttonProps, ...props }: CardProps) {
  const { age, tokenId, star, url, mintTime, price } = data;
  const [isHover, setIsHover] = useState(false);

  const { t } = useTranslation("market");

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
          position="relative"
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
          <Image
            src={isSelect ? switchActive : switchUnactive}
            width="26px"
            position="absolute"
            right="10px"
            bottom="10px"
          />
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
          my={{ base: px2vw(5), lg: "10px" }}
          color="white"
        >
          <Text
            color="white.60"
            fontWeight="400"
            fontSize={{ base: px2vw(12), lg: "16px" }}
            lineHeight={{ base: px2vw(12), lg: "22px" }}
          >
            价格
          </Text>
          <Text
            fontWeight="400"
            fontSize={{ base: px2vw(12), lg: "16px" }}
            lineHeight={{ base: px2vw(12), lg: "22px" }}
          >
            ₮{formatValue(price?.toString())}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
export default Index;
