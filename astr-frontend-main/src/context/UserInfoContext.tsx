import { createContext, useContext, useState } from "react";
import { useConfigContext } from "./ConfigContext";
import { getUserInfo, userMessage } from "@/apis/v2";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export type IUserInfoContext = Partial<ReturnType<typeof useUserInfos>>;
export const UserInfosContext = createContext<IUserInfoContext>({});

export const useUserInfos = () => {
  const { address } = useAccount();
  const userInfoMutate = useMutation({
    mutationFn: async () => {
      console.log("11", 111);
      const res = await handleSignUserInfo();
      console.log("res", res);
      return res;
    },
    cacheTime: 0,
    mutationKey: ["userInfoMutate"],
  });
  const handleSignUserInfo = async () => {
    try {
      if (!address) return null;
      const ethereum = (window as any).ethereum;
      await ethereum.enable();
      const sign = await ethereum.request({
        method: "personal_sign",
        params: [userMessage, address],
      });
      const res = await getUserInfo({ address, sign, message: userMessage });
      console.log("res", res);

      return res?.data;
    } catch (error) {
      return null;
    }
  };
  console.log("userInfoMutate", userInfoMutate);
  return {
    data: userInfoMutate.data,
    isLoading: userInfoMutate.isLoading,
    handleSignUserInfo: userInfoMutate.mutateAsync,
  };
};

export const UserInfosProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const UserInfos = useUserInfos();
  return (
    <UserInfosContext.Provider value={UserInfos}>
      {children}
    </UserInfosContext.Provider>
  );
};

export const useUserInfosContext = () => {
  const values = useContext(UserInfosContext);
  return values;
};
