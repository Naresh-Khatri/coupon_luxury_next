import Router from "next/router";
import { useState } from "react";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";

function LoadingOverlay({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(null);

  Router.events.on("routeChangeStart", () => {
    setTimer(
      setTimeout(() => {
        setIsLoading(true);
      }, 500)
    );
  });
  Router.events.on("routeChangeComplete", () => {
    setIsLoading(false);
    clearTimeout(timer);
  });
  return (
    <>
      <Box filter={"auto"} blur={isLoading && "3px"}>
        {children}
      </Box>
      {isLoading && (
        <Box
          w={"100vw"}
          h="100vh"
          pb={30}
          bg={"blackAlpha.700"}
          top={-50}
          left={0}
          position={"absolute"}
          zIndex={1}
          display="flex"
          flexDir={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Spinner
            thickness={{ base: "5px", md: "10px" }}
            width={{ base: "50px", md: "100px" }}
            height={{ base: "50px", md: "100px" }}
            color="white"
          />
          <Text
            color={"white"}
            textAlign="center"
            mt={70}
            fontSize={{ base: "xl", lg: "3xl" }}
          >
            Getting the best deals for you...
          </Text>
        </Box>
      )}
    </>
  );
}

export default LoadingOverlay;
