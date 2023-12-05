import React, { useState } from "react";
import {
  Flex,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import BigNumber from "bignumber.js";

import Text from "@/components/Text";
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";

import { IModalContentProps } from "@/hooks/useModal";
import { useContractsContext } from "@/context/ContractsContext";
import useTransaction from "@/hooks/useTransaction";
import { formatValue, toWei } from "@/utils/common";
import { MSPID } from "@/config";
import { toastSuccessConfig } from "../NewHome";

BigNumber.config({ EXPONENTIAL_AT: 99 });

export interface Data {
  stakeBalance: string;
  refetch: () => void;
}

const RemoveLPModalContent = ({ data, onClose }: IModalContentProps<Data>) => {
  const stakeBalance = data?.stakeBalance as string;
  const { masterChiefContract } = useContractsContext();
  const [value, setValue] = useState<string>("");
  // const { config } = useConfigContext();
  const { t } = useTranslation(["lp"]);
  const toast = useToast();
  const withdrawState = useTransaction(masterChiefContract?.withdraw, {
    wait: true,
  });

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleMax = () => {
    setValue(stakeBalance);
  };

  const handleWithdraw = async () => {
    try {
      const toWeiValue = toWei(value)?.toString();
      await withdrawState.run(MSPID.LP, toWeiValue, {
        value: "0",
      });
      data?.refetch();
      onClose?.();
      toast({
        ...toastSuccessConfig,
        title: "移除成功",
      });
    } catch (error) {}
  };

  const isOver = new BigNumber(value).gt(stakeBalance);
  const isLessThanZero = new BigNumber(value).lte(0);
  const isDisabled =
    isOver || withdrawState.loading || isLessThanZero || !value;

  return (
    <Flex flexDir="column" justifyContent="center" alignItems="center">
      <Text type="gradient" fontSize="20px" fontWeight="700">
        {t("removeLp")}
      </Text>
      <Text
        marginTop="30px"
        marginBottom="10px"
        fontFamily="PingFang SC"
        fontSize="14px"
        fontWeight="400"
        color="white.60"
      >
        {t("Balance")}: {formatValue(stakeBalance)} LSC/USDT LP
      </Text>
      <Stack
        spacing="10px"
        padding="10px"
        bg="black.30"
        border="1px solid rgba(172, 143, 255, 0.2)"
        borderRadius="10px"
        marginBottom="20px"
        width="100%"
      >
        <Text
          fontFamily="PingFang SC"
          color="white.30"
          fontSize="14px"
          fontWeight="400"
        >
          {t("removeAmount")}
        </Text>
        <InputGroup border="0">
          <BaseInput
            value={value}
            valChange={handleChange}
            border="0"
            height="40px"
            fontSize="20px"
            paddingRight="68px"
            _placeholder={{
              color: "white.30",
            }}
            placeholder="0.0"
            _focusVisible={{
              boxShadow: "0",
            }}
            fontFamily="PingFang SC"
          />
          <InputRightElement>
            <Button
              onClick={handleMax}
              colorScheme="gray"
              width="60px"
              height="24px"
              bgColor="white.60"
              borderRadius="8px"
              color="black.100"
              fontWeight="700"
              fontSize="14px"
            >
              {t("MAX")}
            </Button>
          </InputRightElement>
        </InputGroup>
      </Stack>
      {isOver && (
        <Text
          alignSelf="flex-start"
          marginBottom="10px"
          color="red.200"
          fontFamily="PingFang SC"
        >
          {t("insufficientBalance")}
        </Text>
      )}
      <BaseButton
        onClick={handleWithdraw}
        isDisabled={isDisabled}
        isLoading={withdrawState.loading}
        width="295px"
        height="46px"
        fontSize="20px"
        border="1px solid"
        borderColor="blue.500"
      >
        {t("removeLp")}
      </BaseButton>
    </Flex>
  );
};

export default RemoveLPModalContent;
