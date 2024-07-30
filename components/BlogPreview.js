import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function BlogPreview({ blog }) {
  const { title, smallDescription, thumbnailImg, slug, imgAlt } = blog;
  return (
    <Flex
      borderRadius={15}
      maxW={275}
      shadow="xl"
      _hover={[
        {},
        {
          transform: "scale(1.05)",
          transition: "transform .1s ease-in-out",
        },
      ]}
      style={{
        transition: "transform .1s ease-in-out",
      }}
    >
      <Link href={`/blogs/${slug}`} style={{ width: "100%" }}>
        <Image
          src={thumbnailImg}
          alt={imgAlt}
          width={100}
          height={100}
          style={{ borderRadius: "15px", width: "100%" }}
        />
        <Flex
          p="24px"
          direction={"column"}
          justify="space-between"
          align={"start"}
          h="220"
        >
          <Box>
            <Text noOfLines={2} fontWeight={"semibold"} mb={1}>
              {title}
            </Text>
            <Text color={"gray.500"} fontSize={14} noOfLines={3}>
              {smallDescription}
            </Text>
          </Box>
          <Button
            bg="brand.900"
            color="white"
            shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
            _hover={[
              {},
              {
                bg: "brand.800",
                shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
              },
            ]}
            w={120}
            borderRadius={10}
            h={9}
            fontSize={14}
            px={5}
          >
            READ MORE
          </Button>
        </Flex>
      </Link>
    </Flex>
  );
}

export default BlogPreview;
