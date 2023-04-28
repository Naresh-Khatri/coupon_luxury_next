import {
  // checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import RuledInput from "../RuledInput";
import { useEffect, useState } from "react";

// import dynamic from "next/dynamic";
// const MetaSchemaEditor = dynamic(import("./MetaSchemaEditor"), {
//   ssr: false,
// });

const LeftForm = ({
  title,
  setTitle,
  slug,
  setSlug,
  imageAlt,
  setImageAlt,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  // metaSchema,
  // setMetaSchema,
}) => {
  const [slugError, setSlugError] = useState("");
  // const [hasMetaSchema, setHasMetaSchema] = useState(false);
  const updateSlug = (value) => {
    // regex to match only alphanumeric and hyphen
    const regex = /[^a-z0-9-]+/gi;
    if (regex.test(value)) {
      setSlugError("Slug can only contain alphanumeric and hyphen");
      return;
    }
    setSlugError("");
    setSlug(value);
  };
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9-]+/gi, "-")
        .replace(/^-|-$/g, "");
      setSlug(slug);
    }
  }, [title, setSlug]);
  return (
    <Stack p={5} spacing={10}>
      <Stack spacing={3} bg={"#fff"} shadow={"md"} p={5} borderRadius={10}>
        <Text>Basic Info</Text>
        <FormControl isRequired>
          <FormLabel>Blog Title</FormLabel>
          <Input
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired isInvalid={slugError}>
          <FormLabel>Blog Slug</FormLabel>
          <Input
            placeholder="Enter Slug"
            value={slug}
            onChange={(e) => updateSlug(e.target.value)}
          />
          {slugError ? (
            <FormErrorMessage>{slugError}</FormErrorMessage>
          ) : (
            <FormHelperText>/blogs/{slug}</FormHelperText>
          )}
        </FormControl>
        <RuledInput
          value={imageAlt}
          setValue={setImageAlt}
          rule={{ min: 5, max: 40 }}
          hintText={"Should be in the range 5 to 40"}
          placeholder={"Enter Image Alt"}
          title={"Image Alt"}
        />
      </Stack>
      <Stack spacing={5} bg={"#fff"} shadow={"md"} p={5} borderRadius={10}>
        <Text>For SEO</Text>
        <RuledInput
          value={metaTitle}
          setValue={setMetaTitle}
          rule={{ min: 30, max: 70 }}
          hintText={"Should be in the range 30 to 70"}
          placeholder={"Enter Meta Title"}
          title={"Meta Title"}
        />
        <RuledInput
          value={metaDescription}
          setValue={setMetaDescription}
          rule={{ min: 50, max: 160 }}
          hintText={"Should be in the range 50 to 160"}
          placeholder={"Enter Meta Description"}
          title={"Meta Description"}
        />
        {/* <Checkbox
          checked={true}
          onChange={(e) => {
            setHasMetaSchema(e.target.checked);
          }}
        >
          <Text fontWeight={"semibold"}>Meta Schema</Text>
        </Checkbox>
        {hasMetaSchema && (
          <MetaSchemaEditor
            metaSchema={metaSchema}
            setMetaSchema={setMetaSchema}
          />
        )} */}
      </Stack>
    </Stack>
  );
};
export default LeftForm;
