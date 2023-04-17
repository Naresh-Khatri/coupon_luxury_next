import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Box, Text } from "@chakra-ui/react";

const CustomEditor = ({ editorRef }) => {
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <Box py={3}>
      <Text>Content: </Text>
      <Editor
        apiKey="j3b4s2ajya2zgs4whxrd52dy6239k4mblodx2wn6j8vr6ptv"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          selector: "textarea",
          statusbar: false,
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
        }}
      />
    </Box>
  );
};

export default CustomEditor;
