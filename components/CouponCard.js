import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionFlex = motion(Flex);

function CouponCard({
  affURL,
  showValidTill,
  storeImg,
  slug,
  offerSlug,
  storeName,
  code,
  title,
  type,
  endDate,
}) {
  return (
    <MotionFlex
      bg="white"
      w={{ base: 160, lg: 196 }}
      h={{ base: 200, lg: 248 }}
      borderRadius="2xl"
      direction="column"
      alignItems="center"
      justifyContent="space-between"
      shadow="md"
      overflow="hidden"
      border="1px solid rgba(0,0,0,0.06)"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
    >
      <Link href={`/deals/${slug}`} style={{ width: "100%" }}>
        <Box w="full" overflow="hidden">
          <Image
            width={200}
            height={100}
            style={{ borderRadius: "16px 16px 0 0", width: "100%", display: "block" }}
            title={`Open ${slug} store`}
            alt={`${title} - logo`}
            src={storeImg}
          />
        </Box>
      </Link>

      <Text
        fontSize={{ base: 13, lg: 15 }}
        fontWeight="500"
        textAlign="center"
        px={2}
        color="gray.700"
        noOfLines={2}
        lineHeight="1.4"
        fontFamily="var(--font-body)"
      >
        {title}
      </Text>

      <Link href={`/deals/${slug}`} style={{ width: "100%", padding: "0 12px 14px" }}>
        <Button
          w="full"
          size="sm"
          bg="brand.900"
          color="white"
          borderRadius="xl"
          fontSize={{ base: 12, lg: 13 }}
          fontWeight="600"
          letterSpacing="0.5px"
          h={{ base: "32px", lg: "36px" }}
          _hover={{ bg: "brand.800" }}
          _active={{ bg: "brand.700" }}
          transition="all 0.15s ease"
        >
          VIEW DEAL
        </Button>
      </Link>
    </MotionFlex>
  );
}

export default CouponCard;
