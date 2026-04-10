import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Stack,
  Text,
  Center,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Link as CLink } from "@chakra-ui/react";
import { useRouter } from "next/router";
import SearchBox from "./SearchBox";
import { useEffect, useState } from "react";
import axios from "axios";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Links = [
  { name: "Home", slug: "/" },
  { name: "Stores", expanable: true, slug: "/stores" },
  { name: "Categories", expanable: true, slug: "/categories" },
  { name: "Blogs", slug: "/blogs" },
];

const mobileMenuVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] },
  },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07 + 0.1, duration: 0.35, ease: "easeOut" },
  }),
};

function NavLink({ children, slug }) {
  const router = useRouter();
  const isActive = router.pathname === slug;
  return (
    <CLink
      as={Link}
      href={slug}
      fontSize={15}
      fontWeight="500"
      letterSpacing="0.3px"
      px={3}
      py={2}
      rounded="md"
      position="relative"
      color="whiteAlpha.900"
      _hover={{ textDecoration: "none", color: "white" }}
      bg={isActive ? "rgba(0,146,192,0.25)" : "transparent"}
      borderBottom={isActive ? "2px solid #C49A3C" : "2px solid transparent"}
      transition="all 0.2s ease"
    >
      <Text>{children}</Text>
    </CLink>
  );
}

