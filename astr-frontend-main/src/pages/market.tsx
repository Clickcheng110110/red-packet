import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Image,
} from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "react-i18next";
import NFTTradingPage from "@/components/NFTTradingPage";
// import MintFragmentPage from "@/components/MintFragmentPage";
import px2vw from "@/theme/utils/px2vw";
import { ChangeEvent, useState } from "react";
import { OptionItem } from "@/components/MarketMenu";
import Tabs from "@/components/Tabs";
import Text from "@/components/Text";

import tradingTimeUp from "@/assets/images/tradingTimeUp.png";
import tradingTimeDown from "@/assets/images/tradingTimeDown.png";
import sellingPriceUp from "@/assets/images/sellingPriceUp.png";
import sellingPriceDown from "@/assets/images/sellingPriceDown.png";

import { useQuery } from "@tanstack/react-query";
import { getMarketNFT } from "@/apis/v2";

type Props = {
  // Add custom props here
};

const defaultBody = {
  page: 1,
  pageSize: 10,
  tokenId: "",
};

export default function MarKet(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [body, setBody] = useState({
    1: {
      age: 1,
      ...defaultBody,
    },
    2: {
      age: 2,
      ...defaultBody,
    },
    3: {
      age: 3,
      ...defaultBody,
    },
  });

  return (
    <Flex
      mt={{ base: px2vw(10), lg: "30px" }}
      padding={{ base: `0 ${px2vw(20)}`, lg: "0 60px" }}
      // justifyContent="space-between"
      alignItems="center"
      minH="70vh"
      maxWidth="1440px"
      margin="0 auto"
      flexDirection="column"
      as="main"
    >
      <Text
        marginBottom={px2vw(15)}
        type="gradient"
        fontSize="24px"
        fontWeight="400"
      >
        NFT交易市场
      </Text>

      {/* 顶部 */}
      <Flex justifyContent="space-between" pos="relative" w="full">
        {/* Tabs */}
        <Tabs
          w="full"
          data={[
            {
              label: "I代卡",
              content: (
                <NFTTradingPage
                  age={1}
                  requestBody={body[`1`]}
                  setBody={setBody}
                />
              ),
            },
            {
              label: "II代卡",
              content: (
                <NFTTradingPage
                  age={2}
                  requestBody={body[`2`]}
                  setBody={setBody}
                />
              ),
            },
            {
              label: "III代卡",
              content: (
                <NFTTradingPage
                  age={3}
                  requestBody={body[`3`]}
                  setBody={setBody}
                />
              ),
            },
          ]}
        />
      </Flex>
    </Flex>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "cn", [
      "market",
      "common",
      "footer",
    ])),
  },
});
