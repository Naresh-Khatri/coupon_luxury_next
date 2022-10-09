import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
// import Button from './utils/Button'

function DealCard({
  affURL,
  showValidTill,
  storeImg,
  storeName,
  storeSlug,
  dealSlug,
  code,
  title,
  type,
  endDate,
}) {
  return (
    <Flex
      bg="white"
      w={{ base: 170, lg: 200 }}
      h={{ base: 200, lg: 250 }}
      borderRadius="2xl"
      direction={"column"}
      alignItems={"center"}
      justifyContent={"space-between"}
      shadow={"2xl"}
      transition="all 0.2s ease-in-out"
      _hover={{
        transform: "scale(1.05)",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <Link href={`/stores/${storeSlug}`}>
        <a>
          <Box>
            <Image
              width={350}
              height={175}
              style={{ borderRadius: "15px" }}
              title={`Open ${storeName} store`}
              alt={`${title} - logo`}
              src={storeImg}
            />
          </Box>
        </a>
      </Link>
      <Text
        fontSize={{ base: 14, lg: 18 }}
        fontWeight={"400"}
        textAlign="center"
        px={2}
        noOfLines={2}
      >
        {title}
      </Text>
      <Link href={`/deals/${dealSlug}`}>
        <a>
          <Button
            bg="brand.900"
            color="white"
            shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
            _hover={{
              bg: "brand.800",
              shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
            }}
            w={{ base: "100", lg: "136" }}
            h={{ base: "9", lg: "50" }}
            fontSize={{ base: 14, lg: 20 }}
            px={5}
            mb={5}
          >
            VIEW DEAL
          </Button>
        </a>
      </Link>
    </Flex>
  );
}

export default DealCard;
