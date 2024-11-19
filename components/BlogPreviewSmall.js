import { Box, Grid, GridItem, Text, Flex, Icon } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function BlogPreviewSmall({ blog }) {
  const { title, thumbnailImg, imgAlt, createdAt, smallDescription, slug } =
    blog;
  return (
    <Link href={`/blogs/${slug}`}>
      <Box
        position="relative"
        borderRadius="xl"
        overflow="hidden"
        m={4}
        bg="white"
        border="1px solid"
        borderColor="gray.100"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-4px)",
          shadow: "xl",
          borderColor: "gray.200",
          '& img': {
            transform: "scale(1.05)",
          }
        }}
      >
        <Grid 
          templateColumns={"repeat(3, 1fr)"}
          gap={4}
          p={3}
        >
          <GridItem 
            colSpan={1} 
            overflow="hidden"
            position="relative"
          >
            <Box
              position="relative"
              paddingBottom="100%"
              overflow="hidden"
            >
              <Image
                src={thumbnailImg}
                alt={imgAlt}
                fill
                style={{ 
                  borderRadius: "12px",
                  objectFit: "cover",
                  transition: "transform 0.3s ease"
                }}
              />
            </Box>
          </GridItem>

          <GridItem 
            colSpan={2} 
            p={2}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box>
              <Text 
                fontSize="lg"
                fontWeight="bold"
                noOfLines={2}
                mb={2}
                color="gray.800"
                lineHeight="short"
              >
                {title}
              </Text>
              <Text 
                fontSize="sm" 
                color="gray.500" 
                noOfLines={2}
                mb={2}
                lineHeight="tall"
              >
                {smallDescription}
              </Text>
            </Box>
            
            <Flex 
              alignItems="center" 
              gap={2}
            >
              <Icon 
                // as={FiCalendar} 
                color="brand.500" 
                w={4} 
                h={4}
              />
              <Text 
                fontSize="sm"
                color="gray.600"
                fontWeight="medium"
              >
                {formatDate(createdAt)}
              </Text>
            </Flex>
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
