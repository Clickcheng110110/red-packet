import {
  ModalBody,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Image,
  ModalContentProps,
  ModalBodyProps,
  Box,
} from "@chakra-ui/react";
import React, { cloneElement } from "react";

import px2vw from "@/theme/utils/px2vw";
import { buttonHover } from "@/theme/utils/style";

import close from "@/assets/images/close.svg";
import { cinzel } from "@/pages/_app";

// import { buttonHover } from '@/theme/utils';
export interface IModalProps extends ModalProps {
  hasBg?: boolean; //是否有背景
  hasCloseButton?: boolean; //是否有叉叉的关闭按钮
  hasTopRightCloseButton?: boolean; //是否有右上方的关闭按钮
  hasBottomRightCloseButton?: boolean; //是否有下方的关闭按钮
  hasGradientBorder?: boolean; //是否渐变边框
  footerRender?: () => React.ReactNode;
  width?: number; //最小宽度
  padding?: number; //内边剧
  modalBodyProps?: ModalBodyProps;
  modalContentProps?: ModalContentProps;
  bg?: string; // 背景色
  data?: any;
  onCloseButtonClick?: () => void;
  children: any;

  // | React.ReactNode
  // | ReactElement<any, string | JSXElementConstructor<any>>
  // | ((props: {
  //     isOpen: boolean
  //     onClose: () => void
  //     data?: any
  //   }) => ReactElement<any, string | JSXElementConstructor<any>>)
}

function Index({
  isOpen,
  data,
  isCentered = true,
  children,
  width = 340,
  padding = 20,
  bg = "",
  hasTopRightCloseButton = true,
  hasBottomRightCloseButton = false,
  hasGradientBorder = false,
  onClose,
  modalContentProps,
  modalBodyProps,
  ...otherModalProps
}: IModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={isCentered}
      {...otherModalProps}
    >
      <ModalOverlay />
      <ModalContent
        zIndex={9999}
        position="relative"
        className={cinzel.className}
        // 下面这一行在生产环境会导致modal 没垂直居中， 在顶上显示， 但是在开发环境没问题
        // 先注释掉
        // marginTop={{ base: 'inherit', lg: 'inherit', xl: 'inherit' }}
        background={bg || "linear-gradient(180deg, #313F46 0%, #3D354A 100%)"}
        borderRadius="20px"
        // boxShadow="0px 4px 20px rgba(6, 16, 43, 0.65)"
        w={{ base: "92vw", lg: width }}
        maxW="initial"
        maxH="100vh"
        {...modalContentProps}
      >
        <ModalBody
          minHeight={{ base: px2vw(200), lg: "200px" }}
          padding={{ base: px2vw(padding), lg: `${padding}px` }}
          {...modalBodyProps}
        >
          {typeof children === "function"
            ? children({
                isOpen,
                onClose,
                data,
              })
            : children
            ? React.Children.map(children, (child) =>
                child
                  ? cloneElement(child, {
                      isOpen,
                      onClose,
                      data,
                    })
                  : child
              )
            : children}
        </ModalBody>
        {hasTopRightCloseButton && (
          <Image
            position="absolute"
            width={{ base: px2vw(40), lg: "40px" }}
            height={{ base: px2vw(40), lg: "40px" }}
            top={{ base: px2vw(16), lg: "26px" }}
            right={{ base: px2vw(20), lg: "26px" }}
            src={close}
            ignoreFallback
            _hover={buttonHover}
            onClick={onClose}
            alt=""
          />
        )}
        {hasBottomRightCloseButton && (
          <Image
            margin="0 auto"
            width={{ base: px2vw(40), lg: "40px" }}
            height={{ base: px2vw(40), lg: "40px" }}
            marginBottom="10px"
            src={close}
            ignoreFallback
            _hover={buttonHover}
            onClick={onClose}
            alt=""
          />
        )}
        {hasGradientBorder && (
          <Box
            pos="absolute"
            top={0}
            left={0}
            opacity={0.5}
            zIndex={-1}
            w="full"
            h="full"
            borderRadius={{ base: px2vw(10), lg: "20px" }}
            __css={{
              border: "2px solid transparent",
              bgClip: "padding-box, border-box",
              backgroundOrigin: "padding-box, border-box",
              bgImage:
                "linear-gradient(to right, #181727, #181727), linear-gradient(270deg, #AB8D60 0%, #B29466 7%, #DBC087 51%, #AB8D60 100%)",
            }}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
export default Index;
