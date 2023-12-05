import { useEffect, useMemo, useState } from "react";
import { useConfigContext } from "@/context/ConfigContext";
import { Erc721__factory } from "@/contracts/interface";
import useTransaction from "./useTransaction";
import { ethers } from "ethers";

export interface UseErc20Props {
  tokenAddress: string;
  approveTokenAddress?: string;
  tokenId?: string;
}

function Index({
  tokenAddress,
  approveTokenAddress = ethers.constants.AddressZero,
  tokenId,
}: UseErc20Props) {
  const { signerOrProvider, address } = useConfigContext();
  const [isApproved, setIsApproved] = useState<boolean>();
  const isLoading = isApproved === undefined;
  const erc721Abi = useMemo(() => {
    if (!signerOrProvider || !tokenAddress) return null;
    return Erc721__factory.connect(tokenAddress, signerOrProvider);
  }, [signerOrProvider, tokenAddress]);

  // 授权
  const approveState = useTransaction(erc721Abi?.approve, {
    wait: true,
    args: [approveTokenAddress, tokenId],
  });

  const handleGetApproved = async () => {
    try {
      const res = await erc721Abi?.getApproved(tokenId as string);
      setIsApproved(res === approveTokenAddress);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!address || !approveTokenAddress) return;
    handleGetApproved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, erc721Abi, approveTokenAddress, approveState.result]);

  return {
    approveState,
    isApproved,
    isLoading,
  };
}
export default Index;
