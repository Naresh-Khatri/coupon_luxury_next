"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeftForm from "@/components/BlogPanel/LeftForm";
import ImageCropper from "@/components/BlogPanel/ImageCropper";
import account from "@/appwrite/config";
import { convertCanvasToBlob } from "@/lib/lib";

const CustomEditor = dynamic(() => import("@/components/CustomEditor"), {
  ssr: false,
  loading: () => <div className="p-4 text-sm">Loading editor...</div>,
});

export default function Create() {
  const router = useRouter();

  const [userIsLoading, setUserIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const tinymceEditorRef = useRef<any>(null);
  const cropperRef1 = useRef<any>(null);
  const cropperRef2 = useRef<any>(null);
  const [coverImg, setCoverImg] = useState<string | null>(null);

  useEffect(() => {
    account
      .get()
      .then(() => setUserIsLoading(false))
      .catch(() => setUserIsLoading(false));
  }, []);

  const onFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") setCoverImg(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    const content = tinymceEditorRef.current?.getContent() ?? "";
    const titleIsValid = title.trim().length >= 10;
    const slugIsValid = slug.trim().length >= 10;
    const imageAltIsValid =
      imageAlt.trim().length >= 5 && imageAlt.length <= 40;
    const contentIsValid = content.trim().length >= 20;
    const coverImgIsValid = coverImg !== null;
    const metaTitleIsValid =
      metaTitle.trim().length >= 30 && metaTitle.trim().length <= 70;
    const metaDescriptionIsValid =
      metaDescription.trim().length >= 50 &&
      metaDescription.trim().length <= 160;

    const formIsValid =
      titleIsValid &&
      slugIsValid &&
      imageAltIsValid &&
      contentIsValid &&
      coverImgIsValid &&
      metaTitleIsValid &&
      metaDescriptionIsValid;

    if (!formIsValid) {
      const field = !titleIsValid
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
        : "Meta Description";
      toast.error(`${field} is not valid`, {
        description: "Please check the form",
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
    const { jwt } = await account.createJWT();
    const formData = new FormData();
    if (coverImgCropped) formData.append("coverImg", coverImgCropped);
    if (thumnailImgCropped) formData.append("thumbnailImg", thumnailImgCropped);
    formData.append("title", title);
    formData.append("smallDescription", metaDescription);
    formData.append("fullDescription", content);
    formData.append("slug", slug);
    formData.append("imgAlt", imageAlt);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    try {
      const res = await axios.post(
        "https://apiv2.couponluxury.com/blogs/v2",
        formData,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setIsPublishing(false);
      toast.success("Success", {
        description: "Your post has been published",
      });
      router.push("/blogs/" + res.data.slug);
      await account.deleteSession("current");
    } catch (err: any) {
      setIsPublishing(false);
      toast.error("Error", {
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong",
      });
    }
  };

  if (userIsLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-10">
        <div>
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
          />
        </div>
        <div className="p-5">
          <ImageCropper
            coverImg={coverImg}
            setCoverImg={setCoverImg}
            coverImgRef={cropperRef1}
            thumbnailImgRef={cropperRef2}
            onFileDrop={onFileDrop}
          />
        </div>
      </div>
      <div className="p-2">
        <CustomEditor editorRef={tinymceEditorRef} />
      </div>
      <div className="flex justify-end">
        <Button variant="destructive" disabled size="lg" className="m-5">
          Cancel
        </Button>
        <Button
          size="lg"
          className="m-5 bg-teal text-white hover:bg-teal-dark"
          onClick={handlePublish}
          disabled={isPublishing}
        >
          <Newspaper className="size-4" />
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  );
}
