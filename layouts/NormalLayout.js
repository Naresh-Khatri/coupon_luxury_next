import { Box } from "@chakra-ui/react";
import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function NormalLayout({children}) {
  return (
    <>
      <Box position={"fixed"} w={"100%"} zIndex={10} top={0}>
        <NavBar />
      </Box>
      <Box pt={{ base: "59px", lg: "75px" }}>{children}</Box>
      <Footer />
    </>
  );
}

export default NormalLayout;
