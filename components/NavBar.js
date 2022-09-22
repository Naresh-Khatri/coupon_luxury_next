// TODO: remove nav links with breakpoints
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
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

import useWidth from "../hooks/useWidth";

const Links = [
  { name: "Home", display: "900" },
  { name: "Stores", expanable: true, display: "100", active: true },
  { name: "Categories", expanable: true, display: "750" },
  { name: "Blogs", display: "1000" },
];

const NavLink = ({ children, active = undefined }) => (
  <Link
    fontSize={18}
    p={2}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: "brand.1000",
    }}
    bg={active ? "brand.1000" : undefined}
    href={"#"}
  >
    {children}
  </Link>
);

function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const width = useWidth();
  return (
    <>
      <Box bg="brand.900" color="white" alignItems={"center"} px={4} h={75} position='fixed'>
        <Flex h="100%" alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8}>
            <Link href="https://www.couponluxury.com/">
              <Image
                title="Home"
                src="https://ik.imagekit.io/couponluxury/main_logo_noj4ZyPyq"
                alt="logo"
                width="105"
                height="50"
                loading="lazy"
              />
            </Link>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
              alignItems="center"
            >
              {Links.map((link) => (
                <NavLink key={link.name} active={link.active}>
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
            {/* <Button
              variant={"solid"}
              colorScheme={"teal"}
              size={"sm"}
              mr={4}
              leftIcon={<AddIcon />}
            >
              Action
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu> */}
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
                  >
                    {Links.map((link) => (
                      <Text
                        fontSize="40"
                        fontWeight="extrabold"
                        key={link.name}
                      >
                        {link.name}
                      </Text>
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
