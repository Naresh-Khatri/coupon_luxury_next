import Router from "next/router";
import { useState } from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";

function LoadingOverlay({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(null);

  Router.events.on("routeChangeStart", () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setIsLoading(true);
      }, 0)
    );
  });
  Router.events.on("routeChangeComplete", () => {
    clearTimeout(timer);
    setIsLoading(false);
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
          borderRadius="0px"
          pb={30}
          bg={"blackAlpha.700"}
          position={"fixed"}
          top={0}
          left={0}
          zIndex={999}
          display="flex"
          flexDir={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Spinner
            thickness={{ base: "5px", md: "10px" }}
            width={{ base: "60px", md: "100px" }}
            height={{ base: "60px", md: "100px" }}
            color="white"
          />
          <Text
            color={"white"}
            textAlign="center"
            mt={50}
            fontSize={{ base: "xl", lg: "2xl" }}
          >
            Getting the best deals for you...
          </Text>
        </Box>
      )}
    </>
  );
}

export default LoadingOverlay;
