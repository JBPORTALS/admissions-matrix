import { NativeSelect, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface ISelectProps {
  options: { value: string; option: string }[];
  value?: string;
  onChange: (value: string | undefined) => void;
  placeHolder: string;
  isLoading?: boolean;
}

export default function ISelect({ options, onChange, value }: ISelectProps) {
  const [currentValue, setCurrentValue] = useState<string | undefined>(value);

  useEffect(() => {
    onChange(currentValue);
  }, [currentValue, value]); // eslint-disable-line

  return (
    <VStack p={0} px={0}>
      <NativeSelect.Root size={"sm"} shadow={"md"}>
        <NativeSelect.Field
          onChange={(e) => setCurrentValue(e.currentTarget.value)}
          value={currentValue}
        >
          {options?.map((value) => {
            return (
              <option key={value.value} value={value.value}>
                {value.option}
              </option>
            );
          })}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </VStack>
  );
}
