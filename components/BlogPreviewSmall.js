import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionBox = motion(Box);

function BlogPreviewSmall({ blog }) {
  const { title, thumbnailImg, imgAlt, createdAt, smallDescription, slug } = blog;

  return (
    <Link href={`/blogs/${slug}`}>
      <MotionBox
        borderRadius="12px"
        overflow="hidden"
        bg="white"
        border="1px solid rgba(0,0,0,0.07)"
        mb={3}
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        whileHover={{
          x: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.09)",
          transition: { duration: 0.18 },
        }}
      >
        <Flex gap={3} p={3} align="center">
          {/* Thumbnail */}
          <Box
            position="relative"
            flexShrink={0}
            w="72px"
            h="72px"
            borderRadius="8px"
            overflow="hidden"
          >
            <Image
              src={thumbnailImg}
              alt={imgAlt}
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>

          {/* Text */}
          <Box flex={1} minW={0}>
            <Text
              fontSize="sm"
              fontWeight="700"
              noOfLines={2}
              color="gray.900"
              lineHeight="1.3"
              mb={1}
              fontFamily="var(--font-display)"
            >
              {title}
            </Text>
            <Text
              fontSize="xs"
              color="#C49A3C"
              fontWeight="600"
              letterSpacing="0.5px"
              fontFamily="var(--font-body)"
            >
              {formatDate(createdAt)}
            </Text>
          </Box>
        </Flex>
      </MotionBox>
    </Link>
  );
}

const formatDate = (date) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export default BlogPreviewSmall;
