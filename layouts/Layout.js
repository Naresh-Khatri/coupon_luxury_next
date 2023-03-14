import { SkipNavLink, Box } from "@chakra-ui/react";
import React from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import LoadingOverlay from "../components/LoadingOverlay";
function Layout({ children }) {
  return (
    <>
      <LoadingOverlay>
        <Box position={"fixed"} w={"100%"} zIndex={10} top={0}>
          <NavBar />
        </Box>
        <Box pt={{ base: "59px", lg: "75px" }}>{children}</Box>
        <Footer />
      </LoadingOverlay>
    </>
  );
}

export default Layout;
