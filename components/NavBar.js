// TODO: remove nav links with breakpoints
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
import { Fade, Slide } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Image from "next/image";
import Link from "next/link";
import { Link as CLink } from "@chakra-ui/react";
import { useRouter } from "next/router";
import SearchBox from "./SearchBox";
import { useEffect, useState } from "react";
import axios from "axios";

const Links = [
  { name: "Home", display: "900", slug: "/" },
  {
    name: "Stores",
    expanable: true,
    display: "100",
    slug: "/stores",
  },
  { name: "Categories", expanable: true, display: "750", slug: "/categories" },
  { name: "Blogs", display: "1000", slug: "/blogs" },
];

function NavLink({ children, slug }) {
  const router = useRouter();
  return (
    <CLink
      as={Link}
      href={slug}
      fontSize={18}
      p={2}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: "brand.1000",
      }}
      bg={router.pathname == slug ? "brand.1000" : undefined}
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

  useEffect(() => {
    const promises = [
      axios.get("https://apiv2.couponluxury.com/stores?featered=true&limit=10"),
      axios.get(
        "https://apiv2.couponluxury.com/categories?featered=true&limit=10"
      ),
    ];
    Promise.allSettled(promises).then((res) => {
      setFeaturedStores(res[0].value.data);
      setFeaturedCategories(res[1].value.data);
      // console.log(featuredStores, featuredCategories);
    });
  }, []);
  return (
    <>
      <Flex as={"header"} bg="brand.900" justify={"center"} fontWeight="bold">
        <Box
          color="white"
          px={4}
          h={{ base: 59, md: 75 }}
          maxW={1200}
          w={"100%"}
        >
          <Flex h="100%" alignItems={"center"} justifyContent={"space-between"}>
            <HStack spacing={8}>
              <Link href="https://www.couponluxury.com/">
                <Image
                  title="Home"
                  src="https://ik.imagekit.io/couponluxury/tr:w-200:h-100/main_logo_noj4ZyPyq"
                  alt="CouponLuxury logo"
                  width={150.5}
                  height={70}
                  style={{
                    aspectRatio: 2.15,
                  }}
                />
              </Link>
              <HStack
                as={"nav"}
                display={{ base: "none", md: "flex" }}
                alignItems="center"
              >
                <NavLink slug={"/"}>{"Home"}</NavLink>
                <Menu>
                  <MenuButton
                    p={2}
                    borderRadius={"md"}
                    bg={
                      router.pathname.includes("/stores")
                        ? "brand.1000"
                        : undefined
                    }
                  >
                    <Text fontSize={18} fontWeight={"semibold"}>
                      Stores
                      <ChevronDownIcon color={"white"} />
                    </Text>
                  </MenuButton>

                  <MenuList
                    color={"black"}
                    minWidth="10%"
                    maxH={500}
                    overflow="auto"
                  >
                    <MenuItem p={0}>
                      <Link
                        href={`/stores`}
                        style={{ width: "full", height: "full" }}
                      >
                        <Center padding={"6px 12px"}>
                          <Text fontWeight={"extrabold"}>All Stores</Text>
                        </Center>
                      </Link>
                    </MenuItem>
                    {featuredStores.map((store) => (
                      <MenuItem key={store.id} p={0}>
                        <Link href={`/stores/${store.slug}`}>
                          <Box padding={"6px 12px"}>
                            <Image
                              src={store.image}
                              alt={`${store.storeName} - Logo`}
                              width={80}
                              height={40}
                            />
                          </Box>
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton
                    p={2}
                    borderRadius={"md"}
                    bg={
                      router.pathname.includes("/categories")
                        ? "brand.1000"
                        : undefined
                    }
                  >
                    <Text fontSize={18} fontWeight={"semibold"}>
                      Categories
                      <ChevronDownIcon color={"white"} />
                    </Text>
                  </MenuButton>
                  <MenuList
                    color={"black"}
                    minWidth="10%"
                    maxH={500}
                    overflow="auto"
                  >
                    <MenuItem p={0}>
                      <Link
                        href={`/categories`}
                        style={{ width: "full", height: "full" }}
                      >
                        <Center padding={"6px 12px"}>
                          <Text fontWeight={"extrabold"}>All Categories</Text>
                        </Center>
                      </Link>
                    </MenuItem>
                    {featuredCategories.map((category) => (
                      <MenuItem key={category.id} p={0} fontWeight={"semibold"}>
                        <Link href={`/categories/${category.slug}`}>
                          <Box padding={"6px 12px"} w={"140px"}>
                            {category.categoryName}
                          </Box>
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <NavLink slug={"/blogs"}>{"Blogs"}</NavLink>
              </HStack>
            </HStack>
            <SearchBox />

            <IconButton
              zIndex={101}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              bg={"transparent !important"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
          </Flex>
          <Slide direction="top" in={isOpen} style={{ zIndex: 10 }}>
            <Fade in={isOpen}>
              <Box
                p="40px"
                color="white"
                mt="4"
                bg="teal.500"
                rounded="md"
                shadow="md"
              >
                {isOpen && (
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    zIndex={100}
                    w="100vw"
                    h="100vh"
                    display={{ md: "none" }}
                    className="ham-background"
                  >
                    <Stack
                      as={"nav"}
                      display="flex"
                      flexDir="column"
                      alignItems="flex-end"
                      py={100}
                      pr={8}
                    >
                      {Links.map((link) => (
                        <Box key={link.name} onClick={onClose}>
                          <Link href={link.slug}>
                            <Text fontSize="40" fontWeight="extrabold">
                              {link.name}
                            </Text>
                          </Link>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Fade>
          </Slide>
        </Box>
      </Flex>
    </>
  );
}

export default NavBar;

// export const getServerSideProps = async () => {
//   let res = await fetch("http://localhost:4000/stores?featered=true&limit=5");
//   const navStores = await res.json();

//   res = await fetch("http://localhost:4000/categories?featered=true&limit=5");
//   const navCategories = await res.json();
//   res = await fetch("http://localhost:4000/blogs");
//   const blogs = await res.json();

//   console.log(navStores, navCategories, res);

//   return {
//     props: { navStores, navCategories },
//   };
// };
