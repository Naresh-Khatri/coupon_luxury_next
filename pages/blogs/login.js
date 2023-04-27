import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import account from "../../appwrite/config";
import { useRouter } from "next/router";

function BlogsLogin() {
  const router = useRouter();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    account
      .get()
      .then((res) => {
        if (res.$id) {
          toast({
            title: "You are already logged in",
            description: "Welcome the admin page",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          router.push("/blogs/admin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const finalUsername = username + "@example.com";
    try {
      const res = await account.createEmailSession(finalUsername, password);
      router.push("/blogs/admin");
      toast({
        title: "You are logged in",
        description: "Redirected to the admin page",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "An error occurred.",
        description: "Check your credentials or try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      console.log(err);
    }
  };

  return (
    <Flex
      minH={"90vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel> Username</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                onClick={handleLogin}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default BlogsLogin;
