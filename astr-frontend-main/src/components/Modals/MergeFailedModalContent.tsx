import { Image, Flex } from "@chakra-ui/react";

import { IModalContentProps } from "@/hooks/useModal";
import px2vw from "@/theme/utils/px2vw";
import image from "@/assets/images/image1.png";
import BaseButton from "../BaseButton";
import { TradingData } from "../NFTTradingCard";
import { swiperData } from "../NewHome";
import Text from "@/components/Text";
import { MergeResultResponse } from "@/apis/v2";
import mergeFailedImage from "@/assets/images/mergeFailedImage.png";

export interface Data {
  activeItem: TradingData;
  refresh?: () => void;
}

function MergeFailedModalContent({
  data,
  onClose,
}: IModalContentProps<MergeResultResponse>) {
  return (
    <Flex width="100%" flexDir="column">
      <Text fontSize="24px" color="white.100" textAlign="center">
        合并失败
      </Text>
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
        <Image src={mergeFailedImage} w={px2vw(165)} h={px2vw(165)} />
      </Flex>
      <Flex
        width="100%"
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
            fontSize="18px"
            color="white.60"
            textStyle="text"
            fontWeight="500"
          >
            获得补偿
          </Text>
          {/* 名称 */}
          <Text
            fontSize="18px"
            color="white.100"
            textStyle="text"
            fontWeight="500"
          >
            {data?.lsAmount} LS
          </Text>
        </Flex>
        {/* button */}
        <BaseButton
          mx="auto"
          colorScheme="gold"
          my={px2vw(8)}
          w={{ base: `calc(100% - ${px2vw(10)})`, lg: "100%" }}
          h={{ base: px2vw(46), lg: "72px" }}
          fontSize={{ base: px2vw(12), lg: "24px" }}
          borderRadius={{ base: px2vw(23), lg: "23px" }}
          onClick={() => {
            onClose?.();
          }}
        >
          <Flex
            width="100%"
            justifyContent="center"
            alignItems="center"
            color="black.100"
          >
            <Text fontSize="14px" fontWeight="600">
              确认
            </Text>
          </Flex>
        </BaseButton>
      </Flex>
    </Flex>
  );
}

export default MergeFailedModalContent;
