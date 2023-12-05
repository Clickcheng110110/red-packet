import config from "@/config";
import { bscTestnet, bsc } from "viem/chains";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Signer, ethers } from "ethers";
import { useIsMounted } from "usehooks-ts";

import {
  Chain,
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

import * as allChains from "wagmi/chains";
import { isDev, supportChains } from "@/pages/_app";
import { OperationVerifyStatus, operateList } from "@/apis/v2";
import InfoBox, { toastOption } from "@/components/TransToast";
import { toast } from "react-toastify";
import { portalErrorTranslation, sleep } from "@/utils/common";

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : never;
export type IConfigContext = Partial<ReturnType<typeof useConfig>>;

const message = "Operation Verify";

export const ConfigContext = createContext<IConfigContext>({});

export function useConfig() {
  const [signer, setSigner] = useState<Signer | null>();
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>();
  const [defaultChain, setDefaultChain] = useState<Chain>();

  const { chain: wagmiChain } = useNetwork();
  const { address, connector, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const switchNetworkStatus = useSwitchNetwork();

  const chain = wagmiChain || defaultChain;
  const isSupportChain = !!supportChains.find((item) => item.id === chain?.id);
  const curChianConfig = isSupportChain
    ? chain?.id
      ? config?.[chain?.id]
      : null
    : isDev
    ? config[bscTestnet.id]
    : config[bsc.id];

  // const handleSignFunction = async (
  //   tokenId: number,
  //   status: OperationVerifyStatus
  // ) => {
  //   if (!address) return null;
  //   const web3 = new Web3((window as any).ethereum);
  //   await (window as any).ethereum.enable();
  //   await web3.personal.sign(
  //     web3.toHex(message),
  //     address,
  //     async (error: string, sign: string) => {
  //       if (error) {
  //         toast(
  //           (props) => {
  //             return <InfoBox type="error" {...props} />;
  //           },
  //           {
  //             ...toastOption,
  //             data: portalErrorTranslation(error),
  //           }
  //         );
  //       }
  //       if (!sign) return;
  //       const data = await operateList({
  //         address: address.toLowerCase(),
  //         sign,
  //         message,
  //         tokenId,
  //         status,
  //       });
  //       return data.data;
  //     }
  //   );
  // };

  const handleSignFunction = async (
    tokenId: number,
    status: OperationVerifyStatus
  ) => {
    if (!address) return null;
    const ethereum = (window as any).ethereum;
    await ethereum.enable();
    const sign = await ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });
    await operateList({
      address: address.toLowerCase(),
      sign,
      message,
      tokenId,
      status,
    });
    await sleep(1000);
  };

  useEffect(() => {
    const getSignerAndProvider = async () => {
      const ethereum = (window as any).ethereum;
      const chainId = Number(ethereum.chainId);
      const chain = Object.values(allChains).find(
        (item) => item.id === chainId
      );

      const provider = new ethers.providers.JsonRpcProvider(
        allChains[isDev ? "bscTestnet" : "bsc"]?.rpcUrls?.default?.http[0]
      );
      const ethereumProvider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = ethereumProvider.getSigner();
      setDefaultChain(chain);
      setProvider(isConnected && isSupportChain ? ethereumProvider : provider);
      setSigner(isConnected && isSupportChain ? signer : null);
    };
    getSignerAndProvider();
  }, [isConnected, isSupportChain]);

  const value = {
    signer: signer,
    provider,
    signerOrProvider: signer || provider,
    isConnected,
    address: address,
    chain: chain,
    connector,
    connectors,
    switchNetworkStatus,
    config: curChianConfig,
    isSupportChain,
    connect,
    disconnect,
    handleSignFunction,
  };

  return value;
}

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useConfig();
  const isMounted = useIsMounted();

  return (
    <ConfigContext.Provider value={isMounted() ? config : {}}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  const values = useContext(ConfigContext);
  return values;
};
