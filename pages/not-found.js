import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import SetMeta from "../utils/SetMeta";

function NotFoundPage() {
  return (
    <>
      <SetMeta
        title="404 CouponLuxury"
        description="The page you are looking for does not exist."
        url="https://www.couponluxury.com/not-found"
      />
      <Text as={"h1"} hidden>
        404 CouponLuxury
      </Text>
      <Flex
        w={"100vw"}
        h={"100vh"}
        direction="column"
        justify="center"
        align={"center"}
        pt={100}
      >
        <Text
          fontSize={[150, 200]}
          mt={-150}
          color="brand.900"
          fontWeight={"bold"}
        >
          404
        </Text>
        <Text
          fontSize={20}
          mt={-10}
          mb={10}
          color="brand.900"
          fontWeight={"semibold"}
        >
          Oh no! The page is not found.
        </Text>
        <Box w={[200, 300]} h={[200, 300]}>
          <Image src={"/assets/404.svg"} width={300} height={300} alt={"404"} />
        </Box>
        <Link href={"/"}>
          <Button
            mt={5}
            bg="brand.900"
            color="white"
            shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
            _hover={{
              bg: "brand.800",
              shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
            }}
            w={"136"}
            h={"50"}
            fontSize={20}
            px={5}
            mb={5}
          >
            GO HOME
          </Button>
        </Link>
      </Flex>
    </>
  );
}

// export const getStaticProps = async (ctx) => {
//     if(ctx)
//     console.log(ctx)
//     return {
//         redirect: {
//             // destination: '/not-found',
//             // permanent: false,
//         },
//     }
// }
export default NotFoundPage;