function NavBar() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [featuredStores, setFeaturedStores] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const promises = [
      axios.get("https://apiv2.couponluxury.com/stores?featered=true&limit=10"),
      axios.get("https://apiv2.couponluxury.com/categories?featered=true&limit=10"),
    ];
    Promise.allSettled(promises).then((res) => {
      setFeaturedStores(res[0].value?.data || []);
      setFeaturedCategories(res[1].value?.data || []);
    });
  }, []);

  return (
    <>
      <MotionFlex
        as="header"
        justify="center"
        position="sticky"
        top={0}
        zIndex={99}
        overflow="hidden"
        h={{ base: "59px", md: "75px" }}
        animate={{
          backgroundColor: scrolled ? "rgba(13, 27, 42, 0.97)" : "rgba(13, 27, 42, 1)",
          boxShadow: scrolled
            ? "0 2px 24px rgba(0,0,0,0.35)"
            : "0 1px 0 rgba(255,255,255,0.06)",
        }}
        transition={{ duration: 0.3 }}
        style={{ backdropFilter: "blur(12px)" }}
        fontWeight="bold"
      >
        <Box color="white" px={4} h="100%" maxW={1200} w="100%">
          <Flex h="100%" alignItems="center" justifyContent="space-between">
            <HStack spacing={8}>
              {/* Logo */}
              <MotionBox whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                <Link href="https://www.couponluxury.com/">
                  <Image
                    title="Home"
                    src="/cl-logo.svg"
                    alt="CouponLuxury logo"
                    width={180}
                    height={42}
                  />
                </Link>
              </MotionBox>

              {/* Desktop nav */}
              <HStack as="nav" display={{ base: "none", md: "flex" }} alignItems="center" spacing={1}>
                <NavLink slug="/">Home</NavLink>

                {/* Stores dropdown */}
                <Menu>
                  <MenuButton
                    px={3}
                    py={2}
                    borderRadius="md"
                    fontSize={15}
                    fontWeight="500"
                    letterSpacing="0.3px"
                    color="whiteAlpha.900"
                    bg={router.pathname.includes("/stores") ? "rgba(0,146,192,0.25)" : "transparent"}
                    borderBottom={router.pathname.includes("/stores") ? "2px solid #C49A3C" : "2px solid transparent"}
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    transition="all 0.2s ease"
                  >
                    Stores <ChevronDownIcon color="whiteAlpha.700" ml={1} />
                  </MenuButton>
                  <MenuList color="black" minWidth="10%" maxH={500} overflow="auto" borderColor="gray.100" shadow="xl">
                    <MenuItem p={0} fontWeight="700">
                      <Link href="/stores" style={{ width: "100%" }}>
                        <Center padding="8px 16px">All Stores</Center>
                      </Link>
                    </MenuItem>
                    {featuredStores.map((store) => (
                      <MenuItem key={store.id} p={0}>
                        <Link href={`/stores/${store.slug}`}>
                          <Box padding="6px 12px">
                            <Image src={store.image} alt={`${store.storeName} - Logo`} width={80} height={40} />
                          </Box>
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>

                {/* Categories dropdown */}
                <Menu>
                  <MenuButton
                    px={3}
                    py={2}
                    borderRadius="md"
                    fontSize={15}
                    fontWeight="500"
                    letterSpacing="0.3px"
                    color="whiteAlpha.900"
                    bg={router.pathname.includes("/categories") ? "rgba(0,146,192,0.25)" : "transparent"}
                    borderBottom={router.pathname.includes("/categories") ? "2px solid #C49A3C" : "2px solid transparent"}
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    transition="all 0.2s ease"
                  >
                    Categories <ChevronDownIcon color="whiteAlpha.700" ml={1} />
                  </MenuButton>
                  <MenuList color="black" minWidth="10%" maxH={500} overflow="auto" borderColor="gray.100" shadow="xl">
                    <MenuItem p={0} fontWeight="700">
                      <Link href="/categories" style={{ width: "100%" }}>
                        <Center padding="8px 16px">All Categories</Center>
                      </Link>
                    </MenuItem>
                    {featuredCategories.map((category) => (
                      <MenuItem key={category.id} p={0} fontWeight="500">
                        <Link href={`/categories/${category.slug}`}>
                          <Box padding="6px 16px" w="160px">{category.categoryName}</Box>
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>

                <NavLink slug="/blogs">Blogs</NavLink>
              </HStack>
            </HStack>

            <SearchBox />

            <MotionBox
              display={{ md: "none" }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                zIndex={101}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label="Open Menu"
                bg="transparent"
                color="white"
                _hover={{ bg: "whiteAlpha.100" }}
                onClick={isOpen ? onClose : onOpen}
              />
            </MotionBox>
          </Flex>
        </Box>
      </MotionFlex>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            position="fixed"
            top={0}
            right={0}
            zIndex={100}
            w="75vw"
            maxW="320px"
            h="100vh"
            className="ham-background"
            display={{ md: "none" }}
            boxShadow="-8px 0 40px rgba(0,0,0,0.4)"
          >
            {/* Close button */}
            <MotionBox
              position="absolute"
              top={4}
              right={4}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                icon={<CloseIcon />}
                aria-label="Close Menu"
                bg="whiteAlpha.100"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={onClose}
              />
            </MotionBox>

            {/* Gold accent bar */}
            <Box
              position="absolute"
              top={0}
              left={0}
              w="3px"
              h="full"
              bgGradient="linear(to-b, #C49A3C, #0092c0)"
            />

            <Stack
              as="nav"
              flexDir="column"
              alignItems="flex-start"
              pt="100px"
              pl={10}
              pr={6}
              spacing={2}
            >
              {Links.map((link, i) => (
                <MotionBox
                  key={link.name}
                  custom={i}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={onClose}
                  w="full"
                >
                  <Link href={link.slug}>
                    <Box
                      py={3}
                      borderBottom="1px solid rgba(255,255,255,0.07)"
                      _hover={{ color: "#C49A3C" }}
                      transition="color 0.2s"
                    >
                      <Text
                        fontSize="2xl"
                        fontWeight="600"
                        color={router.pathname === link.slug ? "#C49A3C" : "white"}
                        fontFamily="var(--font-display)"
                        letterSpacing="0.5px"
                      >
                        {link.name}
                      </Text>
                    </Box>
                  </Link>
                </MotionBox>
              ))}
            </Stack>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            position="fixed"
            inset={0}
            zIndex={98}
            bg="blackAlpha.600"
            display={{ md: "none" }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default NavBar;
