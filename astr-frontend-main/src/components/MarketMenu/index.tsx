import px2vw from "@/theme/utils/px2vw";
import {
  Text,
  Image,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import arrows from "@/assets/images/arrows.png";
import close from "@/assets/images/close.svg";

export interface OptionItem {
  id: number;
  text: string;
  icon: string;
}

interface IProps {
  options: OptionItem[];
  valChange: (val: OptionItem) => void;
}

function Index({ valChange, options }: IProps) {
  const [activeOption, setActiveOption] = useState<OptionItem>(options[0]);
  useEffect(() => {
    valChange(activeOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOption]);
  return (
    <Flex
      w={{ base: px2vw(46), lg: "167px" }}
      h={{ base: px2vw(36), lg: "36px" }}
      borderRadius={{ base: px2vw(12), lg: "12px" }}
      bgColor="blue.500"
      zIndex="12"
    >
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton w="full">
              <Flex
                w="full"
                alignItems="center"
                justifyContent={{ base: "center", lg: "flex-start" }}
                pl={{ base: 0, lg: "17px" }}
              >
                <Image
                  src={activeOption.icon}
                  display={{ base: isOpen ? "none" : "block", lg: "block" }}
                  w={{ base: px2vw(16), lg: "16px" }}
                  h={{ base: px2vw(16), lg: "16px" }}
                  mr={{ base: 0, lg: "5px" }}
                />
                <Text
                  fontFamily="PingFang SC"
                  display={{ base: "none", lg: "block" }}
                  fontSize={{ base: px2vw(14), lg: "14px" }}
                  lineHeight={{ base: px2vw(20), lg: "20px" }}
                >
                  {
                    options.filter((item) => item?.id === activeOption?.id)[0]
                      ?.text
                  }
                </Text>
                <Image
                  src={arrows}
                  display={{ base: "none", lg: "block" }}
                  w={{ base: px2vw(14), lg: "14px" }}
                  h={{ base: px2vw(10), lg: "10px" }}
                  ml={{ base: px2vw(15), lg: "15px" }}
                  transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                />
                <Image
                  src={close}
                  display={{ base: isOpen ? "block" : "none", lg: "none" }}
                  w={px2vw(30)}
                  h={px2vw(30)}
                />
              </Flex>
            </MenuButton>
            <MenuList
              bgColor="blue.500"
              border="none"
              zIndex="9"
              __css={{
                w: { base: px2vw(167), lg: "167px" },
                borderRadius: { base: px2vw(12), lg: "12px" },
                overflow: "hidden",
              }}
            >
              {options.map((item: OptionItem, index: number) => {
                return (
                  <MenuItem
                    bgColor={
                      item.id === activeOption.id ? "black.20" : "blue.500"
                    }
                    key={index}
                    w={{ base: px2vw(167), lg: "167px" }}
                    pl={{ base: px2vw(17), lg: "17px" }}
                    onClick={() => setActiveOption(item)}
                  >
                    <Flex alignItems="center">
                      <Image
                        src={item.icon}
                        w={{ base: px2vw(16), lg: "16px" }}
                        h={{ base: px2vw(16), lg: "16px" }}
                        mr={{ base: px2vw(5), lg: "5px" }}
                      />
                      <Text
                        fontFamily="PingFang SC"
                        fontSize={{ base: px2vw(14), lg: "14px" }}
                        lineHeight={{ base: px2vw(20), lg: "20px" }}
                      >
                        {item.text}
                      </Text>
                    </Flex>
                  </MenuItem>
                );
              })}
            </MenuList>
          </>
        )}
      </Menu>
    </Flex>
  );
}
export default Index;
