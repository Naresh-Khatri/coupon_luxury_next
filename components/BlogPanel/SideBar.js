import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { faAdd, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const ROUTES = [
  { name: "All Blogs", route: "/blogs/admin", icon: faListCheck },
  { name: "Create Blog", route: "/blogs/admin/create", icon: faAdd },
];
function SideBar() {
  const router = useRouter();
  const activeRoute = router.pathname;
  return (
    <Box as="aside" w={"25%"} maxW={"xs"} h={"full"}>
      <Flex py={5} justifyContent={"center"} bg={"#0072a0"}>
        <Link href="https://www.couponluxury.com/">
          <Image
            title="Home"
            src="https://ik.imagekit.io/couponluxury/tr:w-200:h-100/main_logo_noj4ZyPyq"
            alt="CouponLuxury logo"
            width={160}
            height={80}
          />
        </Link>
      </Flex>
      <hr style={{ border: ".1px solid #aaa" }} />
      <Flex flexDir={"column"} mt={10} ml={5}>
        {ROUTES.map((route) => (
          <NavListItem
            key={route.name}
            item={route}
            active={activeRoute === route.route}
          />
        ))}
      </Flex>
    </Box>
  );
}

const NavListItem = ({ item, active }) => {
  return (
    <Link href={item.route}>
      <Button
        variant={"ghost"}
        justifyContent={"space-between"}
        alignItems={"center"}
        h={12}
        pr={0}
      >
        <Flex alignItems={"center"}>
          <FontAwesomeIcon
            icon={item.icon}
            color={active ? "#0072a0" : "#718096"}
            width={20}
            fontSize={"20px"}
          />
          <Text
            ml={3}
            color={active ? "brand.900" : "gray.500"}
            fontWeight={active ? "bold" : "normal"}
          >
            {item.name}
          </Text>
        </Flex>
        <Box
          bg={active ? "brand.900" : "transparent"}
          w={"4px"}
          h={"36px"}
          borderRadius={"5px"}
        ></Box>
      </Button>
    </Link>
  );
};

export default SideBar;
