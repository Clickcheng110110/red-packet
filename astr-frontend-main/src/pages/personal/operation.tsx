import BaseButton from "@/components/BaseButton";
import px2vw from "@/theme/utils/px2vw";
import { Box, Flex, Progress, Stack, Image } from "@chakra-ui/react";
import React from "react";
import panelBG1 from "@/assets/images/panelBG5.png";
import LPInfoItem from "@/components/LPInfoItem";
import Text from "@/components/Text";

import gradientArrow from "@/assets/images/gradientArrow.png";
import { useRouter } from "next/router";

export interface OperationHeaderProps {
  route: string;
  title: string;
}

export const OperationHeader = ({ route, title }: OperationHeaderProps) => {
  const router = useRouter();
  return (
    <Flex
      marginTop="40px"
      position="relative"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Image
        onClick={() => {
          router.push(route);
        }}
        position="absolute"
        left="30px"
        top="10px"
        width="14px"
        height="18px"
        src={gradientArrow}
      />
      <Text type="gradient" fontSize="24px">
        {title}
      </Text>
    </Flex>
  );
};

function Index() {
  return (
    <>
      <OperationHeader route="/personal" title="运营中心" />
      <Flex
        flexDirection="column"
        marginTop={{ base: px2vw(40), md: "80px" }}
        padding={{ base: px2vw(20), md: `0 0 60px` }}
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          spacing={{ base: px2vw(20), md: "0" }}
          flexDirection={{ base: "column", md: "row" }}
          width={{ base: px2vw(330), md: "960px" }}
          justifyContent="space-between"
          alignItems={{ base: "center", md: "center" }}
          padding={{ base: px2vw(20), md: "25px 30px" }}
          boxShadow="0px 4px 40px rgba(6, 16, 43, 0.65)"
          bgImage={panelBG1}
          bgSize="100% 100%"
          bgRepeat="no-repeat"
        >
          <LPInfoItem
            width={{ base: "100%", md: "inherit" }}
            justifyContent={{ base: "space-between", md: "center" }}
            label="总量"
            value={`81500`}
          />
          <LPInfoItem
            width={{ base: "100%", md: "inherit" }}
            justifyContent={{ base: "space-between", md: "center" }}
            label="剩余总量"
            value={`1234`}
          />

          <LPInfoItem
            width={{ base: "100%", md: "inherit" }}
            justifyContent={{ base: "space-between", md: "center" }}
            label="已发数量"
            value={`1234`}
          />
        </Stack>
        <Stack width="100%" my={px2vw(40)}>
          <Flex
            color="purple.100"
            justifyContent="space-between"
            alignItems="center"
            px={px2vw(10)}
          >
            <Text fontSize="18px" type="gradient">
              总流水
            </Text>
            <Text fontSize="14px" type="gradient">
              达标(4000)
            </Text>
          </Flex>
          <Progress
            colorScheme="purple"
            borderRadius="23px"
            height="30px"
            hasStripe
            isAnimated
            bgColor="black.100"
            border="1px solid"
            borderColor="blue.500"
            value={64}
          />
        </Stack>

        <Stack width="100%" my={px2vw(40)}>
          <Flex
            color="purple.100"
            justifyContent="space-between"
            alignItems="center"
            px={px2vw(10)}
          >
            <Text fontSize="18px" type="gradient">
              今日流水
            </Text>
            <Text fontSize="14px" type="gradient">
              达标(400)
            </Text>
          </Flex>
          <Progress
            colorScheme="blue"
            borderRadius="23px"
            height="40px"
            hasStripe
            isAnimated
            bgColor="black.100"
            border="1px solid"
            borderColor="blue.500"
            value={64}
          />
        </Stack>
      </Flex>
    </>
  );
}

export default Index;
