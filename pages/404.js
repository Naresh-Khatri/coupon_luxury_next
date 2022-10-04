import { useRouter } from "next/router";
import { useEffect } from "react";

function NotFoundPage() {
  const router = useRouter();
  useEffect(() => {
    console.log("no from 404");
    router.push("/not-found");
  });
  return <></>;
}
export default NotFoundPage;
