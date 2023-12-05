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
} from "@chakra-ui/react";
import px2vw from "@/theme/utils/px2vw";

export type IDataItem = {
  label: string;
  content: React.ReactNode;
  tabPanelProps?: TabPanelsProps;
};

export interface ITabsProps extends Omit<TabsProps, "children"> {
  data: IDataItem[];
}

function Tabs({ data, ...otherProps }: ITabsProps) {
  return (
    <ChakraUiTabs position="relative" variant="unstyled" {...otherProps}>
      <TabList fontSize="16px" color="white.60" justifyContent="space-between">
        {data.map((tab, index) => (
          <Tab
            padding={`${px2vw(5)} ${px2vw(20)}`}
            borderRadius={px2vw(18)}
            key={index}
            color="white.100"
            bg="black.100"
            border="1px solid"
            borderColor="blue.500"
            _selected={{ color: "black", bg: "gold.500" }}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {data.map((tab, index) => (
          <TabPanel
            p="20px 0"
            key={index}
            {...(tab.tabPanelProps || {
              p: "20px 0",
            })}
          >
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </ChakraUiTabs>
  );
}

export default Tabs;
