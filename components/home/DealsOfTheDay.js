import {
  Box,
  Button,
  Center,
  Grid,
  SimpleGrid,
  Text,
  useBreakpoint,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import DealCard from "../DealCard";

function DealsOfTheDay({ deals }) {
  const limitedDeals = useBreakpointValue({
    base: deals?.slice(0, 12),
    md: deals?.slice(0, 20),
  });
  return (
    <Box as="section" mt={10}>
      <Text
        as={"h2"}
        fontSize={{ base: "4xl", md: "5xl" }}
        textAlign={"center"}
        mb={5}
        fontWeight="semibold"
      >
        <Text
          as={"span"}
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgClip={"text"}
        >
          Deals{" "}
        </Text>
        of the day
      </Text>
      {/* <Text
        textAlign="center"
        fontSize={{ base: "4xl", md: "5xl" }}
        lineHeight="3.125rem"
        fontWeight={400}
        letterSpacing="normal"
        mb={5}
      >
        Deals of the day
      </Text> */}
      <Center mx={2}>
        <SimpleGrid
          columns={[2, 3, 4, 5]}
          spacing={{ base: 2, md: 5 }}
          justifyContent="center"
        >
          {limitedDeals.map((deal) => (
            <DealCard
              key={deal.id}
              affURL={deal.affURL}
              storeName={deal.store.storeName}
              storeSlug={deal.store.slug}
              dealSlug={deal.slug}
              title={deal.title}
              code={deal.couponCode ? deal.couponCode : ""}
              type={deal.offerType}
              endDate={deal.endDate}
              showValidTill={false}
              storeImg={deal.store.image}
            />
          ))}
        </SimpleGrid>
      </Center>
      <Center mt={10}>
        <Link href={`/deals`}>
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
          >
            VIEW ALL DEALS
          </Button>
        </Link>
      </Center>
    </Box>
  );
}

export default DealsOfTheDay;
