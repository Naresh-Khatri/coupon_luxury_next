import account from "../../../appwrite/config";
import {
  Box,
  Button,
  Container,
  Flex,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import LeftForm from "../../../components/BlogPanel/LeftForm";
import ImageCropper from "../../../components/BlogPanel/ImageCropper";
import CustomEditor from "../../../components/CustomEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { convertCanvasToBlob } from "../../../lib/lib";
import axios from "axios";

function Create() {
  const router = useRouter();
  const toast = useToast();

  const [userInfo, setUserInfo] = useState({});
  const [userIsLoading, setUserIsLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaSchema, setMetaSchema] = useState("");
  const [isPublising, setIsPublishing] = useState(false);

  const tinymceEditorRef = useRef(null);

  const cropperRef1 = useRef(null);
  const cropperRef2 = useRef(null);
  const [coverImg, setCoverImg] = useState(null);

  useEffect(() => {
    setUserIsLoading(true);
    account
      .get()
      .then((res) => {
        setUserInfo(res);
        console.log(res);
        setUserIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setUserInfo({});
        setUserIsLoading(false);
      });
  }, [router, toast]);

  const onFileDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImg(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    const titleIsValid = title.trim().length >= 10;
    const slugIsValid = slug.trim().length >= 10;
    const imageAltIsValid =
      imageAlt.trim().length >= 5 && imageAlt.length <= 40;
    const contentIsValid =
      tinymceEditorRef.current.getContent().trim().length >= 20;
    const coverImgIsValid = coverImg !== null;
    const metaTitleIsValid =
      metaTitle.trim().length >= 30 && metaTitle.trim().length <= 70;
    const metaDescriptionIsValid =
      metaDescription.trim().length >= 50 &&
      metaDescription.trim().length <= 160;
    const metaSchemaIsValid = metaSchema.length > 30;
    const formIsValid =
      titleIsValid &&
      slugIsValid &&
      imageAltIsValid &&
      contentIsValid &&
      coverImgIsValid &&
      metaTitleIsValid &&
      metaDescriptionIsValid &&
      metaSchemaIsValid;
    if (!formIsValid) {
      toast({
        title: `${
          !titleIsValid
            ? "Title"
            : !slugIsValid
            ? "Slug"
            : !imageAltIsValid
            ? "Image Alt"
            : !contentIsValid
            ? "Content"
            : !coverImgIsValid
            ? "Cover Image"
            : !metaTitleIsValid
            ? "Meta Title"
            : !metaDescriptionIsValid
            ? "Meta Description"
            : !metaSchemaIsValid
            ? "Meta Schema"
            : ""
        } is not valid`,
        description: "Please check the form",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsPublishing(false);
      return;
    }

    const coverImgCropped = await convertCanvasToBlob(
      cropperRef1.current.getCanvas()
    );
    const thumnailImgCropped = await convertCanvasToBlob(
      cropperRef2.current.getCanvas()
    );
    const { jwt } = await account.createJWT("current");
    const formData = new FormData();

    formData.append("coverImg", coverImgCropped);
    formData.append("thumbnailImg", thumnailImgCropped);
    formData.append("title", title);
    formData.append("smallDescription", metaDescription);
    formData.append("fullDescription", tinymceEditorRef.current.getContent());
    formData.append("slug", slug);
    formData.append("imgAlt", imageAlt);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("metaSchema", metaSchema);
    try {
      const res = await axios.post(
        "https://apiv2.couponluxury.com/blogs/v2",
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setIsPublishing(false);
      toast({
        title: "Success",
        description: "Your post has been published",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/blogs/" + res.data.slug);
      await account.deleteSession("current");
      console.log(res);
    } catch (err) {
      setIsPublishing(false);
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.log(err);
    }
  };

  if (userIsLoading) return <div>Loading...</div>;
  return (
    <Flex direction={"column"}>
      <SimpleGrid columns={2} spacing={10}>
        <Box>
          <LeftForm
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            imageAlt={imageAlt}
            setImageAlt={setImageAlt}
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            metaSchema={metaSchema}
            setMetaSchema={setMetaSchema}
          />
        </Box>
        <Box p={5}>
          <ImageCropper
            coverImg={coverImg}
            setCoverImg={setCoverImg}
            coverImgRef={cropperRef1}
            thumbnailImgRef={cropperRef2}
            onFileDrop={onFileDrop}
          />
        </Box>
      </SimpleGrid>
      <Box p={2}>
        <CustomEditor editorRef={tinymceEditorRef} />
      </Box>
      <Flex justifyContent={"end"}>
        <Button colorScheme="red" disabled size="lg" m={5}>
          Cancel
        </Button>
        <Button
          leftIcon={<FontAwesomeIcon icon={faNewspaper} />}
          colorScheme="teal"
          size="lg"
          m={5}
          onClick={handlePublish}
          isLoading={isPublising}
        >
          Publish
        </Button>
      </Flex>
    </Flex>
  );
}

export default Create;
