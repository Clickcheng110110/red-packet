import px2vw from "@/theme/utils/px2vw";
import { Flex } from "@chakra-ui/react";
import React from "react";
import MintFragmentCard from "../MintFragmentCard";
import useModal from "@/hooks/useModal";
import MintModalContent from "@/components/Modals/MintModalContent";

function Index() {
  const [MintModal, MintModalStatus] = useModal(MintModalContent, {
    modalBodyProps: {
      minH: { base: px2vw(563), lg: "563px" },
      p: { base: px2vw(10), lg: "10px" },
    },
    hasTopRightCloseButton: false,
    hasBottomRightCloseButton: true,
    hasGradientBorder: true,
  });
  return (
    <Flex flexWrap="wrap">
      <MintFragmentCard
        mr={{ base: px2vw(25), lg: "50px" }}
        mb={{ base: px2vw(30), lg: "40px" }}
        buttonProps={{
          onClick: () => {
            MintModalStatus?.onOpen();
          },
        }}
      />
      <MintFragmentCard
        mr={{ base: px2vw(0), lg: "50px" }}
        mb={{ base: px2vw(30), lg: "40px" }}
        buttonProps={{
          onClick: () => {
            MintModalStatus?.onOpen();
          },
        }}
      />
      <MintFragmentCard
        mr={{ base: px2vw(25), lg: "50px" }}
        mb={{ base: px2vw(30), lg: "40px" }}
        buttonProps={{
          onClick: () => {
            MintModalStatus?.onOpen();
          },
        }}
      />
      <MintFragmentCard
        mb={{ base: px2vw(40), lg: "40px" }}
        buttonProps={{
          onClick: () => {
            MintModalStatus?.onOpen();
          },
        }}
      />
      <MintFragmentCard
        mr={{ base: px2vw(25), lg: "50px" }}
        mb={{ base: px2vw(30), lg: "40px" }}
        buttonProps={{
          onClick: () => {
            MintModalStatus?.onOpen();
          },
        }}
      />
      <MintFragmentCard
        mr={{ base: px2vw(0), lg: "50px" }}
        mb={{ base: px2vw(30), lg: "40px" }}
        buttonProps={{
          onClick: () => {
            MintModalStatus?.onOpen();
          },
        }}
      />
      <MintFragmentCard
        mr={{ base: px2vw(25), lg: "50px" }}
        mb={{ base: px2vw(30), lg: "40px" }}
        buttonProps={{
          onClick: () => {
            MintModalStatus?.onOpen();
          },
        }}
      />
      <MintFragmentCard
        mb={{ base: px2vw(40), lg: "40px" }}
        buttonProps={{
          onClick: () => {
            MintModalStatus?.onOpen();
          },
        }}
      />
      {MintModal}
    </Flex>
  );
}
export default Index;
