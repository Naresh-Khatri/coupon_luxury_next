import { Box, Flex, Text } from "@chakra-ui/react";

function Banner({ title, subTitle, titleAsH1}) {
  return (
    <Flex
      direction="column"
      align={"center"}
      justify={"center "}
      className="banner-bg"
      color={"white"}
      h={subTitle && !title ? 75 : subTitle ? 136 : 110}
    >
      <Text
        as={titleAsH1 ? "h1" : "h3"}
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight={"extrabold"}
        textAlign="center"
      >
        {title}
      </Text>
      {subTitle && (
        <Text
          as="h4"
          fontSize={{ base: "1xl", md: "xl" }}
          fontWeight={"medium"}
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
