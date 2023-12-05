import px2vw from "@/theme/utils/px2vw";
import { Flex, TextProps, Text, FlexProps } from "@chakra-ui/react";
import React, { Component } from "react";
import FetchTemplate from "../FetchTemplate";

export interface Column extends TextProps {
  dataIndex: string;
  title: string;
  dataColumnProps?: TextProps;
  render?: (record: any) => React.ReactNode;
}

export interface TableProps {
  data: any;
  columns: Column[];
  containerProps?: FlexProps;
  headerProps?: FlexProps;
}

function Index({ data, columns, headerProps, containerProps }: TableProps) {
  return (
    <Flex flexDirection="column" width="100%" {...containerProps}>
      <Flex
        width="100%"
        py={px2vw(12)}
        fontSize="14px"
        color="blue.500"
        borderBottom="1px solid"
        borderBottomColor="blue.500"
        justifyContent={"space-between"}
        {...headerProps}
      >
        {/* Header */}
        {columns.map(({ title, ...textProps }) => (
          <Text flexShrink={0} key={title} {...textProps}>
            {title}
          </Text>
        ))}
      </Flex>
      {/* Body */}

      {(data || []).map((item: any, index: number) => {
        return (
          <Flex
            flexShrink={0}
            key={index}
            width="100%"
            py={px2vw(12)}
            fontSize="14px"
            color="white.100"
            alignItems="center"
            borderBottom="1px dashed"
            borderBottomColor="blue.40"
          >
            {columns.map(
              (
                { dataIndex, width, render, dataColumnProps, ...textProps },
                index
              ) =>
                render ? (
                  render(item)
                ) : (
                  <Text
                    flexShrink={0}
                    fontSize="12px"
                    key={index}
                    width={width}
                    {...dataColumnProps}
                  >
                    {item[dataIndex]}
                  </Text>
                )
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}

export default Index;
