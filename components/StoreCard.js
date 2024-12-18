import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

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
              width={200}
              height={200}
              alt={`${title} - logo`}
              style={{ borderRadius: "10px", width: "100%" }}
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
