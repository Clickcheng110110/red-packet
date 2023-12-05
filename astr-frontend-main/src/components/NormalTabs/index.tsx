import React from "react";
import {
  Tabs as ChakraUiTabs,
  TabList,
  Tab,
  TabIndicator,
  TabPanels,
  TabPanel,
  TabsProps,
  TabPanelsProps,
  TabProps,
  TabListProps,
} from "@chakra-ui/react";
import Text from "@/components/Text";
import px2vw from "@/theme/utils/px2vw";

export type IDataItem = {
  label: string;
  content: React.ReactNode;

  tabPanelProps?: TabPanelsProps;
};

export interface ITabsProps extends Omit<TabsProps, "children"> {
  data: IDataItem[];
  showTabIndicator?: boolean;
  tabProps?: TabProps;
  tabListProps?: TabListProps;
}

function NormalTabs({
  data,
  showTabIndicator = true,
  tabProps,
  tabListProps,
  ...otherProps
}: ITabsProps) {
  return (
    <ChakraUiTabs position="relative" variant="unstyled" {...otherProps}>
      <TabList
        borderBottom="1px solid"
        borderColor="white.20"
        fontSize="16px"
        color="purple.60"
        {...tabListProps}
      >
        {data.map((tab, index) => (
          <Tab
            key={index}
            paddingBottom="4px"
            _selected={{ color: "purple.100" }}
            {...tabProps}
          >
            {/* <Text bgGradient={tabGradient}> {tab.label}</Text> */}
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {showTabIndicator && (
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="purple.60"
          borderRadius="1px"
        />
      )}

      <TabPanels>
        {data.map((tab, index) => (
          <TabPanel
            p="40px 0"
            pb="0"
            key={index}
            {...(tab.tabPanelProps || {
              p: "40px 0",
            })}
          >
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </ChakraUiTabs>
  );
}

export default NormalTabs;
