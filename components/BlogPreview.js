import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionBox = motion(Box);

function estimateReadTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function BlogPreview({ blog }) {
  const { title, smallDescription, thumbnailImg, slug, imgAlt } = blog;
  const readTime = estimateReadTime(smallDescription);

  return (
    <MotionBox
      borderRadius="16px"
      overflow="hidden"
      bg="white"
      border="1px solid rgba(0,0,0,0.07)"
      maxW={300}
      display="flex"
      flexDirection="column"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px rgba(0,0,0,0.10)",
        transition: { duration: 0.22, ease: "easeOut" },
      }}
    >
      <Link href={`/blogs/${slug}`} style={{ display: "contents" }}>
        {/* Thumbnail */}
        <Box position="relative" w="full" overflow="hidden" style={{ aspectRatio: "16/9" }}>
          <Image
            src={thumbnailImg}
            alt={imgAlt}
            fill
            style={{ objectFit: "cover" }}
          />
          {/* Gradient overlay */}
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-t, blackAlpha.400, transparent)"
          />
        </Box>

        {/* Content */}
        <Flex direction="column" justify="space-between" flex={1} p={5} gap={3}>
          {/* Read time */}
          <Flex align="center" gap={2}>
            <Box w="20px" h="2px" bg="#C49A3C" borderRadius="full" />
            <Text
              fontSize="xs"
              fontWeight="600"
              letterSpacing="1.5px"
              textTransform="uppercase"
              color="#C49A3C"
              fontFamily="var(--font-body)"
            >
              {readTime} min read
            </Text>
          </Flex>

          {/* Title */}
          <Text
            fontSize="lg"
            fontWeight="700"
            noOfLines={2}
            color="gray.900"
            fontFamily="var(--font-display)"
            lineHeight="1.25"
          >
            {title}
          </Text>

          {/* Excerpt */}
          <Text
            color="gray.500"
            fontSize="sm"
            noOfLines={3}
            lineHeight="1.65"
            fontFamily="var(--font-body)"
          >
            {smallDescription}
          </Text>

          {/* CTA */}
          <Flex align="center" gap={2} mt={1}>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="#0072a0"
              fontFamily="var(--font-body)"
            >
              Read article
            </Text>
            <motion.span
              style={{ display: "inline-block", color: "#0072a0" }}
              variants={{ rest: { x: 0 }, hover: { x: 4 } }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </Flex>
        </Flex>
      </Link>
    </MotionBox>
  );
}

export default BlogPreview;
