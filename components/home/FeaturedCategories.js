import {
  Box,
  Button,
  Center,
  Flex,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";

const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function CategoryCard({ category }) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={`/categories/${category.slug}`}>
        <MotionBox
          position="relative"
          h={200}
          w={{ base: "full", md: 340 }}
          borderRadius="16px"
          overflow="hidden"
          cursor="pointer"
          whileHover="hovered"
          initial="rest"
        >
          <Image
            src={category.image}
            width={350}
            height={200}
            alt={category.imgAlt || category.categoryName + " image"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Base overlay */}
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-t, blackAlpha.800 0%, blackAlpha.400 50%, blackAlpha.100 100%)"
          />

          {/* Teal shimmer on hover */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(0,146,192,0.2) 0%, transparent 60%)",
              opacity: 0,
            }}
            variants={{ rest: { opacity: 0 }, hovered: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
          />

          {/* Text content */}
          <Flex
            position="absolute"
            inset={0}
            direction="column"
            justify="flex-end"
            align="flex-start"
            p={5}
          >
            <motion.div
              variants={{ rest: { y: 0 }, hovered: { y: -4 } }}
              transition={{ duration: 0.25 }}
            >
              <Text
                color="white"
                fontSize="2xl"
                fontWeight="700"
                fontFamily="var(--font-display)"
                lineHeight="1.1"
                mb={1}
              >
                {category.categoryName}
              </Text>
              <Text as="p" color="whiteAlpha.800" fontSize="sm" fontFamily="var(--font-body)">
                {category.offers.length} Deals &amp; Coupons
              </Text>
            </motion.div>

            {/* Gold underline reveal */}
            <motion.div
              style={{
                height: "2px",
                background: "#C49A3C",
                borderRadius: "1px",
                marginTop: "8px",
                originX: 0,
              }}
              variants={{ rest: { scaleX: 0 }, hovered: { scaleX: 1 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </Flex>
        </MotionBox>
      </Link>
    </motion.div>
  );
}

function FeaturedCategories({ featuredCat }) {
  return (
    <Box bg="white" py={16} px={4}>
      {/* Heading */}
      <MotionBox
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        textAlign="center"
        mb={10}
      >
        <Text
          as="p"
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="600"
          letterSpacing="3px"
          color="brand.gold"
          textTransform="uppercase"
          mb={2}
          fontFamily="var(--font-body)"
        >
          Browse by interest
        </Text>
        <Text
          as="h2"
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="700"
          lineHeight="1.1"
          fontFamily="var(--font-display)"
          color="gray.900"
        >
          Featured{" "}
          <Text as="span" bgGradient="linear(to-r, #0092c0, #C49A3C)" bgClip="text">
            Categories
          </Text>
        </Text>
        <Text
          as="p"
          color="gray.500"
          display={{ base: "none", md: "block" }}
          fontSize="md"
          mt={3}
          fontFamily="var(--font-body)"
        >
          Discover curated deals across every lifestyle
        </Text>
        <Box mx="auto" mt={4} w="48px" h="3px" bgGradient="linear(to-r, #0092c0, #C49A3C)" borderRadius="full" />
      </MotionBox>

      {/* Grid */}
      <Center>
        <MotionSimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={6}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {featuredCat.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </MotionSimpleGrid>
      </Center>

      <Center mt={10}>
        <MotionBox whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
          <Link href="/categories">
            <Button
              bg="brand.900"
              color="white"
              size="lg"
              fontSize={15}
              px={8}
              borderRadius={12}
              fontWeight="600"
              letterSpacing="0.8px"
              shadow="0 8px 24px rgba(0,114,160,0.35)"
              _hover={{ bg: "brand.800", shadow: "0 12px 32px rgba(0,114,160,0.45)" }}
              _active={{ bg: "brand.700" }}
              transition="all 0.2s ease"
            >
              VIEW ALL CATEGORIES
            </Button>
          </Link>
        </MotionBox>
      </Center>
    </Box>
  );
}

export default FeaturedCategories;
