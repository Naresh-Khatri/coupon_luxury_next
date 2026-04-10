import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionBox = motion(Box);

function StoreCard({ title, slug, img }) {
  return (
    <MotionBox
      h="150px"
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{
        y: -5,
        boxShadow: "0 16px 32px rgba(0,0,0,0.14)",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
    >
      <Link href={`/stores/${slug}`}>
        <Box
          borderRadius={12}
          bg="white"
          h="full"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          border="1px solid rgba(0,0,0,0.07)"
          transition="border-color 0.2s ease"
          _hover={{ borderColor: "rgba(0,146,192,0.25)" }}
        >
          <Box w="full" flex={1} overflow="hidden">
            <Image
              src={img}
              width={200}
              height={200}
              alt={`${title} - logo`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Flex justify="center" align="center" py={2} px={2} bg="white">
            <Text
              fontSize={12}
              fontWeight="500"
              textAlign="center"
              noOfLines={1}
              color="gray.700"
              fontFamily="var(--font-body)"
            >
              {title}
            </Text>
          </Flex>
        </Box>
      </Link>
    </MotionBox>
  );
}

export default StoreCard;
