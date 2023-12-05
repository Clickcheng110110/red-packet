import React from "react";
import { FlexProps, Spinner, SpinnerProps, Text } from "@chakra-ui/react";

export interface IListTemplateProps {
  children: React.ReactNode;
  spinnerProps?: SpinnerProps;
  empty: boolean;
  renderEmpty?: () => React.ReactNode;
  loading: boolean;
  containerProps?: FlexProps;
}
function Index({
  empty,
  spinnerProps,
  renderEmpty,
  children,
  loading,
}: IListTemplateProps) {
  return (
    <>
      {/* loading State */}
      {loading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="black.400"
          size="xl"
          {...spinnerProps}
        />
      ) : empty ? (
        renderEmpty ? (
          renderEmpty()
        ) : (
          <Text textStyle="24">No Data</Text>
        )
      ) : (
        children
      )}
    </>
  );
}
export default Index;
