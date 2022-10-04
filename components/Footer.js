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
          <Stack align={"flex-start"}>
            <Text fontSize="2xl" fontWeight="bold">
              CONTACT
            </Text>
            <Text as="address" opacity={0.5}>
              81a, National House, Alkapuri, Vadodara, Gujarat - 390005
            </Text>
            <a href="mailto:contact@couponluxury.com">
              contact@couponluxury.com
            </a>
          </Stack>

          <Stack align={"flex-start"}>
            <Text fontSize="2xl" fontWeight="bold">
              QUICK LINKS
            </Text>
            <Link href={"/privacy-policy"}>Privacy policy</Link>
            <Link href={"/sitemap"}>Sitemap</Link>
            <Link href={"/about"}>About us</Link>
            <Link href={"/contact"}>Contact us</Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Text fontSize="2xl" fontWeight="bold">
              Categories
            </Text>
            <Link href={"/categories/appliances"}>
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
            <Link href={"/categories/books"}>
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
            <Link href={"/categories/travel"}>
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
            <Link href={"/categories/beauty"}>
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
              <Link href="https://facebook.com/CouponLuxury/" target="_blank">
                <IconButton
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
              <Link href="https://twitter.com/coupon_luxury" target="_blank">
                <IconButton
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
              >
                <IconButton
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
              >
                <IconButton
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
              >
                <IconButton
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
        <Box px={3}>
          <Text
            fontSize="20px"
            lineHeight="32px"
            fontWeight={500}
            letterSpacing={0.2}
          >
            © 2022 All rights reserved by Coupon Luxury.
          </Text>
          <Text as="p" opacity={0.5}>
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
