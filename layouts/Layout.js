import Image from "next/image";
import styles from "../styles/Home.module.css";

import React from "react";
import { Box } from "@chakra-ui/react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function Layout({ children }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
