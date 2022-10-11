import {
  Box,
  Center,
  Container,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import SetMeta from "../utils/SetMeta";

function AboutUs() {
  return (
    <>
      <SetMeta
        title="About - CouponLuxury"
        url="https://www.couponluxury.com/about"
      />
      <Box bg="#ebf8ff" minH={"100vh"} w="100vw" pb={10} pt={{base:0, md:100}}>
        <Container w={"full"} maxW={1240} h="full">
          <Center height={"full"}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <Flex display={{ base: "none", md: "block" }}>
                <Image
                  src={"/assets/about_us.svg"}
                  alt="about couponluxury"
                  width={500}
                  height={500}
                />
              </Flex>
              <Box>
                <Text
                  as={"h1"}
                  fontSize={{ base: "4xl", md: "5xl" }}
                  fontWeight={"extrabold"}
                  lineHeight={1}
                  py={7}
                  color="brand.900"
                >
                  About Us
                </Text>
                <Text as={"p"} pb={3}>
                  CouponLuxury is a trusted global brand that is well-known for
                  its best online coupon code, promo code, deals & discount
                  codes. As a company with an award-winning user interface and a
                  world-class user experience, we are known for maintaining high
                  standards. Authentic, up-to-date coupons and deals have always
                  been our USP. As a leading player in the coupon and deals
                  industry, CouponLuxury has won lots of customer satisfaction.
                  They will help you save money while shopping online from
                  brands like amazon, Nike, shein etc.
                </Text>

                <Text as={"p"} pb={3}>
                  Founded in 2022, we provide the best coupons and deals to our
                  customers and bring benefits both to us and our affiliates
                  through our strategic B2B partnerships. We increase revenue,
                  create brand awareness, and extend the reach of companies
                  through our business partnership programs. The objective of
                  our network is to provide end-consumers with the best deals
                  through cross-promotion among merchants and strategic
                  companies. In spite of the fact that CouponLuxury receives
                  partnership requests in bulk every day, we intend to partner
                  with businesses that offer our users just what they want.
                  Ultimately, it&lsquo;s all about saving our users money!
                </Text>
                <Box color={"brand.900"} textAlign="end">
                  <Link href="mailto:contact@couponluxury.com">
                    <a>contact@couponluxury.com</a>
                  </Link>
                </Box>
              </Box>
            </SimpleGrid>
          </Center>
        </Container>
      </Box>
    </>
  );
}

export default AboutUs;
