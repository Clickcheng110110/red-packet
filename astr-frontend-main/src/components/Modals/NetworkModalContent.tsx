import React, { useEffect, useState } from 'react';
import {
  Text,
  Flex,
  Img,
  Button,
  Stack,
  RadioGroup,
  Radio,
} from '@chakra-ui/react';
import px2vw from '@/theme/utils/px2vw';

import networkWarning from '@/assets/images/networkWarning.svg';
import { IModalContentProps } from '@/hooks/useModal';
import { useConfigContext } from '@/context/ConfigContext';
import { supportChains } from '@/pages/_app';
import { useTranslation } from 'next-i18next';
import { useSwitchNetwork } from 'wagmi';

function Index({ onClose }: IModalContentProps) {
  const { chain } = useConfigContext();
  const [selectChain, setSelectChain] = useState(String(chain?.id));
  const { isSuccess, isLoading, switchNetwork } = useSwitchNetwork();

  const { t } = useTranslation('common');

  const handleChangeNetwork = async () => {
    try {
      switchNetwork?.(Number(selectChain));
      onClose?.();
    } catch (error) {}
  };
  const renderNetworkItem = () => {
    return supportChains.map((item) => {
      return (
        <Radio
          key={item.id}
          value={String(item.id)}
          onChange={(e) => {
            setSelectChain(e.target.value);
          }}
        >
          {item.name}
        </Radio>
      );
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [isSuccess]);

  return (
    <Flex
      position="relative"
      height="315px"
      flexDirection="column"
      justify="center"
      alignItems="center"
      color="white.100"
    >
      <Text
        width={{ base: px2vw(226), md: '326px' }}
        fontSize="24px"
        lineHeight="24px"
        fontWeight="700"
        textAlign="center"
        color="gold.500"
      >
        {t('Wallet Network Configuration Error')}
      </Text>
      <Stack
        direction="row"
        spacing={{ base: px2vw(10), md: '10px' }}
        alignItems="center"
        marginTop={{ base: px2vw(40), md: '40px' }}
        marginBottom={{ base: px2vw(18), md: '18px' }}
        fontFamily="PingFang SC"
      >
        <Img width="24px" height="24px" src={networkWarning} />
        <Text fontSize="18px" lineHeight="18px" fontWeight="500">
          {t('pleaseSwitchTo')}
        </Text>
      </Stack>

      <RadioGroup colorScheme="purple" marginBottom="40px" value={selectChain}>
        <Stack fontFamily="PingFang SC">{renderNetworkItem()}</Stack>
      </RadioGroup>

      <Button
        colorScheme="gold"
        isLoading={isLoading}
        onClick={handleChangeNetwork}
        width="311px"
        height="46px"
        fontSize="20px"
        lineHeight="20px"
        fontWeight="700"
      >
        {t('Confirm')}
      </Button>
    </Flex>
  );
}
export default Index;
