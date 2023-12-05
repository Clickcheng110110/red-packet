import { Flex, Image, Stack, Text, StackProps } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";

import close from "@/assets/images/close.svg";
import errorWarning from "@/assets/images/errorWarning.svg";

import { ToastContentProps, ToastOptions } from "react-toastify";
import px2vw from "@/theme/utils/px2vw";
import { buttonHover } from "@/theme/utils/style";
import { useInterval } from "usehooks-ts";

export type IType = "success" | "error";

export interface InfoBoxProps<T = any> extends Partial<ToastContentProps<T>> {
  data?: T;
  type?: IType;
}

export const toastOption: ToastOptions = {
  position: "top-right",
  autoClose: 100000000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const containerStyle = {
  // height: { base: px2vw(90), lg: '90px' },
  width: { base: px2vw(355), lg: "355px" },
  padding: { base: px2vw(20), lg: "20px" },
  justifyContent: "space-between",
  alignItems: "center",
  borderWidth: { base: px2vw(2), lg: "2px" },

  borderRadius: "custom2",
  backgroundColor: "black.200",
};

const leftContainerStyle: StackProps = {
  direction: "row",
  spacing: { base: px2vw(15), lg: "15px" },
  alignItems: "center",
};

const imageStyle = {
  height: { base: px2vw(24), lg: "24px" },
  width: { base: px2vw(24), lg: "24px" },
};

const descStyle = {
  maxWidth: { base: px2vw(230), lg: "230px" },
  textStyle: "14",
};

const closeButtonStyle = {
  height: { base: px2vw(40), lg: "40px" },
  width: { base: px2vw(40), lg: "40px" },
  ignoreFallback: true,
  _hover: buttonHover,
};

const ErrorContent = (props: InfoBoxProps) => {
  return (
    <Flex
      {...containerStyle}
      width={{ base: px2vw(335), md: "355px" }}
      bgColor="purple.200"
      borderRadius="16px"
      alignItems="center"
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.4)"
    >
      {/* left */}
      <Stack direction="row" {...leftContainerStyle}>
        <Image {...imageStyle} width="24px" src={errorWarning} alt="" />
        <Stack width="256px" spacing={{ base: px2vw(10), lg: "10px" }}>
          <Text
            fontSize="18px"
            fontWeight="700"
            lineHeight="18px"
            color="white.100"
            // {...titleStyle}
          >
            Error
          </Text>
          <Text
            fontSize="14px"
            lineHeight="14px"
            fontWeight="400"
            color="white.100"
            {...descStyle}
          >
            {props?.data}
          </Text>
        </Stack>
      </Stack>
      {/* right */}

      <Flex
        flexShrink={0}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          onClick={props.closeToast}
          {...closeButtonStyle}
          src={close}
          alt=""
        />
      </Flex>
    </Flex>
  );
};

function InfoBox({ type = "success", data, ...otherProps }: InfoBoxProps) {
  const [time, setTime] = useState<number>(
    otherProps.toastProps?.autoClose || 0
  );
  useInterval(
    () => {
      setTime(time - 1000);
    },
    time >= 0 ? 1000 : null
  );

  useEffect(() => {
    if (!time) otherProps.closeToast && otherProps.closeToast();
  }, [otherProps, time]);

  const WarpedComponent = useMemo(() => {
    switch (type) {
      case "error":
        return ErrorContent;

      //   case 'success':
      //     return SuccessContent;
      default:
        return ErrorContent;
    }
  }, [type]);

  return (
    <>
      {React.cloneElement(<WarpedComponent />, {
        data,
        time,
        ...otherProps,
      })}
    </>
  );
}
export default InfoBox;
