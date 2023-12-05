import React from 'react';
import { Stack, StackProps } from '@chakra-ui/react';
import Text from '@/components/Text';
import px2vw from '@/theme/utils/px2vw';

export interface IProps extends StackProps {
  label: string;
  value: string;
}
function Index({ label, value, ...otherProps }: IProps) {
  return (
    <Stack
      direction="row"
      spacing="20px"
      justifyContent="center"
      alignItems="center"
      {...otherProps}
    >
      <Text
        type="gradient"
        fontSize={{ base: px2vw(18), md: '24px' }}
        fontWeight="400"
        fontFamily="PingFang SC"
      >
        {label}
      </Text>
      <Text
        fontSize={{ base: px2vw(18), md: '24px' }}
        fontWeight="600"
        fontFamily="PingFang SC"
      >
        {value}
      </Text>
    </Stack>
  );
}
export default Index;
