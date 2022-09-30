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
} from "@chakra-ui/icons";
import Image from "next/image";
import Link from "next/link";
import { Link as CLink } from "@chakra-ui/react";
import { useRouter } from "next/router";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box bg="brand.900" color="white" alignItems={"center"} px={4} h={75}>
        <Flex h="100%" alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8}>
            <Link href="https://www.couponluxury.com/">
              <a>
                <Image
                  title="Home"
                  src="https://ik.imagekit.io/couponluxury/main_logo_noj4ZyPyq"
                  alt="logo"
                  width="105"
                  height="50"
                />
              </a>
            </Link>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
              alignItems="center"
            >
              {Links.map((link) => (
                <NavLink key={link.name} slug={link.slug}>
                  {link.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"} flexGrow={1} maxW={350}>
            <InputGroup size="sm">
              <Input
                h={"40px"}
                borderRadius={10}
                placeholder="Search"
                bg="white"
              />
              <InputRightElement h={"40px"}>
                <SearchIcon color="blackAlpha.600" />
              </InputRightElement>
            </InputGroup>
          </Flex>

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
    </>
  );
}
export default NavBar;
