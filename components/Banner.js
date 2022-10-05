import { Box, Flex, Text } from "@chakra-ui/react";

function Banner({ title, subTitle }) {
  return (
    <Flex
      direction="column"
      align={"center"}
      justify={"center "}
      className="banner-bg"
      color={"white"}
      h={subTitle ? 136 : 110}
      _hover={{}}
    >
      <Text
        as="h1"
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight={"extrabold"}
        textAlign="center"
      >
        {title}
      </Text>
      {subTitle && (
        <Text
          as="h2"
          fontSize={{ base: "1xl", md: "xl" }}
          fontWeight={"thin"}
          textAlign="center"
          color={"gray.400"}
        >
          {subTitle}
        </Text>
      )}
    </Flex>
  );
}

export default Banner;
