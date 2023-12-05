import React, { useEffect, useState } from "react";
import { Flex, Stack, Image, Button, Switch, useToast } from "@chakra-ui/react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import BaseButton from "@/components/BaseButton";
import { IModalContentProps } from "@/hooks/useModal";
import { toWei } from "@/utils/common";
import Text from "@/components/Text";
import BaseInput from "@/components/BaseInput";

import switchUnactive from "@/assets/images/switch.svg";
import switchActive from "@/assets/images/switchActive.svg";
import inviteLogo from "@/assets/images/inviteLogo.png";
import { useContractsContext } from "@/context/ContractsContext";
import useTransaction from "@/hooks/useTransaction";
import { ethers } from "ethers";
import { toastSuccessConfig } from "../NewHome";
import { useConfig } from "@/context/ConfigContext";
import { WalletNames, walletIcons } from "./ConnectModalContent";

BigNumber.config({ EXPONENTIAL_AT: 99 });

export interface Data {
  address: string;
  userBind: any;
  refetch: () => Promise<void>;
}

export const TRANSFER_AMOUNT = "0.0001";
export const DEFAULT_ADDRESS = "0xD38549F8E818A96efFB2d3F419675A2DF909bD36";

const WalletDisconnectContent = ({
  data,
  onClose,
}: IModalContentProps<Data>) => {
  const toast = useToast();

  const { t } = useTranslation();
  const { address, connector, disconnect } = useConfig();

  const handleConfirm = async () => {
    disconnect();
  };

  return (
    <Stack
      spacing={{ base: "25px" }}
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <Image src={walletIcons?.[connector?.id as WalletNames]} width="59px" />
      <Text width="100%" fontSize="18px" fontWeight="400">
        {address}
      </Text>
      <Flex width="100%" justifyContent="center">
        <BaseButton
          needLogin
          onClick={handleConfirm}
          width="205px"
          height="46px"
          colorScheme="gold"
          variant="solid"
          fontSize="18px"
          fontWeight="700"
          color="black.100"
          borderRadius="23px"
        >
          退出钱包
        </BaseButton>
      </Flex>
    </Stack>
  );
};

export default WalletDisconnectContent;
