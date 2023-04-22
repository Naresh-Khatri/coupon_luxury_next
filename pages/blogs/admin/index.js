import account from "../../../appwrite/config";
import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import BlogsTable from "../../../components/BlogPanel/BlogsTable";

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    getBlogs();
  }, []);
  const getBlogs = async () => {
    setBlogsLoading(true);
    try {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await sleep(1000);
      const { data } = await axios("http://localhost:4000/blogs");
      console.log(data);
      setBlogs(data);
      setBlogsLoading(false);
    } catch (err) {
      setBlogsLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      <Flex h={"full"} w={"full"}>
        <Container maxW="container.xl" bg={"whiteAlpha.300"}>
          <BlogsTable blogs={blogs} />
        </Container>
      </Flex>
    </>
  );
}

const NavBar = () => {
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
  if (!posts || posts.length === 0) return <Text>No posts</Text>;
  return (
    <Box>
      <Text>List Posts</Text>
    </Box>
  );
};