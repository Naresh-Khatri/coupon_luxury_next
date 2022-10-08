import { Center, Container, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";
import BlogPreview from "../../components/BlogPreview";
import Banner from "../../components/Banner";

import SetMeta from "../../utils/SetMeta";

function index({ blogsData }) {
  return (
    <>
      <SetMeta
        title={"CouponLuxury Blog: Money Saving Tips & Updates"}
        description={
          "Couponluxury Blog section gives every valued user a different understanding of online shopping, money saving, coupon redemption, product reviews & many more."
        }
        url={"https://www.couponluxury.com/blogs"}
      />
      <Text as={"h1"} hidden>
        CouponLuxury Blog: Money Saving Tips & Updates
      </Text>
      <Banner title={"All Blogs"} subTitle={`${blogsData.length} blogs`} />
      <Container mt={10} maxW={"6xl"} w="90vw">
        <Center>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
            {blogsData.map((blog) => {
              return <BlogPreview key={blog.id} blog={blog} />;
            })}
          </SimpleGrid>
        </Center>
      </Container>
    </>
  );
}

export const getStaticProps = async () => {
  try {
    const res = await fetch(process.env.domain + "/blogs");
    const blogs = await res.json();
    return {
      props: {
        blogsData: blogs,
      },
      revalidate: 60,
    };
  } catch (err) {
    return { redirect: { destination: "/not-found", permanent: false } };
  }
};

export default index;
