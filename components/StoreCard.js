import { Box, Flex, Link, Text } from "@chakra-ui/react";
import Image from "next/image";

function StoreCard({ title, slug, img }) {
  return (
    <Box
      style={{
        transition: "transform 0.1s ease-in",
      }}
      _hover={{
        transform: "scale(1.05)",
        transition: "transform 0.1s ease-in",
      }}
      h="150px"
    >
      <Link href={`/stores/${slug}`}>
        <Box
          shadow="2xl"
          borderRadius={10}
          bg="white"
          h={"full"}
          display="flex"
          flexDirection="column"
        >
          <Box w={"full"}>
            <Image
              src={img}
              width={135}
              height={65}
              alt={`${title} - logo`}
              sizes="100%"
              style={{ borderRadius: "10px" }}
            />
          </Box>
          <Flex justify={"center"} align="center" h={"full"}>
            <Text p={2} textAlign={"center"} noOfLines={2}>
              {title}
            </Text>
          </Flex>
        </Box>
      </Link>
    </Box>
  );
}

export default StoreCard;
