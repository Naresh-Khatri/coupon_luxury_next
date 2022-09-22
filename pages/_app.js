import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import Layout from "../layouts/Layout";
import "../styles/globals.css";

const colors = {
  brand: {
    1000: "#0092c0",
    900: "#0072a0",
    800: "#005290",
    700: "#003270",
  },
};

const theme = extendTheme({ colors });

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default MyApp;
// $primary: #0072a0;
