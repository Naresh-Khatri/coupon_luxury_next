import { SkipNavLink, Box } from "@chakra-ui/react";
import React from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function Layout({ children }) {
  return (
    <>
      <Box position={"fixed"} w={"100%"} zIndex={10} top={0}>
        <NavBar />
      </Box>
      <Box mt={{ base: "59px", md: "75px" }}>{children}</Box>
      <Footer />
    </>
  );
}

export default Layout;
