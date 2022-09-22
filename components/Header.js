import { Box, Flex, Text } from "@chakra-ui/react";

function Header({ leftText, rightText }) {
  return (
    <Flex
      bg={"#bdbdbd"}
      w="full"
      p={4}
      my={4}
      borderRadius="15px"
      justify={"space-between"}
    >
      <Text fontSize="md">{leftText}</Text>
      <Text fontSize="md">{rightText}</Text>
    </Flex>
  );
}

export default Header;
