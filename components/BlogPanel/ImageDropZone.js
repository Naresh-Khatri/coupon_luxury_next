import { Flex, Stack, Text } from "@chakra-ui/react";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faDownLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDropzone } from "react-dropzone";

const ImageDropZone = ({ onFileDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFileDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        borderRadius={10}
        bg={"#fff"}
        border={`2px dashed ${isDragActive ? "lightgreen" : "gray"}`}
        h={635}
      >
        {!isDragActive ? (
          <Stack>
            <FontAwesomeIcon icon={faImage} bounce size="5x" />
            <Text color={"gray.400"}>Drop Cover photo here...</Text>
          </Stack>
        ) : (
          <Stack>
            <FontAwesomeIcon icon={faDownLong} color="green" bounce size="5x" />
            <Text color={"green.400"}>Drop it like it&apos;s hot!</Text>
          </Stack>
        )}
      </Flex>
    </div>
  );
};

export default ImageDropZone;
