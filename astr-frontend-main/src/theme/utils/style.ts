import { BoxProps, ButtonProps, UseToastOptions } from "@chakra-ui/react";

export const lgText = {
  textStyle: "64",
  color: "blue.100",
  fontWeight: "700",
};

export const mdText = {
  textStyle: "30",
  color: "blue.200",
  fontWeight: "700",
};
export const smText = {
  textStyle: "18",
  color: "blue.300",
  fontWeight: "500",
};

export const buttonHover = {
  opacity: 0.7,
  cursor: "pointer",
};

export const textNormalStyle = {
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "23px",
};
export const textTitleStyle = {
  fontSize: "48px",
  fontWeight: "700",
};
export const textSubTitleStyle = {
  fontSize: "40px",
  fontWeight: "700",
};
// 单行文本溢出
export const ellipsis: BoxProps = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

export const failedToastConfig: UseToastOptions = {
  status: "error",
  position: "top",
  duration: 5000,
  isClosable: true,
};

export const WarningToastConfig: UseToastOptions = {
  status: "warning",
  position: "top",
  duration: 5000,
  isClosable: true,
};

export const secondaryButtonConfig: ButtonProps = {
  backgroundColor: "transparent",
  border: "2px solid",
  borderColor: "yellow.100",
  color: "yellow.100",
  _hover: {
    backgroundColor: "transparent",
    ...buttonHover,
  },
};
