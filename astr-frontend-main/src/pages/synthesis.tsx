import { Flex, SimpleGrid, Stack, border } from "@chakra-ui/react";

import px2vw from "@/theme/utils/px2vw";

import Text from "@/components/Text";
import BaseButton from "@/components/BaseButton";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import panelBG1 from "@/assets/images/panelBG1.png";
import NormalTabs from "@/components/NormalTabs";
import SynthesisRecord from "@/components/SynthesisRecord";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import { useQuery } from "@tanstack/react-query";
import { MergeResultResponse, nftMergeList } from "@/apis/v2";

import { useContractsContext } from "@/context/ContractsContext";
import { multicall } from "@wagmi/core";
import { useConfig } from "@/context/ConfigContext";

import erc20 from "@/contracts/abis/erc20.json";
import { Erc20__factory, NftMerge__factory } from "@/contracts/interface";
import { formatValue } from "@/utils/common";

type Props = {
  // Add custom props here
};

function Index() {
  const router = useRouter();
  const { config } = useConfig();
  const { lscContract, nftMergeContract } = useContractsContext();
  const nftMergeListStatus = useQuery(["nftMergeList"], async () => {
    const res = await nftMergeList();
    return res;
  });

  const getRewardsStatus = useQuery(
    ["getRewards", lscContract?.address],
    async ({ queryKey }) => {
      if (!queryKey) return undefined;
      const res = await getRewards();
      return res;
    },
    {
      enabled:
        !!lscContract?.address && !!config && !!nftMergeContract?.address,
    }
  );

  const balanceOf = formatValue(
    getRewardsStatus?.data?.[0]?.result?.toString(),
    true
  );
  const lds = formatValue(
    getRewardsStatus?.data?.[1]?.result?.toString(),
    false
  );
  const allAward = formatValue(
    getRewardsStatus?.data?.[2]?.result?.toString(),
    true
  );

  const getRewards = async () => {
    const data = await multicall({
      contracts: [
        {
          address: lscContract?.address as `0x${string}`,
          abi: Erc20__factory.abi,
          functionName: "balanceOf",
          args: [config?.nftMerge as `0x${string}`],
        },
        {
          address: nftMergeContract?.address as `0x${string}`,
          abi: NftMerge__factory.abi,
          functionName: "ids",
        },
        {
          address: nftMergeContract?.address as `0x${string}`,
          abi: NftMerge__factory.abi,
          functionName: "allAward",
        },
      ],
    });

    return data;
  };

  const renderSuccess = () => {
    return (nftMergeListStatus?.data?.data?.success || []).map(
      (item: MergeResultResponse) => {
        return (
          <SynthesisRecord
            key={item.id}
            data={{
              ...item,
              value: `${item.lscAmount} LSC`,
            }}
          />
        );
      }
    );
  };

  const renderFailed = () => {
    return (nftMergeListStatus?.data?.data?.fail || []).map(
      (item: MergeResultResponse) => {
        return (
          <SynthesisRecord
            key={item.id}
            data={{
              ...item,
              value: `${item.lsAmount} LS`,
            }}
          />
        );
      }
    );
  };

  return (
    <Stack spacing={px2vw(40)} padding={px2vw(20)} alignItems="center">
      <Stack
        padding={px2vw(25)}
        spacing={px2vw(15)}
        width={px2vw(335)}
        bgImage={panelBG1}
        bgRepeat="no-repeat"
        bgSize="100% 100%"
        //   alignItems="center"
      >
        <Flex flexDirection="column">
          <Text color="purple.100" fontSize="18px" fontWeight="400">
            奖池
          </Text>
          <Text fontSize="24px" fontWeight="400">
            {balanceOf} LSC
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <Text color="purple.100" fontSize="18px" fontWeight="400">
            奖励地址
          </Text>
          <Text fontSize="24px" fontWeight="400">
            {lds}
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <Text color="purple.100" fontSize="18px" fontWeight="400">
            已发奖励
          </Text>
          <Text fontSize="24px" fontWeight="400">
            {allAward} LSC
          </Text>
        </Flex>

        <BaseButton
          onClick={() => {
            router.push("/synthesisDetail");
          }}
          alignSelf="center"
          width={px2vw(275)}
          fontSize="18px"
          colorScheme="gold"
          color="black.100"
        >
          合并碎片
        </BaseButton>
      </Stack>
      <Flex
        flexDirection="column"
        width="100%"
        padding={px2vw(30)}
        border="1px solid "
        borderColor="blue.100"
        borderRadius="20px"
        alignItems="center"
      >
        <NormalTabs
          //   index={index}
          //   onChange={handleTabsChange}
          showTabIndicator={false}
          tabListProps={{
            border: 0,
            gap: "57px",
          }}
          tabProps={{
            color: "white.40",
            fontSize: "16px",
            padding: 0,
            _selected: {
              bgGradient: "linear-gradient(180deg, #BBDFF1 0%, #C4A9F3 100%)",
              bgClip: "text",
            },
          }}
          data={[
            {
              label: "合卡成功Top20",
              content: <Stack justifyContent="center">{renderSuccess()}</Stack>,
            },
            {
              label: "合卡失败补偿",
              content: (
                <Flex width="100%" justifyContent="center">
                  <Stack width="100%" justifyContent="center">
                    {renderFailed()}
                  </Stack>
                </Flex>
              ),
            },
          ]}
        />
      </Flex>
    </Stack>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "cn", [
      "myNFT",
      "market",
      "common",
    ])),
  },
});

export default Index;
