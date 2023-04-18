import { useCallback, useEffect, useState } from "react";
import account from "../../appwrite/config";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { AddIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import CustomEditor from "../../components/CustomEditor";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faDownLong } from "@fortawesome/free-solid-svg-icons";

export default function SimpleCard() {
  const router = useRouter();
  const toast = useToast();

  const [userInfo, setUserInfo] = useState({});
  const [userIsLoading, setUserIsLoading] = useState(true);

  useEffect(() => {
    setUserIsLoading(true);
    account
      .get()
      .then((res) => {
        setUserInfo(res);
        setUserIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setUserInfo({});
        setUserIsLoading(false);
        router.push("/blogs/admin/login");
        toast({
          title: "You are not logged in",
          description: "You are redirected to the login page",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [router, toast]);
  const handleLogout = () => {
    account
      .deleteSession("current")
      .then(() => {
        setUserInfo({});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (userIsLoading) return <div>Loading...</div>;
  return (
    <>
      <NavBar handleLogout={handleLogout} />
      <Container maxW="container.xl">
        <Tabs defaultIndex={1}>
          <TabList>
            <Tab>
              <HStack>
                <HamburgerIcon /> <Text>List Posts </Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <AddIcon /> <Text>Create Post</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ListPosts posts={[]} />
            </TabPanel>
            <TabPanel>
              <CreateBlog />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}

const CreateBlog = () => {
  return (
    <Container maxW="container.xl" shadow={"md"} borderRadius={"lg"}>
      <SimpleGrid columns={2} spacing={10}>
        <Box p={5}>
          <Stack spacing={3}>
            <FormControl isRequired>
              <FormLabel>Blog Title</FormLabel>
              <Input placeholder="Enter Title" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Blog Description</FormLabel>
              <Input placeholder="Enter Title" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Blog Slug</FormLabel>
              <Input placeholder="Enter Slug" />
            </FormControl>
          </Stack>
        </Box>
        <Box p={5}>
          <MyDropzone />
        </Box>
      </SimpleGrid>
      <CustomEditor />
    </Container>
  );
};
const MyDropzone = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        borderRadius={10}
        border={`2px dashed ${isDragActive ? "lightgreen" : "gray"}`}
        h={200}
      >
        {!isDragActive ? (
          <Stack>
            <FontAwesomeIcon icon={faImage} bounce size="5x" />
            <Text color={"gray.400"}>Drop the files here...</Text>
          </Stack>
        ) : (
          <Stack>
            <FontAwesomeIcon icon={faDownLong} color="green" bounce size="5x" />
            <Text color={"green.400"}>Drop it like it's hot!</Text>
          </Stack>
        )}
      </Flex>
    </div>
  );
};

const NavBar = ({ handleLogout }) => {
  return (
    <>
      <Flex
        bg={"brand.900"}
        p={3}
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Link href="https://www.couponluxury.com/">
          <a>
            <Image
              title="Home"
              src="https://ik.imagekit.io/couponluxury/tr:w-200:h-100/main_logo_noj4ZyPyq"
              alt="CouponLuxury logo"
              width={120}
              height={60}
            />
          </a>
        </Link>
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
    </>
  );
};

const ListPosts = ({ posts }) => {
  console.log(posts);
  if (!posts || posts.length === 0) return <Text>No posts</Text>;
  return (
    <Box>
      <Text>List Posts</Text>
    </Box>
  );
};
