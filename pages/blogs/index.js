import { Box, Container, SimpleGrid, Text, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import BlogPreview from "../../components/BlogPreview";
import SetMeta from "../../utils/SetMeta";

const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

function BlogsIndex({ blogsData }) {
  return (
    <>
      <SetMeta
        title={"CouponLuxury Blog: Money Saving Tips & Updates"}
        description={
          "Couponluxury Blog section gives every valued user a different understanding of online shopping, money saving, coupon redemption, product reviews & many more."
        }
        url={"https://www.couponluxury.com/blogs"}
      />

      {/* Hidden SEO headings */}
      <Text as="h1" hidden>
        Unlock the Secrets of Shopping: Expert Tips, Tricks, Trends, and Deals on Our Blog
      </Text>

      {/* Page header */}
      <Box
        className="banner-bg"
        py={{ base: 12, md: 16 }}
        px={4}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="2px"
          bgGradient="linear(to-r, transparent, #C49A3C, transparent)"
          opacity={0.6}
        />
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Text
            as="p"
            fontSize="xs"
            fontWeight="600"
            letterSpacing="3px"
            color="#C49A3C"
            textTransform="uppercase"
            mb={3}
            fontFamily="var(--font-body)"
          >
            Insights &amp; Savings
          </Text>
          <Text
            as="h2"
            fontSize={{ base: "4xl", md: "6xl" }}
            fontWeight="700"
            color="white"
            fontFamily="var(--font-display)"
            lineHeight="1.1"
            mb={3}
          >
            The Coupon Luxury Blog
          </Text>
          <Text
            color="whiteAlpha.600"
            fontSize={{ base: "sm", md: "md" }}
            fontFamily="var(--font-body)"
          >
            {blogsData?.length} articles on deals, tips &amp; smart shopping
          </Text>
        </MotionBox>
      </Box>

      {/* Articles grid */}
      <Container maxW="6xl" py={12} px={{ base: 4, md: 6 }}>
        <MotionSimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing={6}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogsData?.map((blog) => (
            <BlogPreview key={blog.id} blog={blog} />
          ))}
        </MotionSimpleGrid>
      </Container>
    </>
  );
}

export const getStaticProps = async () => {
  try {
    const res = await fetch(process.env.domain + "/blogs");
    const blogs = await res.json();
    return {
      props: { blogsData: blogs },
      revalidate: 60,
    };
  } catch (err) {
    console.log(err);
    return { props: { blogsData: [] } };
  }
};

export default BlogsIndex;
