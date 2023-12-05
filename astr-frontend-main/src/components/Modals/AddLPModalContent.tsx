import React, { useState } from "react";
import {
  Flex,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Image,
  Button,
  useToast,
} from "@chakra-ui/react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import BaseButton from "@/components/BaseButton";
import { IModalContentProps } from "@/hooks/useModal";
import { formatValue, toWei } from "@/utils/common";
import Text from "@/components/Text";
import BaseInput from "@/components/BaseInput";

import USDTToken from "@/assets/images/USDTToken.png";
import ASTRToken from "@/assets/images/ASTRToken.png";
import { useConfigContext } from "@/context/ConfigContext";
import useErc20 from "@/hooks/useErc20";
import { useContractsContext } from "@/context/ContractsContext";
import useTransaction from "@/hooks/useTransaction";
import { MSPID } from "@/config";
import { toastSuccessConfig } from "../NewHome";

BigNumber.config({ EXPONENTIAL_AT: 99 });

export interface Data {
  lpBalance: string;
  refetch: () => void;
}

const AddLPModalContent = ({ data, onClose }: IModalContentProps<Data>) => {
  const [value, setValue] = useState<string>("");
  const lpBalance = data?.lpBalance as string;
  const toast = useToast();
  const { masterChiefContract } = useContractsContext();
  const { config } = useConfigContext();
  const { t } = useTranslation(["lp"]);

  const { isEnough, approveState } = useErc20({
    tokenAddress: config?.lp as string,
    approveTokenAddress: config?.masterChief as string,
    approveAmount: value || "0",
  });

  const depositState = useTransaction(masterChiefContract?.deposit, {
    wait: true,
  });

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleMax = () => {
    setValue(lpBalance);
  };

  const handleAddLp = async () => {
    try {
      const toWeiValue = toWei(value)?.toString();
      await depositState.run(MSPID.LP, toWeiValue, {
        value: "0",
      });
      data?.refetch();
      onClose?.();
      toast({
        ...toastSuccessConfig,
        title: "添加成功",
      });
    } catch (error) {}
  };

  const isOver = new BigNumber(value).gt(lpBalance);
  const isLessThanZero = new BigNumber(value).lte(0);
  const isDisabled =
    isOver ||
    approveState.loading ||
    depositState.loading ||
    isLessThanZero ||
    !value;
  return (
    <Flex flexDir="column" justifyContent="center" alignItems="center">
      <Text type="gradient" fontSize="20px" fontWeight="700">
        {t("addLp")}
      </Text>
      <Text
        marginTop="30px"
        marginBottom="10px"
        fontFamily="PingFang SC"
        fontSize="14px"
        fontWeight="400"
        color="white.60"
      >
        {t("Balance")}: {formatValue(lpBalance)} LSC/USDT LP
      </Text>
      <Stack
        width="100%"
        spacing="10px"
        padding="10px"
        bg="black.30"
        border="1px solid rgba(172, 143, 255, 0.2)"
        borderRadius="10px"
        marginBottom="20px"
      >
        <Text
          fontFamily="PingFang SC"
          color="white.30"
          fontSize="14px"
          fontWeight="400"
        >
          {t("lpAmount")}
        </Text>
        <InputGroup border="0">
          <InputLeftElement>
            <Flex position="relative" width="36px">
              <Image zIndex={10} width="24px" src={ASTRToken} />
              <Image
                position="absolute"
                right="0"
                width="24px"
                src={USDTToken}
              />
            </Flex>
          </InputLeftElement>
          <BaseInput
            value={value}
            valChange={handleChange}
            border="0"
            height="40px"
            fontSize="20px"
            paddingLeft="48px"
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
              width="50px"
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

      {isEnough ? (
        <BaseButton
          colorScheme="gold"
          isDisabled={isDisabled}
          onClick={handleAddLp}
          isLoading={depositState.loading}
          width="295px"
          height="46px"
          fontSize="20px"
        >
          {t("addLp")}
        </BaseButton>
      ) : (
        <BaseButton
          colorScheme="gold"
          onClick={() => {
            approveState.run();
          }}
          isLoading={approveState.loading}
          width="295px"
          height="46px"
          fontSize="20px"
          borderRadius="10px"
        >
          {t("approveToAdd")}
        </BaseButton>
      )}
    </Flex>
  );
};

export default AddLPModalContent;
