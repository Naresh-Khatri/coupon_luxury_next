import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  Badge,
} from "@chakra-ui/react";
import {
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaPinterest,
  FaFacebook,
} from "react-icons/fa";

// import AppStoreBadge from "@/components/AppStoreBadge";
// import PlayStoreBadge from "@/components/PlayStoreBadge";

export default function LargeWithAppLinksAndSocial() {
  return (
    <Box
      borderTopLeftRadius={50}
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
            <Text opacity={0.5}>
              81a, National House, Alkapuri, Vadodara, Gujarat - 390005
            </Text>
            <Link href={"#"}>contact@couponluxury.com</Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Text fontSize="2xl" fontWeight="bold">
              QUICK LINKS
            </Text>
            <Link href={"#"}>Privacy policy</Link>
            <Link href={"#"}>Sitemap</Link>
            <Link href={"#"}>About us</Link>
            <Link href={"#"}>Contact us</Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Text fontSize="2xl" fontWeight="bold">
              Categories
            </Text>
            <Link href={"#"}>
              <Badge>Appliances</Badge>
            </Link>
            <Link href={"#"}>
              <Badge>books</Badge>
            </Link>
            <Link href={"#"}>
              <Badge>Travel</Badge>
            </Link>
            <Link href={"#"}>
              <Badge>Beauty</Badge>
            </Link>
          </Stack>

          <Stack align={"flex-start"}>
            {/* FaTwitter, FaYoutube, FaInstagram, FaPinterest, FaFacebook */}

            <Text fontSize="2xl" fontWeight="bold">
              Follow us
            </Text>
            <Link fontWeight={500} href={"#"}>
              Facebook
            </Link>
            <Link href={"#"}>Twitter</Link>
            <Link href={"#"}>Instagram</Link>
            <Link href={"#"}>Pinterest</Link>
            <Link href={"#"}>YouTube</Link>
          </Stack>
        </SimpleGrid>
      </Container>
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
      {/* <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ md: "space-between" }}
          align={{ md: "center" }}
        >
          <Text>© 2022 Chakra Templates. All rights reserved</Text>
          <Stack direction={"row"} spacing={6}>
            <SocialButton label={"Twitter"} href={"#"}>
              <FaTwitter />
            </SocialButton>
            <SocialButton label={"YouTube"} href={"#"}>
              <FaYoutube />
            </SocialButton>
            <SocialButton label={"Instagram"} href={"#"}>
              <FaInstagram />
            </SocialButton>
          </Stack>
        </Container>
      </Box> */}
    </Box>
  );
}
