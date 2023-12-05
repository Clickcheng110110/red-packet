import React from "react";
import { Text, TextProps } from "@chakra-ui/react";

export interface MyText extends TextProps {
  type?: "normal" | "gradient";
}

export const gradientStyle = {
  bgGradient: "linear-gradient(180deg, #BBDFF1 0%, #C4A9F3 100%)",
  bgClip: "text",
};

export const typeConfig = {
  normal: {},
  gradient: gradientStyle,
};

function Index({ type = "normal", ...otherProps }: MyText) {
  const config = typeConfig[type] || {};
  return <Text {...config} {...otherProps} />;
}
export default Index;
