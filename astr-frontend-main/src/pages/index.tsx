import { Flex } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";

import px2vw from "@/theme/utils/px2vw";
import NewHome from "@/components/NewHome";

type Props = {
  // Add custom props here
};

export default function Home(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { t } = useTranslation(["common"]);

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      as="main"
    >
      <Flex
        mt={{ base: px2vw(55), lg: "55px" }}
        padding={{ base: `0 ${px2vw(20)}`, lg: "0 60px" }}
        pb={{ base: px2vw(20), lg: 0 }}
        width={{ base: "full", lg: "1440px" }}
        flexDir={{ base: "column", lg: "row" }}
        minH="calc(100vh - 350px)"
        margin="0 auto"
        justifyContent="space-between"
        alignItems="center"
      >
        <NewHome />
      </Flex>
    </Flex>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "cn", ["common", "footer"])),
  },
});
