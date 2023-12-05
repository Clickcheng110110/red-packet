import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';

import Modal, { IModalProps } from '@/components/Modal';

export interface IModalContentProps<T = any> {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  data?: T;
}

function useModal<T = any>(
  modalContent: any,
  opts: Partial<IModalProps> = {}
): [
  any,
  {
    isOpen: boolean;
    onOpen: (res?: T) => void;
    onClose: () => void;
  }
] {
  const { isOpen, onOpen: modalOnOpen, onClose } = useDisclosure();
  const [data, setData] = useState<T>();

  const onOpen = (res?: T) => {
    res && setData(res);
    modalOnOpen();
  };
  const ThisModal = isOpen ? (
    <Modal data={opts.data || data} isOpen={isOpen} onClose={onClose} {...opts}>
      {modalContent}
    </Modal>
  ) : (
    <></>
  );

  return [
    ThisModal,
    {
      isOpen,
      onOpen,
      onClose,
    },
  ];
}
export default useModal;
