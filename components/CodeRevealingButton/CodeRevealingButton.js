import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useClipboard,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import styles from "./CodeRevealingButton.module.css";

function CodeRevealingButton({ code, affURL, storeName, image }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const truncateCode = "***" + code ? code.slice(-4) : "";

  const { hasCopied, onCopy } = useClipboard();
  const toast = useToast();

  const handleOnCopyClick = () => {
    onCopy(code);
    toast({
      title: "Copied",
      description: `Opening ${storeName} in new tab...`,
      status: "success",
      duration: 3000,
      position: "top",
      isClosable: true,
    });
    setTimeout(() => {
      console.log(affURL)
      window.open(affURL, "_blank");
    }, 1500);
  };
  return (
    <>
      <button className={styles.btn} onClick={onOpen}>
        {truncateCode}
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="auto" backdropBlur="3px" />
        <ModalContent>
          {/* <ModalHeader>Modal Title</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"} justify="center" alignItems="center">
              <Image
                src={image}
                alt={`${storeName} logo`}
                width={200}
                height={100}
              />
              <Text mt={5} my={3}>
                Copy and paste this code at {storeName}
              </Text>
              <Tooltip label="Click to copy!" aria-label="A tooltip">
                <Button
                  minW={200}
                  h={50}
                  border={"2px dashed #999"}
                  color={"brand.900"}
                  leftIcon={<FontAwesomeIcon size="xl" icon={faClipboard} />}
                  onClick={handleOnCopyClick}
                >
                  {hasCopied ? "COPIED" : code}
                </Button>
              </Tooltip>
              <Text>Click to copy!</Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CodeRevealingButton;
