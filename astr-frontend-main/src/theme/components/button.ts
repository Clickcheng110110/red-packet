import { ComponentStyleConfig } from "@chakra-ui/react";

export default <ComponentStyleConfig>{
  baseStyle: {
    _focus: { boxShadow: "none" },
    _disabled: {
      background: "gray.100",
    },
    _hover: {
      background: "blue.700 !important",
    },
  },
};
