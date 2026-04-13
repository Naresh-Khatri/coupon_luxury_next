"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BlogsTable from "@/components/BlogPanel/BlogsTable";
import account from "@/appwrite/config";

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const user = await account.get();
        if (!user.$id) return;
        const { data } = await axios.get(
          "https://apiv2.couponluxury.com/blogs"
        );
        setBlogs(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="flex h-full w-full">
      <div className="mx-auto w-full max-w-[80rem] bg-white/30">
        <BlogsTable blogs={blogs} />
      </div>
    </div>
  );
}
