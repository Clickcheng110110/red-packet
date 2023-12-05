import { Text, Flex, FlexProps, Image, Box } from "@chakra-ui/react";
import React, { useState } from "react";
import px2vw from "@/theme/utils/px2vw";
import { useTranslation } from "next-i18next";
import BaseButton, { BaseButtonProps } from "../BaseButton";
import image from "@/assets/images/image1.png";
import usdt from "@/assets/images/usdt.png";

export interface CardProps extends FlexProps {
  buttonProps?: BaseButtonProps;
}
function Index({ buttonProps, ...props }: CardProps) {
  const [isHover, setIsHover] = useState(false);
  const { t } = useTranslation("market");
  return (
    <Flex
      pos="relative"
      border={{ base: "1px solid", lg: "none" }}
      borderColor={{ base: "white.20", lg: "transparent" }}
      w={{ base: px2vw(150), lg: "290px" }}
      h={{ base: px2vw(212), lg: "360px" }}
      p={{ base: 0, lg: "1px" }}
      borderRadius={{ base: px2vw(10), lg: "16px" }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...props}
    >
      {/* 渐变边框 */}
      <Box
        pos="absolute"
        top={0}
        left={0}
        opacity={0.5}
        display={{ base: "none", lg: "block" }}
        w={{ base: px2vw(150), lg: "290px" }}
        h={{ base: px2vw(212), lg: "360px" }}
        borderRadius={{ base: px2vw(10), lg: "16px" }}
        __css={{
          border: "1px solid transparent",
          bgClip: "padding-box, border-box",
          backgroundOrigin: "padding-box, border-box",
          bgImage:
            "linear-gradient(to right, #181727, #181727), linear-gradient(270deg, #AB8D60 0%, #B29466 7%, #DBC087 51%, #AB8D60 100%)",
        }}
      />
      <Flex
        w={{ base: px2vw(150), lg: "288px" }}
        h={{ base: px2vw(212), lg: "360px" }}
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
          w={{ base: "full", lg: "270px" }}
          h={{ base: px2vw(150), lg: "270px" }}
          borderRadius={{ base: px2vw(8), lg: "8px" }}
          borderBottomRadius={{ base: 0, lg: "8px" }}
        >
          <Image
            src={image}
            w={{ base: px2vw(83), lg: "150px" }}
            h={{ base: px2vw(24), lg: "44px" }}
          />
        </Flex>
        {isHover ? (
          // mint
          <BaseButton
            mx="auto"
            letterSpacing="0.2rem"
            w={{ base: `calc(100% - ${px2vw(10)})`, lg: "100%" }}
            h={{ base: px2vw(50), lg: "60px" }}
            mt={{ base: px2vw(5), lg: "10px" }}
            borderRadius={{ base: px2vw(8), lg: "8px" }}
            {...buttonProps}
          >
            {buttonProps?.children || t("mint")}
          </BaseButton>
        ) : (
          <Flex flexDir="column">
            {/* info */}
            <Flex
              h={{ base: "auto", lg: "60px" }}
              p={{ base: px2vw(10), lg: "10px" }}
              mt={{ base: px2vw(10), lg: "10px" }}
              borderRadius={{ base: px2vw(5), lg: "8px" }}
              bgColor={{ base: "transparent", lg: "black.8" }}
              flexDir="column"
              justifyContent="center"
              boxSizing="border-box"
            >
              {/* price */}
              <Flex justifyContent="space-between" alignItems="center">
                <Text
                  fontWeight="300"
                  fontFamily="PingFang SC"
                  color="white.60"
                  fontSize={{ base: px2vw(12), lg: "16px" }}
                  lineHeight={{ base: px2vw(16), lg: "22px" }}
                >
                  {t("price")}
                </Text>
                <Flex alignItems="center">
                  <Image
                    src={usdt}
                    alt="usdt"
                    w={{ base: px2vw(16), lg: "16px" }}
                    h={{ base: px2vw(16), lg: "16px" }}
                    mr={{ base: px2vw(5), lg: "5px" }}
                  />
                  <Text
                    fontWeight="500"
                    fontFamily="PingFang SC"
                    color="white.100"
                    fontSize={{ base: px2vw(14), lg: "16px" }}
                    lineHeight={{ base: px2vw(20), lg: "22px" }}
                  >
                    1,102.5
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
export default Index;
