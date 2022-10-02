import { Box, Container, Grid, GridItem, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import BlogPreviewSmall from "../../components/BlogPreviewSmall";
import styles from "./style.module.scss";

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
  return (
    <Container maxW={"1200px"}>
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
            <Text as={"p"} pb={3}>
              {formattedDate}
            </Text>
            <Image
              src={coverImg}
              sizes={"100%"}
              alt={imgAlt}
              width={768}
              height={432}
              style={{ borderRadius: "15px" }}
            />
            <Box
              mt={10}
              dangerouslySetInnerHTML={{ __html: fullDescription }}
              className={styles.page_html}
            ></Box>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Text pl={5} fontSize={"4xl"}>
            Latest Blogs
          </Text>
          <Box>
            {allBlogs.map((blog) => {
              return <BlogPreviewSmall key={blog._id} blog={blog} />;
            })}
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
}

export const getServerSideProps = async (ctx) => {
  let res = await fetch(
    `http://localhost:4000/blogs/getUsingSlug/${ctx.query.slug}`
  );
  const blogData = await res.json();
  res = await fetch("http://localhost:4000/blogs?limit=10");
  const allBlogs = await res.json();
  return {
    props: {
      blogData: { ...blogData, formattedDate: formatDate(blogData.createdAt) },
      allBlogs,
    },
  };
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
