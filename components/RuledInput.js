import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

function RuledInput({
  title,
  placeholder,
  hintText,
  value,
  setValue,
  rule,
  earlyShowError,
}) {
  const toast = useToast();
  const [inputTouched, setInputTouched] = useState(false);
  let inputIsInvalid = null;
  if (earlyShowError) {
    inputIsInvalid =
      value.trim().length > 0 &&
      (value.trim().length < rule.min || value.trim().length > rule.max);
  } else {
    inputIsInvalid =
      inputTouched &&
      (value.trim().length < rule.min || value.trim().length > rule.max);
  }

  const handleOnChange = (e) => {
    if (e.target.value.length > rule.max) {
      toast({
        title: "Input too long",
        description: `Length: ${e.target.value.length}, Maximum allowed ${rule.max}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return;
    }
    setValue(e.target.value);
  };
  return (
    <FormControl isRequired isInvalid={inputIsInvalid}>
      <FormLabel>{title}</FormLabel>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
        onBlur={() => setInputTouched(true)}
      />
      {/* {inputIsInvalid ? ( */}
      <FormErrorMessage fontSize={"12.5"}>
        {value.trim().length < rule.min &&
          `Length: ${value.trim().length}, Minimum allowed ${rule.min}`}
        {value.trim().length > rule.max &&
          `Length: ${value.trim().length}, Maximum allowed ${rule.max}`}
      </FormErrorMessage>
      {/* ) : ( */}
      <FormHelperText fontSize={"12.5"}>
        Length: {value.trim().length} ({hintText})
      </FormHelperText>
      {/* )} */}
    </FormControl>
  );
}

export default RuledInput;
