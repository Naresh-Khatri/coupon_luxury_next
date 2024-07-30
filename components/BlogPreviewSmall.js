import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function BlogPreviewSmall({ blog }) {
  const { title, thumbnailImg, imgAlt, createdAt, smallDescription, slug } =
    blog;
  return (
    <Link href={`/blogs/${slug}`}>
      <Box
        shadow={"2xl"}
        borderRadius={15}
        m={4}
        _hover={[
          {},
          {
            bg: "brand.900",
            color: "white",
            transform: "scale(1.05)",
            transition: "background 0.3s",
          },
        ]}
        style={{ transition: "background 0.3s" }}
      >
        <Grid templateColumns={"repeat(3, 1fr)"}>
          <GridItem colSpan={1} placeItems={"center"}>
            <Image
              src={thumbnailImg}
              alt={imgAlt}
              width={120}
              height={120}
              sizes={"100%"}
              style={{ borderRadius: "15px" }}
            />
          </GridItem>
          <GridItem colSpan={2} p={2}>
            <Text noOfLines={2} fontWeight={"semibold"}>
              {title}
            </Text>
            <Text fontSize={12} as={"p"} fontWeight={"semibold"}>
              {formatDate(createdAt)}
            </Text>
            <Text fontSize={12} color="gray.500" noOfLines={2}>
              {smallDescription}
            </Text>
          </GridItem>
        </Grid>
      </Box>
    </Link>
  );
}
const formatDate = (date) => {
  const months = [
    "Januaray",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date(date);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
};

export default BlogPreviewSmall;
