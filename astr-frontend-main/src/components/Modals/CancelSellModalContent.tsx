import React from "react";
import { Stack, useToast } from "@chakra-ui/react";

import BigNumber from "bignumber.js";
import BaseButton from "@/components/BaseButton";
import { IModalContentProps } from "@/hooks/useModal";
import { toWei } from "@/utils/common";
import Text from "@/components/Text";
import { blueButtonStyle } from "@/pages/myNFT";
import { useContractsContext } from "@/context/ContractsContext";
import useTransaction from "@/hooks/useTransaction";
import { TRANSFER_AMOUNT } from "./InviteModalContent";
import { toastSuccessConfig } from "../NewHome";
import { useConfigContext } from "@/context/ConfigContext";
import { OperationVerifyStatus } from "@/apis/v2";

BigNumber.config({ EXPONENTIAL_AT: 99 });

const CancelSellModalContent = ({ data, onClose }: IModalContentProps<any>) => {
  const { nftMarketContract } = useContractsContext();
  const { handleSignFunction } = useConfigContext();
  const toast = useToast();
  const cancelStatus = useTransaction(nftMarketContract?.cancelListing, {
    wait: true,
  });

  const handleCancel = async () => {
    try {
      const payValue = toWei(TRANSFER_AMOUNT)?.toString();
      const tokenId = data?.tokenId;
      await handleSignFunction?.(
        data?.tokenId,
        OperationVerifyStatus.CANCELING
      );
      await cancelStatus.run(tokenId, {
        value: payValue,
      });

      toast({
        ...toastSuccessConfig,
        title: "撤单成功",
      });
    } catch (error) {
    } finally {
      await data?.refetch();
      onClose?.();
    }
  };

  return (
    <Stack
      spacing={{ base: "20px" }}
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text type="gradient" fontSize="20px" fontWeight="700">
        取 消 售 卖
      </Text>
      <Text
        fontSize="18px"
        fontWeight="400"
        color="white.100"
        textAlign="center"
      >
        取消售卖后手续费不会被返还。
      </Text>

      <Stack
        spacing="20px"
        direction="column"
        width="100%"
        justifyContent="center"
      >
        <BaseButton
          {...blueButtonStyle}
          colorScheme="gold"
          color="black.100"
          isLoading={cancelStatus?.loading}
          onClick={handleCancel}
          fontSize="18px"
        >
          确认取消售卖
        </BaseButton>
      </Stack>
    </Stack>
  );
};

export default CancelSellModalContent;
