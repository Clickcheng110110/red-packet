//标准的select组件

import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Image,
  FlexProps,
  useOutsideClick,
} from "@chakra-ui/react";
import px2vw from "@/theme/utils/px2vw";
// import { useToggle } from 'react-use'

// import px2vw from "@/utils/px2vw";

// import triangleIc from "@/assets/svgs/triangle.svg";
import { useToggle } from "usehooks-ts";

import triangleIc from "@/assets/images/blueArrow.svg";

export interface ISelectItem {
  value: any;
  name: string;
  icon?: string;
  notShow?: boolean;
  desc?: string;
  [key: string]: any;
}

interface IProps extends FlexProps {
  options: ISelectItem[];
  onSelectChange?: (val: ISelectItem) => void;
  defaultValue?: string;
  isDefaultFirst?: boolean;
  lineHeight?: number;
  selectLineStyle?: any;
  pannelStyle?: any;
  pannelItemStyle?: any;
  showArrow?: boolean;
  arrowStyle?: any;
}

const itemStyle = {
  padding: {
    base: `${px2vw(10)} ${px2vw(10)} `,
    lg: "10px 20px",
  },
  height: { base: px2vw(40), lg: `40px` },
  width: { base: px2vw(129), lg: "129px" },
};

function Index({
  options,
  onSelectChange,
  defaultValue = "",
  isDefaultFirst = true,
  selectLineStyle,
  pannelStyle,
  pannelItemStyle,
  showArrow = true,
  arrowStyle,
  ...resp
}: IProps) {
  const [curIndex, setIndex] = useState<number | null>(0);

  const [isOpen, setIsOpen] = useState(false);
  const ref = React.useRef<any>();

  // useOutsideClick({
  //   ref: ref,
  //   handler: () => setIsOpen(false),
  // });
  useEffect(() => {
    if (defaultValue !== "") {
      setIndex(
        options?.findIndex((it: ISelectItem) => it?.value === defaultValue)
      );
    } else {
      setIndex(isDefaultFirst ? 0 : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);
  return (
    <Flex
      direction="column"
      bgColor={isOpen ? "black.100" : "black.30"}
      {...resp}
      textStyle="18"
      fontWeight="400"
      position="relative"
      borderTopLeftRadius="10px"
      borderTopRightRadius="10px"
      borderBottomLeftRadius={isOpen ? "0" : "10px"}
      borderBottomRightRadius={isOpen ? "0" : "10px"}
    >
      {/* selected line */}
      <Flex
        ref={ref}
        alignItems="center"
        onClick={() => {
          if (options.length <= 1) return;
          setIsOpen(!isOpen);
        }}
        cursor="pointer"
        justifyContent="flex-end"
        {...itemStyle}
        {...selectLineStyle}
      >
        <Flex alignItems="center">
          {curIndex !== null &&
          options[curIndex]?.icon &&
          !options[curIndex]?.notShow ? (
            <Image
              src={options[curIndex]?.icon}
              w={{ base: px2vw(20), lg: "20px" }}
              h={{ base: px2vw(20), lg: "20px" }}
              mr={{ base: px2vw(5), lg: "5px" }}
            />
          ) : null}
          {curIndex !== null ? (
            <Text whiteSpace="nowrap" color="blue.500">
              {!options[curIndex]?.notShow ? options[curIndex]?.name : ""}
            </Text>
          ) : (
            <Text color="white.70">{resp?.placeholder}</Text>
          )}
          {curIndex !== null && options[curIndex]?.desc ? (
            <Text
              ml={{ base: px2vw(10), lg: "10px" }}
              color="white.50"
              textStyle="13"
            >
              {options[curIndex]?.desc}
            </Text>
          ) : null}
        </Flex>

        {showArrow && (
          <Image
            marginLeft="10px"
            src={triangleIc}
            w={{ base: px2vw(10), lg: "8px" }}
            h={{ base: px2vw(6), lg: "6px" }}
            transform={`rotate(${isOpen ? 180 : 0}deg)`}
            {...arrowStyle}
          />
        )}
      </Flex>
      {/* seelect pannel */}
      <Flex
        zIndex={99}
        width="100%"
        direction="column"
        bgColor={isOpen ? "black.100" : "black.30"}
        display={isOpen ? "flex" : "none"}
        position="absolute"
        left="0"
        top={{ base: px2vw(40), lg: "40px" }}
        {...pannelStyle}
        overflow="hidden"
        borderBottomLeftRadius={!isOpen ? "0" : "10px"}
        borderBottomRightRadius={!isOpen ? "0" : "10px"}
      >
        {options
          .filter((_, index) => index !== curIndex)
          ?.map((item: ISelectItem) => (
            <Flex
              key={item?.name}
              alignItems="center"
              justifyContent="flex-end"
              onClick={() => {
                setIndex(
                  options?.findIndex(
                    (it: ISelectItem) => it?.value === item?.value
                  )
                );

                onSelectChange?.(item);
                setIsOpen(false);
              }}
              _hover={{ cursor: "pointer", bgColor: "blue.200" }}
              {...itemStyle}
              paddingRight={px2vw(20)}
              {...pannelItemStyle}
            >
              {item?.icon && (
                <Image
                  src={item?.icon}
                  w={{ base: px2vw(20), lg: "20px" }}
                  h={{ base: px2vw(20), lg: "20px" }}
                  mr={{ base: px2vw(5), lg: "5px" }}
                />
              )}
              <Text> {item?.name}</Text>
              <Text
                ml={{ base: px2vw(10), lg: "10px" }}
                color="white.50"
                textStyle="13"
              >
                {item?.desc}
              </Text>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
}
export default Index;
