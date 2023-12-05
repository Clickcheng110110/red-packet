import { Stack, Image, Text, Flex, FlexProps } from "@chakra-ui/react";
import { buttonHover } from "@/theme/utils/style";
import { Cinzel } from "@next/font/google";
import { useContext } from "react";
import { ConfigContext } from "@/context/ConfigContext";
import { IModalContentProps } from "@/hooks/useModal";
import { useTranslation } from "next-i18next";

import logo from "@/assets/images/logo.png";
import metamaskIcon from "@/assets/images/metamaskIcon.png";
import walletConnect from "@/assets/images/walletConnect.png";
import arrow from "@/assets/images/arrow.svg";
export interface WalletItemProps extends FlexProps {
  icon: string;
  label: string;
}

export enum WalletNames {
  MetaMask = "metaMask",
  // WalletConnect = "walletConnect",
  Injected = "injected",
}

export const walletIcons: Record<WalletNames, string> = {
  [WalletNames.MetaMask]: metamaskIcon,
  // [WalletNames.WalletConnect]: walletConnect,
  [WalletNames.Injected]: metamaskIcon,
};

const cinzel = Cinzel({ subsets: ["latin"], weight: "700" });

export const WalletItem = ({
  icon,
  label,
  onClick,
  ...otherProps
}: WalletItemProps) => {
  return (
    <Flex
      padding="10px 25px"
      bgColor="black.20"
      height="50px"
      justifyContent="space-between"
      alignItems="center"
      borderRadius="20px"
      onClick={onClick}
      _hover={buttonHover}
      {...otherProps}
    >
      <Stack direction="row" spacing="15px" alignItems="center">
        <Image src={icon} />
        <Text fontSize="18px" fontWeight="500">
          {label}
        </Text>
      </Stack>
      <Flex
        width="30px"
        height="30px"
        justifyContent="center"
        alignItems="center"
        bgColor="#181727"
        borderRadius="50%"
      >
        <Image src={arrow} width="10px" height="8px" />
      </Flex>
    </Flex>
  );
};

function ConnectModalContent({ onClose }: IModalContentProps) {
  const { connectors, connect } = useContext(ConfigContext);
  const { t } = useTranslation();
  return (
    <Stack
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      spacing="34px"
      fontFamily="PingFang SC"
    >
      <Stack
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        spacing="20px"
      >
        <Image src={logo} height="76px" />
        <Text className={cinzel.className} fontSize="24px" fontWeight="700">
          {t("connectWallet")}
        </Text>
      </Stack>
      <Stack width="100%">
        <WalletItem
          onClick={() => {
            connect?.({ connector: connectors?.[2] });
            onClose?.();
          }}
          icon={metamaskIcon}
          label="MetaMask"
        />
        {/* <WalletItem
          onClick={() => {
            connect?.({ connector: connectors?.[1] });
            onClose?.();
          }}
          icon={walletConnect}
          label="Wallet Connect"
        /> */}
      </Stack>
    </Stack>
  );
}

export default ConnectModalContent;
