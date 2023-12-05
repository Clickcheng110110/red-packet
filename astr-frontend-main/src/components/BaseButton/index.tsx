import { useConfigContext } from "@/context/ConfigContext";
import px2vw from "@/theme/utils/px2vw";
import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";
import ConnectModalContent from "../Modals/ConnectModalContent";
import useModal from "@/hooks/useModal";
import { useTranslation } from "next-i18next";

export interface BaseButtonProps extends ButtonProps {
  needLogin?: boolean;
}

function Index({
  children,
  isDisabled,
  needLogin = false,
  onClick,
  ...props
}: BaseButtonProps) {
  const { isConnected } = useConfigContext();
  const { t } = useTranslation();
  const [ConnectModal, connectModalStatus] = useModal(ConnectModalContent);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isConnected) {
      connectModalStatus.onOpen();
      return;
    }
    onClick?.(e);
  };
  return (
    <>
      <Button
        onClick={handleClick}
        isDisabled={isDisabled}
        colorScheme="black"
        w="full"
        // boxShadow="inset 0px 0px 12px 1px #FFE178"
        fontWeight="700"
        pos="relative"
        h={{ base: px2vw(46), lg: "46px" }}
        borderRadius={{ base: px2vw(20), lg: "20px" }}
        fontSize={{ base: px2vw(24), lg: "24px" }}
        _loading={{
          bg: "blue.500",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        // _hover={
        //   isDisabled
        //     ? {}
        //     : {
        //         color: "black.500",
        //         boxShadow: "inset 0px 0px 40px 1px #FFD644",
        //       }
        // }
        _disabled={{
          // bg: "blue.500",
          opacity: 0.6,
          cursor: "not-allowed",
        }}
        {...props}
      >
        {needLogin && !isConnected ? t("Login") : children}
      </Button>
      {ConnectModal}
    </>
  );
}
export default Index;
