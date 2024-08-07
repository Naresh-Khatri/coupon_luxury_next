import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Badge,
  Link,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
  return (
    <Box
      as="footer"
      borderTopLeftRadius={100}
      bg={"brand.900"}
      color={"white"}
      py={10}
      px={3}
    >
      <Container as={Stack} maxW={"6xl"}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={"flex-start"} fontWeight="semibold">
            <Text fontSize="2xl" fontWeight="bold">
              CONTACT
            </Text>
            <Text
              as="address"
              color={"gray.100"}
              textDecoration="none"
              fontStyle={"normal"}
            >
              81a, National House, Alkapuri, Vadodara, Gujarat - 390005
            </Text>
            <a href="mailto:contact@couponluxury.com">
              contact@couponluxury.com
            </a>
          </Stack>

          <Stack align={"flex-start"} fontWeight="semibold">
            <Text fontSize="2xl" fontWeight="bold">
              QUICK LINKS
            </Text>
            <Link as={NextLink} href={"/privacy-policy"}>
              Privacy policy
            </Link>
            <Link as={NextLink} href={"/sitemap"}>
              Sitemap
            </Link>
            <Link as={NextLink} href={"/about"}>
              About us
            </Link>
            <Link as={NextLink} href={"/contact"}>
              Contact us
            </Link>
          </Stack>

          <Stack align={"flex-start"} fontWeight="semibold">
            <Text fontSize="2xl" fontWeight={"bold"}>
              Categories
            </Text>
            <Link as={NextLink} href={"/categories/appliances"}>
              <Box
                outline={"1px solid white"}
                borderRadius={50}
                py={1}
                px={3}
                fontSize={14}
              >
                Appliances
              </Box>
            </Link>
            <Link as={NextLink} href={"/categories/books"}>
              <Box
                outline={"1px solid white"}
                borderRadius={50}
                py={1}
                px={3}
                fontSize={14}
              >
                books
              </Box>
            </Link>
            <Link as={NextLink} href={"/categories/travel"}>
              <Box
                outline={"1px solid white"}
                borderRadius={50}
                py={1}
                px={3}
                fontSize={14}
              >
                Travel
              </Box>
            </Link>
            <Link as={NextLink} href={"/categories/beauty"}>
              <Box
                outline={"1px solid white"}
                borderRadius={50}
                py={1}
                px={3}
                fontSize={14}
              >
                Beauty
              </Box>
            </Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Text fontSize="2xl" fontWeight="bold">
              Follow us
            </Text>
            <HStack as={"nav"} spacing={3} mt={2}>
              <Link
                href="https://facebook.com/CouponLuxury/"
                target="_blank"
                aria-label="Visit our Facebook page"
              >
                <IconButton
                  aria-label="facebook icon"
                  bg="tranparent"
                  borderRadius={100}
                  _hover={{
                    transform: "scale(1.2)",
                    bg: "white",
                    color: "#4267B2",
                  }}
                  icon={<FontAwesomeIcon size="2x" icon={faFacebook} />}
                />
              </Link>
              <Link
                href="https://twitter.com/coupon_luxury"
                target="_blank"
                aria-label="Visit our Twitter page"
              >
                <IconButton
                  aria-label="twitter icon"
                  bg="tranparent"
                  _hover={{
                    transform: "scale(1.2)",
                    bg: "white",
                    color: "#1DA1F2",
                  }}
                  icon={<FontAwesomeIcon size="2x" icon={faTwitter} />}
                />
              </Link>
              <Link
                href="https://www.instagram.com/couponluxury/"
                target="_blank"
                aria-label="Visit our Instagram page"
              >
                <IconButton
                  aria-label="instagram icon"
                  bg="tranparent"
                  borderRadius={100}
                  _hover={{
                    transform: "scale(1.2)",
                    bg: "white",
                    color: "#E1306C",
                  }}
                  icon={<FontAwesomeIcon size="2x" icon={faInstagram} />}
                />
              </Link>
              <Link
                href="https://youtube.com/channel/UCiGBpYZFIzyw_R5W1KUocJQ"
                target="_blank"
                aria-label="Visit our Youtube page"
              >
                <IconButton
                  aria-label="youtube icon"
                  bg="tranparent"
                  _hover={{
                    transform: "scale(1.2)",
                    bg: "white",
                    color: "#FF0000",
                  }}
                  icon={<FontAwesomeIcon size="2x" icon={faYoutube} />}
                />
              </Link>
              <Link
                href="https://www.pinterest.com/couponluxury/"
                target="_blank"
                aria-label="Visit our Pinterest page"
              >
                <IconButton
                  aria-label="pinterest icon"
                  bg="tranparent"
                  borderRadius={100}
                  _hover={{
                    transform: "scale(1.2)",
                    bg: "white",
                    color: "#E60023",
                  }}
                  icon={<FontAwesomeIcon size="2x" icon={faPinterest} />}
                />
              </Link>
            </HStack>
          </Stack>
        </SimpleGrid>
        <Box px={3} fontWeight="semibold">
          <Text
            fontSize="20px"
            lineHeight="32px"
            fontWeight={500}
            letterSpacing={0.2}
            mt={{ base: 5, md: 0 }}
          >
            © 2022 All rights reserved by Coupon Luxury.
          </Text>
          <Text as="p" color={"gray.100"}>
            If you make a purchase after clicking on the links on this site,
            couponluxury.com may earn an affiliate commission from the site you
            visit.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
