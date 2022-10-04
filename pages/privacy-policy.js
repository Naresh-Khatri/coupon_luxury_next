import {
  Box,
  Container,
  Flex,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import Link from "next/link";

function PrivacyPolicyPage() {
  return (
    <>
      <Box bg="#ebf8ff" h={"100vh"} minH={"100vh"} w="full">
        <Container maxW={"1240"} w="full" px={10} py={100}>
          <Text
            as="h1"
            fontSize={{ base: "4xl", md: "6xl" }}
            color="brand.900"
            fontWeight={"extrabold"}
            mb={{ base: 5, md: 10 }}
          >
            Privacy Policy
          </Text>
          <Text as="p" mb={5}>
            Keeping your personal information secure and private is one of our
            highest priorities. The terms and conditions of our website apply to
            the use of our website. Together with our website terms and
            conditions, this policy outlines users&#39; fundamental rights. Here
            are some details about how we will treat your personal data.
          </Text>
          <Text as="h2" fontSize={"2xl"}>
            INFORMATION WE MAY COLLECT FROM YOU
          </Text>
          <UnorderedList mb={10} mt={5}>
            <ListItem>
              It is possible for us to collect any or all of the following
              information: contact information, relationship information,
              location information, and analytics information.
            </ListItem>
            <ListItem>
              Although you are free not to participate in such surveys, we may
              ask for your information only for research purposes.
            </ListItem>
            <ListItem>
              Secure online communications are ensured using SSL certificates
              and customer information is kept confidential
            </ListItem>
          </UnorderedList>

          <Text as="h2" fontSize={"2xl"}>
            COUPONLUXURY OFFERS NEWSLETTERS AND ALERT SUBSCRIPTIONS. HOW WILL IT
            WORK?
          </Text>
          <UnorderedList mb={10} mt={5}>
            <ListItem>
              Through our mailers, we will communicate with you about coupon
              codes, freebies, and other products and services we think you will
              find interesting.
            </ListItem>
            <ListItem>
              Based on your preferences, we may send you information about other
              websites that we believe would be of interest to you.
            </ListItem>
            <ListItem>
              Alternatively, you can email us at contact@couponluxury.com for
              any questions related to gift cards. To unsubscribe from offer
              emails, click on the unsubscribe link in the footer of the email.
            </ListItem>
          </UnorderedList>
          <Link mb={5} href="https://www.couponluxury.com">
            <a>
              <Text color={"brand.900"}>www.couponluxury.com</Text>
            </a>
          </Link>
        </Container>
      </Box>
    </>
  );
}

export default PrivacyPolicyPage;
