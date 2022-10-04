import React from "react";

function NotFoundPage() {
  return <></>;
}
export const getStaticProps = async (ctx) => {
  return {
    redirect: {
      destination: "/not-found",
      permanent: false,
    },
  };
};
export default NotFoundPage;
