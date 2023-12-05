import { formatAddress } from "@/utils/common";
import { Flex, Stack } from "@chakra-ui/react";

import Text from "@/components/Text";
import px2vw from "@/theme/utils/px2vw";
import { MergeResultResponse } from "@/apis/v2";
import dayjs from "dayjs";

export interface IProps {
  data: MergeResultResponse & {
    value: string;
  };
}

function Index({ data }: IProps) {
  return (
    <Flex
      borderTop="2px dashed rgba(255,255,255,0.2)"
      py={px2vw(13)}
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Stack spacing={px2vw(6)}>
        <Text color="white.40" fontSize="14px">
          {formatAddress(data?.user)}
        </Text>
        <Text fontSize="14px">
          {dayjs(data?.blockTime).format("YYYY.MM.DD")}
        </Text>
      </Stack>
      <Text fontSize="14px">{data.value}</Text>
    </Flex>
  );
}

export default Index;
