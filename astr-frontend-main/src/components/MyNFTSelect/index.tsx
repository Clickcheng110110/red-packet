//标准的select组件

import React, { useState, useEffect } from "react";
import { Flex, Text, Image, FlexProps } from "@chakra-ui/react";
import px2vw from "@/theme/utils/px2vw";
import filterIcon from "@/assets/images/filterIcon.svg";

import selectedPurple from "@/assets/images/selectedPurple.svg";

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
      textStyle="18"
      fontWeight="400"
      position="relative"
      borderTopLeftRadius="10px"
      borderTopRightRadius="10px"
      borderBottomLeftRadius={isOpen ? "0" : "10px"}
      borderBottomRightRadius={isOpen ? "0" : "10px"}
      {...resp}
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
        // {...itemStyle}
        {...selectLineStyle}
      >
        <Image width={px2vw(20)} height={px2vw(20)} src={filterIcon} />
      </Flex>
      {/* seelect pannel */}
      <Flex
        zIndex={99}
        width="100%"
        direction="column"
        bgColor={isOpen ? "black.100" : "black.30"}
        display={isOpen ? "flex" : "none"}
        position="absolute"
        left={{ base: px2vw(-100), lg: "40px" }}
        top={{ base: px2vw(50), lg: "40px" }}
        overflow="hidden"
        borderRadius="10px"
        {...pannelStyle}
      >
        {options?.map((item: ISelectItem) => (
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
            {curIndex ===
              options?.findIndex(
                (it: ISelectItem) => it?.value === item?.value
              ) && (
              <Image
                src={selectedPurple}
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
