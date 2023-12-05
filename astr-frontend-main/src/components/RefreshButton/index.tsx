import { Dispatch, useState } from "react";
import BaseButton from "../BaseButton";

import px2vw from "@/theme/utils/px2vw";
import { Spinner } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

export interface IProps {
  isRefreshed: boolean;

  onClick: () => void;
  setIsRefreshed?: Dispatch<React.SetStateAction<boolean>>;
}

export default function Index({ isRefreshed, onClick }: IProps) {
  return (
    <BaseButton
      zIndex={999}
      pos="fixed"
      right="3%"
      bottom="5%"
      borderRadius="50%"
      opacity="0.8"
      p="0"
      display={{ base: "flex", lg: "none" }}
      w={px2vw(40)}
      h={px2vw(40)}
      onClick={() => {
        onClick();
      }}
    >
      {isRefreshed ? <Spinner /> : <RepeatIcon />}
    </BaseButton>
  );
}
