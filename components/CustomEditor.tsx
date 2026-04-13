"use client";

import type { MutableRefObject } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function CustomEditor({
  editorRef,
}: {
  editorRef: MutableRefObject<any>;
}) {
  return (
    <div className="py-3">
      <p>Content: </p>
      <div className="rounded-xl shadow-md">
        <Editor
          apiKey="j3b4s2ajya2zgs4whxrd52dy6239k4mblodx2wn6j8vr6ptv"
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue="<p>This is the initial content of the editor.</p>"
          init={{
            statusbar: false,
            plugins:
              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
          }}
        />
      </div>
    </div>
  );
}
