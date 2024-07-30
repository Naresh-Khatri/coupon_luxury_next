import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";
import SetMeta from "../utils/SetMeta";
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

function ContactPage() {
  return (
    <>
      <SetMeta
        title="Contact - CouponLuxury"
        url="https://www.couponluxury.com/contact"
      />
      <Box
        bg="#ebf8ff"
        minH={"100vh"}
        w="100vw"
        pb={10}
        pt={{ base: 100, md: 150 }}
      >
        <Container
          w={"full"}
          maxW={1240}
          h="full"
          display={"flex"}
          flexDirection={"column"}
          alignContent={"center"}
          justifyContent={"center"}
        >
          <Box mb={10} mt={-20}>
            <Text
              as={"h1"}
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight={"extrabold"}
              lineHeight={1}
              py={3}
              color="brand.900"
            >
              Contact Us
            </Text>
            <Box>
              <Box color={"brand.900"} fontWeight="extrabold">
                <Link href="mailto:contact@couponluxury.com">
                  contact@couponluxury.com
                </Link>
              </Box>
            </Box>
            <HStack as={"nav"} spacing={7} mt={2}>
              <Link href="https://facebook.com/CouponLuxury/" target="_blank">
                <IconButton
                  icon={
                    <FontAwesomeIcon
                      size="3x"
                      icon={faFacebook}
                      color="#4267B2"
                    />
                  }
                />
              </Link>
              <Link href="https://twitter.com/coupon_luxury" target="_blank">
                <IconButton
                  icon={
                    <FontAwesomeIcon
                      size="3x"
                      icon={faTwitter}
                      color="#1DA1F2"
                    />
                  }
                />
              </Link>
              <Link
                href="https://www.instagram.com/couponluxury/"
                target="_blank"
              >
                <IconButton
                  icon={
                    <FontAwesomeIcon
                      size="3x"
                      icon={faInstagram}
                      color="#E1306C"
                    />
                  }
                />
              </Link>
              <Link
                href="https://youtube.com/channel/UCiGBpYZFIzyw_R5W1KUocJQ"
                target="_blank"
              >
                <IconButton
                  icon={
                    <FontAwesomeIcon
                      size="3x"
                      icon={faYoutube}
                      color="#FF0000"
                    />
                  }
                />
              </Link>
              <Link
                href="https://www.pinterest.com/couponluxury/"
                target="_blank"
              >
                <IconButton
                  icon={
                    <FontAwesomeIcon
                      size="3x"
                      icon={faPinterest}
                      color="#E60023"
                    />
                  }
                />
              </Link>
            </HStack>
          </Box>
          <Center>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <Flex w={"full"}>
                <iframe
                  id="map"
                  src="https://maps.google.com/maps?q=gorgaon&output=embed"
                  height="450"
                  width={"100%"}
                  loading="lazy"
                  display={{ borderRadius: "10px" }}
                ></iframe>
              </Flex>{" "}
              <Flex display={{ base: "none", md: "block" }}>
                <Image
                  src={"/assets/contact_us.svg"}
                  alt="contact couponluxury"
                  width={500}
                  height={500}
                />
              </Flex>
            </SimpleGrid>
          </Center>
        </Container>
      </Box>
    </>
  );
}

export default ContactPage;
