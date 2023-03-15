import { Box, Center, SimpleGrid } from "@chakra-ui/react";
import Banner from "../../components/Banner";
import DealCard from "../../components/DealCard";

import SetMeta from "../../utils/SetMeta";

function DealsPage({ dealsList }) {
  return (
    <Box bg="#e0e0e0">
      <SetMeta
        title="Deals - CouponLuxury"
        description="Grab the greatest deals on all exclusive stores using luxury coupons, promo & discount codes. Shop the biggest brands like Nike, amazon, domino's using our offers"
        url="https://www.couponluxury.com/deals"
      />
      <Banner
        title={"All Deals"}
        subTitle={`${dealsList.length} deals available!`}
      />
      <Center py={10} mx={2}>
        <SimpleGrid
          columns={[2, 3, 4, 5]}
          spacing={{ base: 2, md: 5 }}
          justifyContent="center"
        >
          {dealsList.map((deal) => (
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
    </Box>
  );
}

export default DealsPage;

export const getStaticProps = async () => {
  try {
    const res = await fetch(
      process.env.domain + `/offers?offerType=deal&limit=50`
    );
    const dealsList = await res.json();
    return {
      props: {
        dealsList,
      },
      revalidate: 60,
    };
  } catch (err) {
    return { redirect: { destination: "/not-found", permanent: false } };
  }
};
