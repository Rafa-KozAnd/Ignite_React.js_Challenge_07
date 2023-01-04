import {
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent
        bgColor="pGray.800"
        borderRadius={6}
        overflow="hidden"
        w="max"
        maxW={900}
      >
        <ModalBody p={0}>
          <Image
            src={imgUrl}
            w="100%"
            maxW={900}
            maxH={600}
            objectFit="contain"
          />
        </ModalBody>

        <ModalFooter bgColor="pGray.800" p={2} justifyContent="start">
          <Link fontSize={14} color="gray.50" target="_blank" href={imgUrl}>
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}