import { useState } from "react";
import axios from "axios";
import { Box, Button, Center, Flex, Input, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

function SubscribeBanner() {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const subscribe = async () => {
    try {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Please enter a valid email address",
          status: "error",
          duration: 5000,
        });
        return;
      }
      const result = await axios.post("http://localhost:4000/subscribers", {
        email: email,
      });
      console.log(result);
      toast({
        title: "Subscribed successfully",
        status: "success",
        duration: 5000,
      });
      setEmail("");
    } catch (err) {
      console.log(err);
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 5000,
      });
    }
  };
  return (
    <Flex direction={"column"} alignItems={"center"} my={5}>
      <Flex
        className="subscribe-banner-bg"
        h={250}
        w={{ base: "90vw", lg: "100vw" }}
        maxW={1248}
        borderRadius={15}
        direction={"column"}
        justifyContent={"center"}
      >
        <Text
          as={"h4"}
          fontSize={{ base: "4xl", lg: "6xl" }}
          fontWeight={"extrabold"}
          textAlign="center"
          color={"white"}
        >
          Subscribe to our newsletter!
        </Text>
        <Center flexDir={"column"}>
          <Input
            value={email}
            placeholder={"Your email address"}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            bg={"white"}
            maxW={350}
            w={{ base: "90%", lg: "100%" }}
            h={"56px"}
            mb={4}
          />
          <Button
            bg="brand.900"
            color="white"
            shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
            _hover={{
              bg: "brand.800",
              shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
            }}
            size="lg"
            fontSize={20}
            px={5}
            mb={5}
            borderRadius={10}
            onClick={subscribe}
          >
            SUBSCRIBE
          </Button>
        </Center>
      </Flex>
    </Flex>
  );
}

export default SubscribeBanner;
