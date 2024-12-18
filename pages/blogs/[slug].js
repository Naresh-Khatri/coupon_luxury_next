import { Box, Container, Grid, GridItem, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BlogPreviewSmall from "../../components/BlogPreviewSmall";
import styles from "../../styles/PageHtml.module.scss";

import SetMeta from "../../utils/SetMeta";

function BlogPage({ blogData, allBlogs }) {
  const {
    title,
    coverImg,
    fullDescription,
    featured,
    imgAlt,
    slug,
    type,
    formattedDate,
  } = blogData;

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = (scrollY / documentHeight) * 100;
    setScrollProgress(progress);
  };

  return (
    <>
      <SetMeta
        title={`${blogData.metaTitle} - Coupons Luxury`}
        description={blogData.metaDescription}
        keywords={blogData.keywords}
        url={"https://www.couponluxury.com/blogs/" + blogData.slug}
        schema={blogData.metaSchema}
      />
      <ProgressBar progress={scrollProgress} />
      <Container maxW={"1200px"} mb={10} onScroll={handleScroll}>
        <Grid
          mt={10}
          w="100%"
          templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
        >
          <GridItem colSpan={2}>
            <Box p={5} shadow="2xl" borderRadius={15}>
              <Text
                as={"h1"}
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight={"extrabold"}
                lineHeight={1}
                py={7}
                color="brand.900"
              >
                {title}
              </Text>
              <Text as={"p"} pb={3} fontWeight={"semibold"}>
                {formattedDate}
              </Text>
              <Image
                src={coverImg}
                alt={imgAlt}
                width={800}
                height={800}
                style={{ borderRadius: "15px", width: "100%" }}
              />
              <Box
                as="article"
                mt={10}
                dangerouslySetInnerHTML={{ __html: fullDescription }}
                className={styles.page_html}
              ></Box>
            </Box>
          </GridItem>
          <GridItem colSpan={1}>
            <Text pl={5} fontSize={"4xl"} fontWeight={"semibold"}>
              Latest Blogs
            </Text>
            <Box>
              {allBlogs.map((blog) => {
                return <BlogPreviewSmall key={blog.id} blog={blog} />;
              })}
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}
const ProgressBar = ({ progress }) => {
  return (
    <Box
      position={"fixed"}
      zIndex={999}
      bg={"#0072A0"}
      width={`${progress}%`}
      top={{ base: "59px", md: "75px" }}
      transition={"width 0.2s ease-in-out"}
      h={"5px"}
    ></Box>
  );
};

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
        blogData: {
          ...blogData,
          formattedDate: formatDate(blogData.createdAt),
        },
        allBlogs,
      },
    };
  } catch (err) {
    return { redirect: { destination: "/not-found", permanent: false } };
  }
};

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
export default BlogPage;
