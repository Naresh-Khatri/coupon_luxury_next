import { Center, Container, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import BlogPreview from "../../components/BlogPreview";
import Banner from "../../components/Banner";
function index({ blogsData }) {
  return (
    <>
      <Banner title={"All Blogs"} subTitle={`${blogsData.length} blogs`} />
      <Container mt={10} maxW={"6xl"} w="90vw">
        <Center>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
            {blogsData.map((blog) => {
              return <BlogPreview key={blog._id} blog={blog} />;
            })}
            {blogsData.map((blog) => {
              return <BlogPreview key={blog._id} blog={blog} />;
            })}
            {blogsData.map((blog) => {
              return <BlogPreview key={blog._id} blog={blog} />;
            })}
            {blogsData.map((blog) => {
              return <BlogPreview key={blog._id} blog={blog} />;
            })}
          </SimpleGrid>
        </Center>
      </Container>
    </>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch("http://localhost:4000/blogs");
  const blogs = await res.json();
  return {
    props: {
      blogsData: blogs,
    },
  };
};

export default index;
