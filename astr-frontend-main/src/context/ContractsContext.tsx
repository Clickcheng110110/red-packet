import { createContext, useContext } from "react";
import { useConfigContext } from "./ConfigContext";
import {
  Ido__factory,
  Lp__factory,
  MasterChief__factory,
  UserBind__factory,
  NftInfo__factory,
  NftMarket__factory,
  NftMerge__factory,
  Erc20__factory,
} from "@/contracts/interface";
import { AwardCenter__factory } from "@/contracts/interface/factories/AwardCenter__factory";

export type IContractContext = Partial<ReturnType<typeof useContracts>>;
export const ContractsContext = createContext<IContractContext>({});

export const useContracts = () => {
  const { config, signerOrProvider } = useConfigContext();

  if (!config || !signerOrProvider) return {};
  const masterChiefContract = MasterChief__factory.connect(
    config.masterChief,
    signerOrProvider
  );

  const lscContract = Erc20__factory.connect(config.astr, signerOrProvider);
  const lpContract = Lp__factory.connect(config.lp, signerOrProvider);
  const idoContract = Ido__factory.connect(config.ido, signerOrProvider);
  const userBindContact = UserBind__factory.connect(
    config.userBind,
    signerOrProvider
  );
  const awardCenterContract = AwardCenter__factory.connect(
    config.awardCenter,
    signerOrProvider
  );

  const nftContract = NftInfo__factory.connect(config.nft, signerOrProvider);

  const nftMarketContract = NftMarket__factory.connect(
    config.nftMarket,
    signerOrProvider
  );

  const nftMergeContract = NftMerge__factory.connect(
    config.nftMerge,
    signerOrProvider
  );

  return {
    masterChiefContract,
    lpContract,
    idoContract,
    lscContract,
    userBindContact,
    nftMarketContract,
    nftContract,
    nftMergeContract,
    awardCenterContract,
  };
};

export const ContractsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const contracts = useContracts();
  return (
    <ContractsContext.Provider value={contracts}>
      {children}
    </ContractsContext.Provider>
  );
};

export const useContractsContext = () => {
  const values = useContext(ContractsContext);
  return values;
};
