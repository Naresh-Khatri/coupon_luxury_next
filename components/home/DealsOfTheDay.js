import { Box, Button, Center, Grid, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import OfferCard from "../DealCard";

function DealsOfTheDay() {
  const [deals, setDeals] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:4000/offers?limit=20").then((res) => {
      setDeals(res.data);
    });
  }, []);

  return (
    <Box as="section" mt={10}>
      <Text
        textAlign="center"
        fontSize="3rem"
        lineHeight="3.125rem"
        fontWeight={400}
        letterSpacing="normal"
        mb={5}
      >
        Deals of the day
      </Text>
      <Center>
        <SimpleGrid columns={[2, 3, 5]} spacing={5} justifyContent="center">
          {deals.map((deal) => (
            <OfferCard
              key={deal._id}
              affURL={deal.affURL}
              slug={deal.store.slug}
              title={deal.title}
              offerSlug={deal.slug}
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
          >
            VIEW ALL DEAL
          </Button>
        </Link>
      </Center>
    </Box>
  );
}

export default DealsOfTheDay;
