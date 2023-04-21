import { SkipNavLink, Box } from "@chakra-ui/react";
import React from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import { useRouter } from "next/router";
import NormalLayout from "./NormalLayout";
import AdminLayout from "./AdminLayout";
const layoutHiddenRoutes = ["/blogs/admin"];

function Layout({ children }) {
  const router = useRouter();

  return (
    <>
      <LoadingOverlay>
        {layoutHiddenRoutes.some((route) => router.pathname.includes(route)) ? (
          <AdminLayout>{children}</AdminLayout>
        ) : (
          <NormalLayout>{children}</NormalLayout>
        )}
      </LoadingOverlay>
    </>
  );
}

export default Layout;
