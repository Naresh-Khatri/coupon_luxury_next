import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
// import Button from './utils/Button'

function OfferCard({
  affURL,
  showValidTill,
  storeImg,
  slug,
  offerSlug,
  storeName,
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
      <Link href={`/deals/${slug}`}>
        <Image
          width={200}
          height={100}
          style={{ borderRadius: "15px" }}
          title={`Open ${slug} store`}
          alt={`${title} - logo`}
          src={storeImg}
        />
      </Link>
      <Text
        fontSize={{ base: 14, lg: 18 }}
        fontWeight={"thin"}
        textAlign="center"
        px={2}
        noOfLines={2}
      >
        {title}
      </Text>
      <Link href={`/deals/${slug}`}>
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
      </Link>
    </Flex>
  );
}

export default OfferCard;
