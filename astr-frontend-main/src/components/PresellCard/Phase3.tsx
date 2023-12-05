import { Text, Flex, FlexProps, Image, Box } from "@chakra-ui/react";
import React from "react";
import px2vw from "@/theme/utils/px2vw";
import nftSell from "@/assets/images/nftSell.png";
import { useTranslation } from "next-i18next";
import BaseButton from "../BaseButton";

export interface IProps extends FlexProps {
  comingSoon?: boolean;
}

function Index({ comingSoon = false }: IProps) {
  const { t, i18n } = useTranslation("common");
  return (
    <Flex
      w={{ base: "full", lg: "335px" }}
      h={{ base: px2vw(598), lg: "598px" }}
      py={{ base: px2vw(30), lg: "30px" }}
      borderRadius={{ base: px2vw(40), lg: "40px" }}
      opacity={0.9}
      flexDir="column"
      alignItems="center"
      bgColor="black.500"
      boxShadow="0px 4px 40px rgba(6, 16, 43, 0.65)"
      boxSizing="border-box"
      pos="relative"
    >
      {/* title */}
      <Flex
        h={{ base: px2vw(51), lg: "51px" }}
        mb={{ base: px2vw(20), lg: "20px" }}
        flexDir="column"
        alignItems="center"
        fontWeight="400"
        color="white.100"
      >
        <Text
          fontSize={{ base: px2vw(14), lg: "14px" }}
          lineHeight={{ base: px2vw(19), lg: "19px" }}
          opacity={0.6}
        >
          {t("step3")}
        </Text>
        <Text
          fontSize={{ base: px2vw(24), lg: "24px" }}
          lineHeight={{ base: px2vw(28), lg: "28px" }}
          fontWeight="300"
        >
          {t("step3Text")}
        </Text>
      </Flex>
      {/* icon */}
      <Image
        src={nftSell}
        w={{ base: px2vw(143), lg: "143px" }}
        h={{ base: px2vw(155), lg: "155px" }}
      />
      <Box
        pos="absolute"
        bgColor="black.60"
        textAlign="center"
        backdropFilter="blur(2px)"
        m="auto"
        left="0"
        right="0"
        w="max-content"
        h={{ base: px2vw(30), lg: "30px" }}
        top={
          i18n.language === "en"
            ? { base: px2vw(203), lg: "203px" }
            : { base: px2vw(226), lg: "226px" }
        }
        px={{ base: px2vw(26), lg: "26px" }}
        borderRadius={{ base: px2vw(20), lg: "20px" }}
        display={comingSoon ? "none" : "block"}
      >
        <Text
          fontFamily="PingFang SC"
          fontWeight="500"
          bgClip="text"
          bgGradient="linear-gradient(315deg, #AB8D60 14.58%, #B29466 19.53%, #DBC087 50.65%, #AB8D60 85.31%)"
          fontSize={{ base: px2vw(14), lg: "14px" }}
          lineHeight={{ base: px2vw(30), lg: "30px" }}
        >{`${t("nftTips")}42`}</Text>
      </Box>
      {comingSoon ? (
        // coming soon
        <Flex
          mt={{ base: px2vw(60), lg: "60px" }}
          fontSize={{ base: px2vw(36), lg: "36px" }}
          lineHeight={{ base: px2vw(49), lg: "49px" }}
          fontWeight="400"
          flexDir="column"
          alignItems="center"
          bgClip="text"
          bgGradient="linear-gradient(315deg, #AB8D60 14.58%, #B29466 19.53%, #DBC087 50.65%, #AB8D60 85.31%)"
        >
          <Text>{t("comingSoon1")}</Text>
          <Text>{t("comingSoon2")}</Text>
        </Flex>
      ) : (
        // 内容
        <Flex
          flexDir="column"
          px={{ base: px2vw(15), lg: "20px" }}
          mt={{ base: px2vw(20), lg: "20px" }}
        >
          {/* 时间范围 */}
          <Flex
            fontFamily="PingFang SC"
            flexDir="column"
            mb={{ base: px2vw(17), lg: "17px" }}
          >
            <Text
              color="white.100"
              fontWeight="400"
              opacity={0.6}
              fontSize={{ base: px2vw(13), lg: "13px" }}
              lineHeight={{ base: px2vw(18), lg: "18px" }}
              mb={{ base: px2vw(8), lg: "8px" }}
            >
              {t("timeRange")}
            </Text>
            <Text
              color="white.100"
              fontWeight="400"
              fontSize={{ base: px2vw(16), lg: "16px" }}
              lineHeight={{ base: px2vw(22), lg: "22px" }}
            >
              May 25, 2023 - Jun 01, 2023
            </Text>
          </Flex>
          {/* 可用 */}
          <Flex
            fontFamily="PingFang SC"
            justifyContent="flex-start"
            alignItems="flex-start"
            mb={{ base: px2vw(5), lg: "5px" }}
          >
            <Text
              fontWeight="400"
              textStyle="text"
              color="white.60"
              lineHeight={{ base: px2vw(28), lg: "28px" }}
              mr={{ base: px2vw(5), lg: "5px" }}
            >
              {t("use2")}
            </Text>
            <Text
              fontSize={{ base: px2vw(22), lg: "22px" }}
              lineHeight={{ base: px2vw(25), lg: "25px" }}
              mr={{ base: px2vw(5), lg: "5px" }}
              color="white.60"
              fontWeight="500"
              bgClip="text"
              bgGradient="linear-gradient(315deg, #AB8D60 14.58%, #B29466 19.53%, #DBC087 50.65%, #AB8D60 85.31%)"
            >
              100 USDT
            </Text>
            <Text
              fontWeight="400"
              textStyle="16"
              color="white.60"
              lineHeight={{ base: px2vw(28), lg: "28px" }}
            >
              {t("get3")}
            </Text>
          </Flex>
          {/* 获得 */}
          <Flex
            fontFamily="PingFang SC"
            justifyContent="flex-start"
            mb={{ base: px2vw(10), lg: "10px" }}
          >
            <Text
              fontWeight="400"
              textStyle="text"
              color="white.60"
              lineHeight={{ base: px2vw(28), lg: "28px" }}
            >
              {t("get5")}
            </Text>
            <Text
              fontSize={{ base: px2vw(22), lg: "22px" }}
              lineHeight={{ base: px2vw(25), lg: "25px" }}
              ml={i18n.language === "en" ? 0 : { base: px2vw(5), lg: "5px" }}
              mr={{ base: px2vw(5), lg: "5px" }}
              color="white.60"
              fontWeight="500"
              bgClip="text"
              bgGradient="linear-gradient(315deg, #AB8D60 14.58%, #B29466 19.53%, #DBC087 50.65%, #AB8D60 85.31%)"
            >
              {t("get2")}
            </Text>
            <Text
              fontSize={{ base: px2vw(14), lg: "14px" }}
              lineHeight={{ base: px2vw(28), lg: "28px" }}
              mr={{ base: px2vw(5), lg: "5px" }}
              color="white.60"
              fontWeight="500"
              bgClip="text"
              bgGradient="linear-gradient(315deg, #AB8D60 14.58%, #B29466 19.53%, #DBC087 50.65%, #AB8D60 85.31%)"
            >
              {t("get4")}
            </Text>
          </Flex>
          {/* Tips */}
          <Text
            fontFamily="PingFang SC"
            fontWeight="400"
            color="white.100"
            opacity={0.6}
            fontSize={{ base: px2vw(13), lg: "13px" }}
            lineHeight={{ base: px2vw(18), lg: "18px" }}
            mb={{ base: px2vw(28), lg: "28px" }}
          >
            {t("tips2")}
          </Text>
          {/* 倒计时 */}
          <Text
            fontWeight="400"
            color="white.100"
            fontSize={{ base: px2vw(28), lg: "32px" }}
            lineHeight={{ base: px2vw(28), lg: "28px" }}
            mb={{ base: px2vw(30), lg: "30px" }}
          >
            7d: 23h: 34m: 12s
          </Text>
          {/* 按钮 */}
          <BaseButton
            mx="auto"
            w={{ base: "full", lg: "205px" }}
            letterSpacing="0.2rem"
            isDisabled
          >
            MINT
          </BaseButton>
        </Flex>
      )}
    </Flex>
  );
}
export default Index;
