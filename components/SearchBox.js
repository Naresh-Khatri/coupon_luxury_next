import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React, { useRef, useState } from "react";

function SearchBox() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const initialRef = useRef();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  const [canFocus, setCanFocus] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const debounce = (func, delay) => {
    // Cancels the setTimeout method execution
    clearTimeout(timeoutId);

    console.log("debounce", searchText);
    // Executes the func after delay time.
    const newTimeoutId = setTimeout(func, delay);
    setTimeoutId(newTimeoutId);
  };

  const handleSearch = async (e) => {
    // console.log(e.key)
    // if (e.key === "Down") {
    //   setCanFocus(true);
    //   console.log('focusing')
    // }
    // setSearchText(e.target.value);
    const promises = [
      axios.post(process.env.domain + "/stores/getAutoCompleteData", {
        searchText,
      }),
      axios.post(process.env.domain + "/categories/getAutoCompleteData", {
        searchText,
      }),
    ];
    const res = await Promise.allSettled(promises);
    //since categories are more imp
    const allRes = res[1].value.data.concat(res[0].value.data);
    setSearchResults(allRes);
  };
  const clearSearch = () => {
    setSearchText("");
  };

  // const handleKeyDown = (e) => {
  //   // console.log(e)
  //   if (e.key === "ArrowDown") {
  //     e.preventDefault();
  //     setCanFocus(true);
  //   }
  // };

  return (
    <Flex alignItems={"center"} flexGrow={1} position="relative" maxW={350}>
      <Popover
        isOpen={searchText?.length > 0}
        onClose={onClose}
        placement="bottom"
        closeOnBlur={false}
        autoFocus={false}
        // initialFocusRef={initialRef}
      >
        <PopoverTrigger>
          <InputGroup size="sm" role={"search"} aria-label={"search"}>
            <Input
              h={"40px"}
              borderRadius={10}
              placeholder="Search"
              role={"search"}
              aria-label={"search"}
              bg="white"
              color={"black"}
              value={searchText}
              onInput={(e) => {
                setSearchText(e.target.value);
                debounce(handleSearch, 1000);
              }}
              // onKeyDown={(e) => handleKeyDown(e)}
            />
            <InputRightElement h={"40px"}>
              {searchText?.length > 0 ? (
                <CloseIcon
                  color="blackAlpha.600"
                  onClick={() => {
                    setSearchText("");
                  }}
                />
              ) : (
                <SearchIcon color="blackAlpha.600" />
              )}
            </InputRightElement>
          </InputGroup>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverBody color={"black"}>
              {searchResults.length == 0 && (
                <Box p={2}>
                  No results found for &quot;{searchText}&quot; :(
                </Box>
              )}

              {searchResults.map((result) => (
                <Box key={result.slug} mb={2} _hover={{ bg: "gray.200" }}>
                  <Link
                    href={
                      result.storeName
                        ? `/stores/${result.slug}`
                        : `/categories/${result.slug}`
                    }
                  >
                    <a>
                      <HStack
                        justifyContent={"space-between"}
                        onClick={clearSearch}
                      >
                        <Text>{result.storeName || result.categoryName}</Text>
                        <Text fontSize={10}>
                          {result.storeName ? "Store" : "Category"}
                        </Text>
                      </HStack>
                    </a>
                  </Link>
                  <Divider style={{ height: "1px", background: "#888" }} />
                </Box>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
}

export default SearchBox;
