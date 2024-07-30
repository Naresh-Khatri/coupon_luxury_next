import { Box, Container, SimpleGrid, Text, transition } from "@chakra-ui/react";
import Link from "next/link";
import Banner from "../components/Banner";
import SetMeta from "../utils/SetMeta";

function SitemapPage({ sitemapData }) {
  return (
    <>
      <SetMeta
        title="Sitemap - CouponLuxury"
        description="The complete directory of everything we have on our website."
        url="https://www.couponluxury.com/sitemap"
      />
      <Text as={"h1"} hidden>
        Sitemap - CouponLuxury
      </Text>

      <Banner title={"Sitemap"} subTitle={"Your guide to CouponLuxury"} />
      <Box>
        <Container maxW={"1240"} w="full">
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={10}
            my={10}
          >
            {sitemapData.map((category) => {
              return (
                <Box
                  key={category.id}
                  shadow={"xl"}
                  _hover={{
                    shadow: "2xl",
                    transform: "scale(1.02)",
                    transition: "all .1s ease-in-out",
                  }}
                  style={{ transition: "all .1s ease-in-out" }}
                  borderRadius={15}
                  p={5}
                  h="fit-content"
                >
                  <Link href={`/categories/${category.slug}`}>
                    <Text
                      fontSize={"4xl"}
                      _hover={{
                        color: "brand.900",
                        transition: "all .1s ease-in-out",
                      }}
                      style={{ transition: "all .1s ease-in-out" }}
                    >
                      {category.categoryName}
                    </Text>
                  </Link>
                  {category.subCategories.map((subCat) => {
                    return (
                      <Link key={subCat.id} href={"#"}>
                        <Text pb={1}>{subCat.subCategoryName}</Text>
                      </Link>
                    );
                  })}
                </Box>
              );
            })}
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}

export const getStaticProps = async () => {
  try {
    const res = await fetch(process.env.domain + "/misc/sitemap");
    const sitemapData = await res.json();
    return {
      props: {
        sitemapData,
        revalidate: 60,
      },
    };
  } catch (err) {
    return { redirect: { destination: "/not-found", permanent: false } };
  }
  s;
};

export default SitemapPage;
