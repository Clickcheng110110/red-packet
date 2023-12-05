import React from "react";
import { checkText } from "@/utils/common";
import { Input, InputProps } from "@chakra-ui/react";

export interface IProps extends InputProps {
  valChange?: (val: string) => void;
  decimal?: number;
}

function Index({ value, valChange, decimal = 18, ...props }: IProps) {
  return (
    <Input
      variant="unstyled"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        valChange && valChange(checkText(e.target.value, decimal) as string);
      }}
      {...props}
    />
  );
}

export default React.memo(Index);
