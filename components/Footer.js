import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  HStack,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

const socialLinks = [
  { href: "https://facebook.com/CouponLuxury/", icon: faFacebook, label: "Facebook", color: "#4267B2" },
  { href: "https://twitter.com/coupon_luxury", icon: faTwitter, label: "Twitter", color: "#1DA1F2" },
  { href: "https://www.instagram.com/couponluxury/", icon: faInstagram, label: "Instagram", color: "#E1306C" },
  { href: "https://youtube.com/channel/UCiGBpYZFIzyw_R5W1KUocJQ", icon: faYoutube, label: "YouTube", color: "#FF0000" },
  { href: "https://www.pinterest.com/couponluxury/", icon: faPinterest, label: "Pinterest", color: "#E60023" },
];

const quickLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const categoryLinks = [
  { label: "Appliances", href: "/categories/appliances" },
  { label: "Books", href: "/categories/books" },
  { label: "Travel", href: "/categories/travel" },
  { label: "Beauty", href: "/categories/beauty" },
];

function FooterLink({ href, children }) {
  return (
    <Link
      as={NextLink}
      href={href}
      color="whiteAlpha.700"
      fontSize="sm"
      fontWeight="400"
      fontFamily="var(--font-body)"
      _hover={{ color: "#C49A3C", textDecoration: "none" }}
      transition="color 0.2s ease"
    >
      {children}
    </Link>
  );
}

function FooterHeading({ children }) {
  return (
    <Text
      fontSize="xs"
      fontWeight="700"
      letterSpacing="2.5px"
      textTransform="uppercase"
      color="#C49A3C"
      mb={4}
      fontFamily="var(--font-body)"
    >
      {children}
    </Text>
  );
}

function Footer() {
  return (
    <MotionBox
      as="footer"
      bg="var(--navy)"
      color="white"
      pt={14}
      pb={8}
      px={4}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      position="relative"
      overflow="hidden"
    >
      {/* Top gold accent line */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="2px"
        bgGradient="linear(to-r, transparent, #C49A3C 30%, #0092c0 70%, transparent)"
      />

      {/* Decorative background rings */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        w="400px"
        h="400px"
        borderRadius="full"
        border="80px solid rgba(0,146,192,0.04)"
        pointerEvents="none"
      />

      <Container maxW="6xl">
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={10} mb={10}>
          {/* Contact */}
          <Stack align="flex-start" spacing={3}>
            <FooterHeading>Contact</FooterHeading>
            <Text
              as="address"
              color="whiteAlpha.600"
              fontStyle="normal"
              fontSize="sm"
              lineHeight="1.7"
              fontFamily="var(--font-body)"
            >
              81a, National House, Alkapuri,
              <br />
              Vadodara, Gujarat – 390005
            </Text>
            <Link
              href="mailto:contact@couponluxury.com"
              color="whiteAlpha.700"
              fontSize="sm"
              _hover={{ color: "#C49A3C" }}
              transition="color 0.2s"
            >
              contact@couponluxury.com
            </Link>
          </Stack>

          {/* Quick links */}
          <Stack align="flex-start" spacing={3}>
            <FooterHeading>Quick Links</FooterHeading>
            {quickLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
            ))}
          </Stack>

          {/* Categories */}
          <Stack align="flex-start" spacing={3}>
            <FooterHeading>Categories</FooterHeading>
            {categoryLinks.map((l) => (
              <Link
                key={l.href}
                as={NextLink}
                href={l.href}
                color="whiteAlpha.700"
                fontSize="xs"
                fontWeight="500"
                border="1px solid rgba(255,255,255,0.12)"
                borderRadius="full"
                py={1}
                px={3}
                _hover={{ color: "#C49A3C", borderColor: "#C49A3C" }}
                transition="all 0.2s ease"
                fontFamily="var(--font-body)"
              >
                {l.label}
              </Link>
            ))}
          </Stack>

          {/* Social */}
          <Stack align="flex-start" spacing={4}>
            <FooterHeading>Follow Us</FooterHeading>
            <HStack spacing={2} flexWrap="wrap">
              {socialLinks.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  aria-label={`Visit our ${s.label} page`}
                >
                  <MotionIconButton
                    aria-label={`${s.label} icon`}
                    bg="whiteAlpha.100"
                    color="whiteAlpha.800"
                    borderRadius="full"
                    size="sm"
                    w="36px"
                    h="36px"
                    icon={<FontAwesomeIcon icon={s.icon} />}
                    whileHover={{
                      scale: 1.15,
                      backgroundColor: s.color,
                      color: "#fff",
                    }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.15 }}
                    _hover={{}}
                  />
                </Link>
              ))}
            </HStack>
          </Stack>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.100" mb={6} />

        <Box>
          <Text
            fontSize="sm"
            fontWeight="500"
            color="whiteAlpha.600"
            fontFamily="var(--font-body)"
          >
            © {new Date().getFullYear()} All rights reserved by{" "}
            <Text as="span" color="whiteAlpha.800" fontWeight="600">
              Coupon Luxury
            </Text>
            .
          </Text>
          <Text
            as="p"
            color="whiteAlpha.400"
            fontSize="xs"
            mt={2}
            maxW="520px"
            lineHeight="1.7"
            fontFamily="var(--font-body)"
          >
            If you make a purchase after clicking on the links on this site,
            couponluxury.com may earn an affiliate commission from the site you visit.
          </Text>
        </Box>
      </Container>
    </MotionBox>
  );
}

export default Footer;
