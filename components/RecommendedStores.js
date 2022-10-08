import { Box, Button, Center, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

function RecommendedStores({ stores }) {
  return (
    <Box p={4} bg="white" borderRadius={15}>
      <Text color="black" fontSize={"2xl"}>
        Popular Stores
      </Text>
      <SimpleGrid columns={2} spacing={5} p={5}>
        {stores.map((store) => (
          <Link key={store.id} href={`/stores/${store.slug}`}>
            <a>
              <Flex
                justify={"center"}
                _hover={{
                  transform: "scale(1.2)",
                  transition: "transform 0.1s ease-in-out",
                }}
                style={{
                  transition: "transform 0.1s ease-in-out",
                }}
              >
                <Image
                  src={store.image}
                  alt={`${store.storeName} - logo`}
                  width={100}
                  height={50}
                />
              </Flex>
            </a>
          </Link>
        ))}
      </SimpleGrid>
      <Center>
        <Link href={"/stores"}>
          <a>
            <Button
              bg="brand.900"
              color="white"
              shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
              _hover={{
                bg: "brand.800",
                shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
              }}
              size="md"
              fontSize={15}
              mb={3}
              borderRadius={15}
            >
              VIEW ALL DEAL
            </Button>
          </a>
        </Link>
      </Center>
    </Box>
  );
}

export default RecommendedStores;
