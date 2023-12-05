import { Image, Text, Flex } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { IModalContentProps } from "@/hooks/useModal";
import px2vw from "@/theme/utils/px2vw";
import image from "@/assets/images/image1.png";
import usdt from "@/assets/images/usdt.png";
import BaseButton from "../BaseButton";

function MintModalContent({ onClose }: IModalContentProps) {
  const { t } = useTranslation("market");
  return (
    <Flex flexDir="column">
      {/* 图片 */}
      <Flex
        justifyContent="center"
        alignItems="center"
        bgColor="white.10"
        flexShrink={0}
        w="full"
        h={{ base: px2vw(150), lg: "315px" }}
        borderRadius={{ base: px2vw(8), lg: "8px" }}
      >
        <Image
          src={image}
          w={{ base: px2vw(83), lg: "150px" }}
          h={{ base: px2vw(24), lg: "44px" }}
        />
      </Flex>
      <Flex
        mt={{ base: px2vw(20), lg: "20px" }}
        pl={{ base: px2vw(10), lg: "10px" }}
        flexDir="column"
        boxSizing="border-box"
      >
        {/* price */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb={{ base: px2vw(30), lg: "30px" }}
        >
          <Text
            fontWeight="300"
            fontFamily="PingFang SC"
            color="white.60"
            textStyle="text"
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
        {/* button */}
        <BaseButton
          mx="auto"
          borderRadius={{ base: px2vw(10), lg: "10px" }}
          w={{ base: px2vw(285), lg: "285px" }}
          onClick={() => onClose?.()}
        >
          {t("confirmMint")}
        </BaseButton>
      </Flex>
    </Flex>
  );
}

export default MintModalContent;
