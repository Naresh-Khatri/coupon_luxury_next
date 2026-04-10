import { Box, Container, Grid, GridItem, Text, Flex, Divider } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BlogPreviewSmall from "../../components/BlogPreviewSmall";
import styles from "../../styles/PageHtml.module.scss";
import SetMeta from "../../utils/SetMeta";

const MotionBox = motion(Box);

function BlogPage({ blogData, allBlogs }) {
  const {
    title,
    coverImg,
    fullDescription,
    imgAlt,
    formattedDate,
  } = blogData;

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setScrollProgress((scrollY / documentHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <SetMeta
        title={`${blogData.metaTitle} - Coupons Luxury`}
        description={blogData.metaDescription}
        keywords={blogData.keywords}
        url={"https://www.couponluxury.com/blogs/" + blogData.slug}
        schema={blogData.metaSchema}
      />

      {/* Reading progress bar */}
      <ProgressBar progress={scrollProgress} />

      <Container maxW="1200px" px={{ base: 4, md: 6 }} mb={16}>
        <Grid
          mt={{ base: 6, md: 10 }}
          w="100%"
          templateColumns={{ base: "1fr", lg: "1fr 340px" }}
          gap={{ base: 8, lg: 10 }}
        >
          {/* Main article */}
          <GridItem>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              bg="white"
              borderRadius="20px"
              overflow="hidden"
              border="1px solid rgba(0,0,0,0.07)"
              shadow="sm"
            >
              {/* Cover image */}
              <Box position="relative" w="full" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={coverImg}
                  alt={imgAlt}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
                {/* Gradient */}
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient="linear(to-t, blackAlpha.500, transparent 60%)"
                />
              </Box>

              {/* Article content */}
              <Box p={{ base: 5, md: 8 }}>
                {/* Date + read time */}
                <Flex align="center" gap={3} mb={4}>
                  <Box w="24px" h="2px" bg="#C49A3C" borderRadius="full" />
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    letterSpacing="1.5px"
                    textTransform="uppercase"
                    color="#C49A3C"
                    fontFamily="var(--font-body)"
                  >
                    {formattedDate}
                  </Text>
                </Flex>

                {/* Title */}
                <Text
                  as="h1"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  fontWeight="700"
                  lineHeight="1.1"
                  mb={6}
                  color="gray.900"
                  fontFamily="var(--font-display)"
                >
                  {title}
                </Text>

                <Divider mb={6} borderColor="gray.100" />

                {/* Article body */}
                <Box
                  as="article"
                  dangerouslySetInnerHTML={{ __html: fullDescription }}
                  className={styles.page_html}
                />
              </Box>
            </MotionBox>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <MotionBox
              position={{ lg: "sticky" }}
              top={{ lg: "88px" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
              {/* Sidebar heading */}
              <Flex align="center" gap={3} mb={5} px={1}>
                <Box w="3px" h="24px" bg="#C49A3C" borderRadius="full" />
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color="gray.900"
                  fontFamily="var(--font-display)"
                  letterSpacing="0.3px"
                >
                  More Articles
                </Text>
              </Flex>

              <Box>
                {allBlogs.slice(0, 8).map((blog) => (
                  <BlogPreviewSmall key={blog.id} blog={blog} />
                ))}
              </Box>
            </MotionBox>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}

const ProgressBar = ({ progress }) => (
  <Box
    position="fixed"
    zIndex={999}
    top={{ base: "59px", md: "68px" }}
    left={0}
    h="3px"
    w={`${progress}%`}
    bgGradient="linear(to-r, #0092c0, #C49A3C)"
    transition="width 0.15s linear"
    borderRadius="0 2px 2px 0"
  />
);

export const getServerSideProps = async (ctx) => {
  try {
    const { slug } = ctx.query;
    let res = await fetch(process.env.domain + `/blogs/getUsingSlug/${slug}`);
    const blogData = await res.json();
    res = await fetch(process.env.domain + "/blogs?limit=10");
    const allBlogs = (await res.json()).filter(
      (blog) => blog.slug.toLocaleLowerCase() !== slug.toLocaleLowerCase(),
    );
    return {
      props: {
        blogData: { ...blogData, formattedDate: formatDate(blogData.createdAt) },
        allBlogs,
      },
    };
  } catch (err) {
    return { redirect: { destination: "/not-found", permanent: false } };
  }
};

const formatDate = (date) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export default BlogPage;
