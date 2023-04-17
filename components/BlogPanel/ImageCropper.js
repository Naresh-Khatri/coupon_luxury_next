import { Box, IconButton, Stack, Text } from "@chakra-ui/react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "react-advanced-cropper/dist/style.css";
import { Cropper, createAspectRatio } from "react-advanced-cropper";
import ImageDropZone from "./ImageDropZone";

function ImageCropper({
  coverImg,
  setCoverImg,
  coverImgRef,
  thumbnailImgRef,
  onFileDrop,
}) {
  if (coverImg)
    return (
      <Stack position={"relative"}>
        <Box>
          <Text>Cover Image</Text>
          <Cropper
            ref={coverImgRef}
            src={coverImg}
            className={"cropper"}
            aspectRatio={createAspectRatio(16 / 10)}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
        <Box>
          <Text>Thumbnail Image</Text>
          <Cropper
            ref={thumbnailImgRef}
            src={coverImg}
            className={"cropper"}
            aspectRatio={createAspectRatio(1 / 1)}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
        <IconButton
          aria-label="Delete"
          position={"absolute"}
          zIndex={1}
          top={-5}
          right={-5}
          icon={<FontAwesomeIcon icon={faTrash} />}
          colorScheme="red"
          color="white"
          onClick={() => setCoverImg(null)}
        />
      </Stack>
    );
  else return <ImageDropZone onFileDrop={onFileDrop} />;
}

export default ImageCropper;
