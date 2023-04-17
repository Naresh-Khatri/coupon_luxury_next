import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";

function RuledInput({ title, placeholder, hintText, value, setValue, rule }) {
  const [inputTouched, setInputTouched] = useState(false);
  const inputIsInvalid =
    inputTouched &&
    (value.trim().length < rule.min || value.trim().length > rule.max);
  return (
    <FormControl isRequired isInvalid={inputIsInvalid && inputTouched}>
      <FormLabel>{title}</FormLabel>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setInputTouched(true)}
      />
      {inputIsInvalid ? 
        inputTouched &&(
        <FormErrorMessage fontSize={'12.5'}>
          {value.trim().length < 30 &&
            `Length: ${value.trim().length}, Minimum allowed ${rule.min}`}
          {value.trim().length > 70 &&
            `Length: ${value.trim().length}, Maximum allowed ${rule.max}`}
        </FormErrorMessage>
        
      ) : (
        <FormHelperText fontSize={'12.5'}>
          Length: {value.trim().length} ({hintText})
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default RuledInput;
