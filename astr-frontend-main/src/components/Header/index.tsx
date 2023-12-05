import React, { useContext, useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { buttonHover } from "@/theme/utils/style";
import useModal from "@/hooks/useModal";
import ConnectModalContent, {
  WalletNames,
  walletIcons,
} from "@/components/Modals/ConnectModalContent";
import px2vw from "@/theme/utils/px2vw";
import { ConfigContext } from "@/context/ConfigContext";
import { formatAddress } from "@/utils/common";
import { useToggle } from "usehooks-ts";

import logo from "@/assets/images/logo.png";
import more from "@/assets/images/more.svg";
import close from "@/assets/images/close.svg";
import telegram from "@/assets/images/telegram.svg";
import twitter from "@/assets/images/twitter.svg";

import NetworkModalContent from "../Modals/NetworkModalContent";
import InviteModalContent from "../Modals/InviteModalContent";
import { useContractsContext } from "@/context/ContractsContext";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import Link from "next/link";
import WalletDisconnectContent from "../Modals/WalletDisconnectContent";
import { UserBind__factory } from "@/contracts/interface";

export interface LinkItem {
  label: string;
  path: string;
  isLink: boolean;
  isDisabled: boolean;
}
export interface HeaderProps {
  isTp: boolean;
}
export type Props = {
  // TODO
};

function Index({ isTp }: HeaderProps) {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, toggle] = useToggle(false);
  const { t } = useTranslation(["common"]);
  const { userBindContact } = useContractsContext();
  const { address, connector, isSupportChain } = useContext(ConfigContext);
  const [ConnectModal, connectModalStatus] = useModal(ConnectModalContent);

  const [WalletDisconnectModal, WalletDisconnectStatus] = useModal(
    WalletDisconnectContent,
    {
      width: 335,
      modalBodyProps: {
        minHeight: { base: px2vw(200), lg: "100%" },
      },
    }
  );

  const [NetworkModal, networkStatus] = useModal(NetworkModalContent, {
    width: 650,
    modalBodyProps: {
      minHeight: { base: px2vw(200), lg: "100%" },
    },
  });

  const [InviteModal, inviteModalStatus] = useModal(InviteModalContent, {
    width: 335,
    hasTopRightCloseButton: false,
    closeOnOverlayClick: false,
    closeOnEsc: false,
    blockScrollOnMount: false,
  });

  const userbindsStatus = useQuery(
    ["userbinds", address, userBindContact?.address],
    async ({ queryKey }) => {
      if (!queryKey[1]) return 1;
      if (!queryKey[2]) return 1;
      const res = await getUserBinds(queryKey[1]);

      if (res === ethers.constants.AddressZero) {
        return null;
      }
      return res;
    },
    {
      enabled: !!address && !!userBindContact?.address,
    }
  );

  const getUserBinds = async (address: string) => {
    try {
      console.log("address", address);
      console.log("userBindContact", userBindContact?.address);
      const res = await userBindContact?.userBinds(address);
      return res;
    } catch (error) {
      return 1;
    }
  };

  const links: LinkItem[] = [
    {
      label: t("home"),
      path: "/",
      isLink: false,
      isDisabled: false,
    },
    {
      label: t("buyASTR"),
      path: "https://pancakeswap.finance/swap?outputCurrency=0x2b3559c3DBdB294cbb71f2B30a693F4C6be6132d&inputCurrency=0x55d398326f99059fF775485246999027B3197955 ",
      isLink: true,
      isDisabled: false,
    },
    {
      label: "NFT交易市场",
      path: "/market",
      isLink: false,
      isDisabled: false,
    },
    {
      label: "我的NFT",
      path: "/myNFT",
      isLink: false,
      isDisabled: false,
    },
    {
      label: "NFT碎片合卡",
      path: "/synthesis",
      isLink: false,
      isDisabled: false,
    },
    {
      label: "LP质押",
      path: "/lp",
      isLink: false,
      isDisabled: false,
    },

    {
      label: "个人中心",
      path: "/personal",
      isLink: false,
      isDisabled: false,
    },

    {
      label: "社区公告",
      path: "",
      isLink: true,
      isDisabled: true,
    },

    // {
    //   label: t("doc"),
    //   path: "https://docs.astr.cool/",
    //   isLink: true,
    //   isDisabled: false,
    // },
  ];

  const handleLink = (item: LinkItem) => {
    if (item.isDisabled) {
      toast({
        position: "top",
        title: "Coming soon",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    if (item.isLink) {
      window.open(item.path, "newWindow");
    } else {
      router.push(item.path);
    }
  };

  const handleOpenDisconnectModal = () => {
    WalletDisconnectStatus.onOpen();
  };

  const render = () => {
    return links.map((item) => {
      return (
        <Text
          height="27px"
          textStyle="normal"
          onClick={() => {
            handleLink(item);
          }}
          key={item.path}
          _hover={buttonHover}
          paddingBottom="3px"
          borderBottom={item.path === router.asPath ? "2px solid #ffffff" : "0"}
        >
          {item.label}
        </Text>
      );
    });
  };

  // const changeTo = router.locale === "en" ? "cn" : "en";
  const changeTo = "cn";

  useEffect(() => {
    if (router.isReady && router?.query?.inviteAddress) {
      inviteModalStatus.onOpen({
        address: router?.query?.inviteAddress as string,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router?.query?.inviteAddress]);

  useEffect(() => {
    if (!address) return;
    if (!userBindContact?.address) return;
    if (userbindsStatus.isFetched) {
      if (userbindsStatus.isError) return;
      if (!userbindsStatus.data) {
        inviteModalStatus.onOpen();
      } else {
        inviteModalStatus.onClose();
      }
    }
  }, [
    address,
    userBindContact?.address,
    userbindsStatus.isFetched,
    userbindsStatus.data,
    userbindsStatus.isError,
    inviteModalStatus,
  ]);

  return (
    <>
      <Box
        display={{ base: "none", md: "block" }}
        bgColor={isTp ? "transparent" : "black.500"}
        zIndex={99}
        position="fixed"
        width="100%"
        paddingTop="40px"
        // bgColor="blue.500"
      >
        <Flex
          justify="space-between"
          alignItems="center"
          height={{ base: px2vw(53), md: "76px" }}
          maxWidth={"1400px"}
          margin="0 auto"
        >
          <Image
            onClick={() => {
              router.push("/");
            }}
            src={logo}
            width={{ base: px2vw(34), md: "68px" }}
          />
          <Stack direction="row" spacing="70px" alignItems="center">
            {render()}
            {/* {address ? (
              isSupportChain ? (
                <Button
                  onClick={walletInfoModalStatus.onOpen}
                  colorScheme="blue"
                  width="200px"
                  borderRadius="16px"
                  fontSize="18px"
                  fontWeight="400"
                >
                  <Image
                    width="23px"
                    marginRight="13px"
                    src={walletIcons[connector?.id as WalletNames]}
                  />
                  {formatAddress(address)}
                </Button>
              ) : (
                <Button
                  onClick={networkStatus.onOpen}
                  colorScheme="purple"
                  width="200px"
                  borderRadius="16px"
                  fontSize="18px"
                  fontWeight="400"
                >
                  <Image
                    width="23px"
                    marginRight="13px"
                    src={walletIcons[connector?.id as WalletNames]}
                  />
                  {t("Network Error")}
                </Button>
              )
            ) : (
              <Button
                onClick={connectModalStatus.onOpen}
                colorScheme="blue"
                width="200px"
                borderRadius="16px"
              >
                {t("connectWallet")}
              </Button>
            )} */}
          </Stack>
        </Flex>
      </Box>
      <Box
        display={{ base: "flex", md: "none" }}
        zIndex={99}
        position="fixed"
        width="100%"
        paddingTop={px2vw(24)}
        paddingLeft={px2vw(24)}
        paddingRight={px2vw(24)}
        backgroundColor={isOpen ? "#181D20" : "black.500"}
      >
        <Flex
          justify="space-between"
          alignItems="center"
          height={{ base: px2vw(53) }}
          width="100%"
        >
          <Image
            onClick={() => {
              router.push("/cn");
            }}
            src={logo}
            width={{ base: px2vw(88) }}
          />

          <Stack direction="row" spacing={px2vw(5)} alignItems="center">
            {address ? (
              <Button
                onClick={handleOpenDisconnectModal}
                colorScheme="white"
                width={px2vw(156)}
                borderRadius="16px"
                fontSize="16px"
                fontWeight="400"
              >
                <Image
                  width={px2vw(23)}
                  marginRight="13px"
                  src={walletIcons[connector?.id as WalletNames]}
                />
                {formatAddress(address)}
              </Button>
            ) : (
              <Button
                onClick={connectModalStatus.onOpen}
                colorScheme="blue"
                width={px2vw(121)}
                borderRadius="16px"
                fontWeight="400"
                fontSize="12px"
                color="black.100"
              >
                {t("connectWallet")}
              </Button>
            )}
            <Link color="black.100" href={router.pathname} locale={changeTo}>
              <Flex
                justifyContent="center"
                alignItems="center"
                width={px2vw(36)}
                height={px2vw(36)}
                borderRadius="50%"
                bgColor="blue.500"
                color="black.100"
                _hover={buttonHover}
              >
                {/* {t("language", { changeTo })} */}中
              </Flex>
            </Link>
            <Image
              src={isOpen ? close : more}
              width={isOpen ? px2vw(40) : px2vw(46)}
              onClick={() => {
                toggle();
              }}
            />
          </Stack>
        </Flex>
      </Box>
      <Flex
        display={isOpen ? "flex" : "none"}
        flexDirection="column"
        position="fixed"
        width="100%"
        top={px2vw(76)}
        bgColor="#181D20"
        zIndex={100}
      >
        <Stack
          width="100%"
          direction="column"
          alignItems="flex-end"
          padding={px2vw(30)}
          spacing={px2vw(30)}
          fontSize="18px"
          color="blue.100"
        >
          {[
            links[0],
            links[1],
            links[2],
            links[3],
            links[4],
            links[5],
            links[6],
          ].map((item) => (
            <Text
              key={item.label}
              onClick={() => {
                handleLink(item);
                toggle();
              }}
              fontWeight="700"
              fontSize="18px"
            >
              {item.label}
            </Text>
          ))}
          <Flex width="100%" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing="20px">
              <Image
                onClick={() => window.open("https://t.me/LSCNFT")}
                src={telegram}
                width={px2vw(30)}
              />
              <Image
                onClick={() =>
                  window.open("https://twitter.com/AstrAstrol75591")
                }
                src={twitter}
                width={px2vw(30)}
              />
            </Stack>

            <Text
              key={links[7].label}
              onClick={() => {
                handleLink(links[7]);
                toggle();
              }}
              fontWeight="700"
              fontSize="18px"
            >
              {links[7].label}
            </Text>
          </Flex>
        </Stack>

        <Text
          my={px2vw(30)}
          color="white.60"
          fontSize="14px"
          textAlign="center"
          letterSpacing="2.24px"
        >
          lucky-star.fun 版权所有，保留一切权力。
        </Text>
      </Flex>
      {ConnectModal}
      {NetworkModal}
      {InviteModal}
      {WalletDisconnectModal}
    </>
  );
}
export default Index;
