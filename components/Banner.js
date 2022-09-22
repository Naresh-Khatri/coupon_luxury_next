import { Box, Flex, Text } from "@chakra-ui/react";

function Banner({ title, subTitle }) {
  return (
    <Flex
      direction="column"
      align={"center"}
      justify={"center "}
      className="banner-bg"
      color={"white"}
      h={110}
    >
      <Text as="h1" fontSize="4xl" fontWeight={"extrabold"} textAlign="center">
        {title}
      </Text>
      {subTitle && (
        <Text
          as="h2"
          fontSize="xl"
          fontWeight={"thin"}
          textAlign="center"
          opacity={0.6}
        >
          {subTitle}
        </Text>
      )}
    </Flex>
  );
}

export default Banner;
