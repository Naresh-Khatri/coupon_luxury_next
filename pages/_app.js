import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import Layout from "../layouts/Layout";
import { Inter } from "next/font/google";
import "../styles/globals.css";
const inter = Inter({ subsets: ["latin"] });

const colors = {
  brand: {
    1000: "#0092c0",
    900: "#0072a0",
    800: "#005290",
    700: "#003270",
  },
};

const activeLabelStyles = {
  transform: "scale(.85) translateY(-24px)",
};
const theme = extendTheme({
  colors,
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </Layout>
      {/* <GoogleAnalytics gaId="G-GW2KCXB7MJ" /> */}
      {/* <GoogleAnalytics gaId="G-EE83FLWJM0" /> */}
    </ChakraProvider>
  );
}

export default MyApp;
