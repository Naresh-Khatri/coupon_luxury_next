import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import SideBar from "../components/BlogPanel/SideBar";
import { useRouter } from "next/router";
import account from "../appwrite/config";
import { useEffect, useState } from "react";

function AdminLayout({ children }) {
  const router = useRouter();
  const toast = useToast();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await account.get();
      } catch (err) {
        toast({
          title: "You are not logged in",
          description: "Redirected to the login page...",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        router.push("/blogs/login");
        console.log("user not logged in");
      }
    };
    checkLogin();
  }, []);
  return (
    <Flex h={"100vh"} w={"100vw"}>
      <SideBar />
      <Flex
        direction={"column"}
        position={"relative"}
        w={"100%"}
        bg={"gray.100"}
      >
        <NavBar />
        <Box pt={"120px"} overflow={"auto"}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}

const NavBar = () => {
  const router = useRouter();
  const route = router.pathname.split("/").pop();

  return (
    <Flex
      as="nav"
      minH={"90px"}
      m={7}
      p={4}
      borderRadius={20}
      shadow={"md"}
      position={"absolute"}
      left={0}
      right={0}
      zIndex={10}
      bg={"whiteAlpha.500"}
      backdropFilter={"blur(10px)"}
      justifyContent={"space-between"}
    >
      <Flex direction={"column"}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/blogs/admin/">blogs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/blogs/admin/create">create</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Text fontSize={"2xl"} fontWeight={"bold"}>
          {route}
        </Text>
      </Flex>
      <AccountMenu />
    </Flex>
  );
};

const AccountMenu = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { onClose, isOpen, onOpen } = useDisclosure();

  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await account.get("current");
        setUserInfo(res);
      } catch (err) {
        console.log(err);
      }
    };
    getUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUserInfo({});
      router.push("/blogs");
      onClose();
    } catch (err) {
      console.log(err);
      router.push("/blogs");
      onClose();
    }
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={"full"}
        variant={"link"}
        cursor={"pointer"}
        minW={0}
      >
        <Avatar size={"md"} name={userInfo?.name} />
      </MenuButton>
      <MenuList alignItems={"center"}>
        <br />
        <Center>
          <Avatar
            size={"2xl"}
            src={
              "https://ik.imagekit.io/couponluxury/og_image_1I5dOd_ix?updatedAt=1655124742982"
            }
          />
        </Center>
        <br />
        <Center>
          <Text>hey, {userInfo?.name || "user"} 👋</Text>
        </Center>
        <br />
        <MenuDivider />
        <MenuItem isDisabled>Your Profile</MenuItem>
        <MenuItem isDisabled>Account Settings</MenuItem>
        <MenuItem onClick={onOpen}>Logout</MenuItem>
      </MenuList>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.600"
          backdropFilter="auto"
          backdropBlur="4px"
        />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to logout?</Text>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button>Cancel</Button>
              <Button onClick={handleLogout} colorScheme="red">
                Logout
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Menu>
  );
};

export default AdminLayout;
