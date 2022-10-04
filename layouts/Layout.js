import { Box } from "@chakra-ui/react";
import React from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function Layout({ children }) {
  return (
    <>
      <NavBar />
      <Box as="main">{children}</Box>
      <Footer />
    </>
  );
}

export default Layout;
