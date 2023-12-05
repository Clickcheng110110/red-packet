import { Theme } from '@chakra-ui/react';


export const styles: Theme['styles'] = {
  global: (props) => {
    return {
      'html, body': {
        bgColor: props.theme.colors.black['500'],
        color: props.theme.colors.white['100'],
      },
      a: {
        color: props.colorMode === 'dark' ? 'white.100' : 'white.100',
      },
    };
  },
};
