// TODO: remove nav links with breakpoints
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  LinkOverlay,
} from "@chakra-ui/react";
import { Fade, ScaleFade, Slide, SlideFade } from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  AddIcon,
  SearchIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import Image from "next/future/image";
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
    <Link href={slug} passHref>
      <CLink
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
    </Link>
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
      <Flex as={"header"} bg="brand.900" justify={"center"}>
        <Box
          color="white"
          px={4}
          h={{ base: 59, md: 75 }}
          maxW={1200}
          w={"100vw"}
        >
          <Flex h="100%" alignItems={"center"} justifyContent={"space-between"}>
            <HStack spacing={8}>
              <Link href="https://www.couponluxury.com/">
                <a>
                  <Image
                    title="Home"
                    src="https://ik.imagekit.io/couponluxury/tr:w-200:h-100/main_logo_noj4ZyPyq"
                    alt="CouponLuxury logo"
                    width={107}
                    height={50}
                    style={{
                      aspectRatio: 2.15,
                    }}
                  />
                </a>
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
                    <Text fontSize={18}>
                      Stores
                      <ChevronDownIcon color={"white"} />
                    </Text>
                  </MenuButton>

                  <MenuList color={"black"} minWidth="10%">
                    <MenuItem>
                      <Link href={`/stores`}>
                        <a>
                          <Text fontWeight={"extrabold"}>All Stores</Text>
                        </a>
                      </Link>
                    </MenuItem>
                    {featuredStores.map((store) => (
                      <MenuItem key={store.id}>
                        <Link href={`/stores/${store.slug}`}>
                          <a>
                            <Image
                              src={store.image}
                              alt={`${store.storeName} - Logo`}
                              width={80}
                              height={40}
                            />
                          </a>
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
                    <Text fontSize={18}>
                      Categories
                      <ChevronDownIcon color={"white"} />
                    </Text>
                  </MenuButton>
                  <MenuList color={"black"} minWidth="10%">
                    <MenuItem>
                      <Link href={`/categories`}>
                        <a>
                          <Text fontWeight={"extrabold"}>All Categories</Text>
                        </a>
                      </Link>
                    </MenuItem>
                    {featuredCategories.map((category) => (
                      <MenuItem key={category.id}>
                        <Link href={`/categories/${category.slug}`}>
                          <a>{category.categoryName}</a>
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
                            <a>
                              <Text fontSize="40" fontWeight="extrabold">
                                {link.name}
                              </Text>
                            </a>
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
