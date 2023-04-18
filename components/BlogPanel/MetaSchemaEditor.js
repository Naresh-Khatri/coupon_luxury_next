import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";

function MetaSchemaEditor({ metaSchema, setMetaSchema }) {
  return (
    <>
      <AceEditor
        mode="json"
        theme="dracula"
        value={metaSchema}
        fontSize={16}
        onChange={(val) => setMetaSchema(val)}
        name="meta_schema_editor"
      />
    </>
  );
}

export default MetaSchemaEditor;
