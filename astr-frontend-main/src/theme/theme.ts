import { extendTheme } from "@chakra-ui/react";
import components from "./components";
import { styles } from "./style";
const themeConfig = {
  colors: {
    black: {
      "600": "rgba(24, 23, 39, 0.7)",
      "500": "#000000",
      "100": "#000000",
      "70": "rgba(24, 23, 39, 0.7)",
      "60": "rgba(0, 0, 0, 0.6)",
      "30": "rgba(0, 0, 0, 0.3)",
      "40": "rgba(0, 0, 0, 0.4)",
      "20": "rgba(0,0,0,0.2)",
      "8": "rgba(183, 183, 183, 0.08)",
      "3": "rgba(0,0,0,0.03)",
    },
    white: {
      "100": "#ffffff",
      "70": "rgba(255, 255, 255, 0.7)",
      "60": "rgba(255, 255, 255, 0.6)",
      "30": "rgba(255, 255, 255, 0.3)",
      "40": "rgba(255, 255, 255, 0.4)",
      "20": "rgba(255, 255, 255, 0.2)",
      "10": "rgba(255, 255, 255, 0.1)",
      "3": "rgba(255, 255, 255, 0.03)",
    },
    blue: {
      "40": "rgba(187, 223, 241, 0.4)",
      "500": "#BBDFF1",
      "600": "rgba(54, 52, 88, 0.7)",
      "700": "#2A2941",
    },
    gold: {
      "100": "rgba(24, 23, 39, 0.7)",
      "200": "#A98849",
      "500": "linear-gradient(180deg, #BBDFF1 0%, #C4A9F3 100%)",
      "600": "linear-gradient(180deg, #BBDFF1 20%, #C4A9F3 80%)",
    },
    gray: {
      // '100': '#181727',
      "500": "rgba(255, 255, 255, 0.6)",
      "600": "rgba(255, 255, 255, 0.42)",
    },
    purple: {
      "30": "rgba(196, 169, 243, 0.3)",
      "60": "rgba(196, 169, 243, 0.6)",
      "100": "#C4A9F3",
      "200": "#542266",
      "600": "rgba(84, 34, 102, 0.7)",
    },
    red: {
      "200": "#FF6291",
    },
  },
  breakpoints: {
    sm: "320px",
    md: "768px",
    lg: "960px",
    xl: "1440px",
    "2xl": "1536px",
  },
  components: components,
  styles: styles,
  textStyle: {
    text: {
      fontSize: "16px",
      fontWeight: "400",
      lineHeight: "22px",
    },
    normal: {
      // you can also use responsive styles
      fontSize: "18px",
      fontWeight: "700",
      lineHeight: "24px",
    },
  },
};

// const config = {};

export const theme = extendTheme(themeConfig);
