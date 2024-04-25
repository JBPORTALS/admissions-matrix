import { Heading, HStack, Select, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface ISelectProps {
  options: { value: string; option: string }[];
  value?: string;
  onChange: (value: string | undefined) => void;
  placeHolder: string;
  isLoading?: boolean;
}

export default function ISelect({
  options,
  onChange,
  placeHolder,
  value,
  isLoading,
}: ISelectProps) {
  const [currentValue, setCurrentValue] = useState<string | undefined>(value);

  useEffect(() => {
    onChange(currentValue);
  }, [currentValue, value]); // eslint-disable-line

  return (
    <VStack
      p={0}
      px={0}
      className="bg-background w-52 relative flex flex-col px-10"
    >
      <Select
        bg={"white"}
        onChange={(e) => setCurrentValue(e.target.value)}
        size={"sm"}
        shadow={"md"}
      >
        <option value={""}>{placeHolder}</option>
        {options?.map((value) => {
          return (
            <option key={value.value} value={value.value}>
              {value.option}
            </option>
          );
        })}
      </Select>
    </VStack>
  );
}

{
  /* <VStack p={0} px={0} className="bg-background w-fit relative border-r flex flex-col p-0 border-lightgray custom-scroll-sm overflow-y-scroll">
      <HStack className="border-b sticky top-0 backdrop-blur-sm  border-lightgray w-full px-2 py-2.5 justify-center">
        <Heading
          fontSize={"sm"}
          fontWeight={"medium"}
          className={"whitespace-nowrap"}
        >
          {placeHolder}
        </Heading>
      </HStack>
      <VStack className="px-4 pb-[65px] items-center justify-center">
        {isLoading
          ? new Array(10).fill(0).map((value, index) => {
              return (
                <div
                  key={index}
                  className={
                    "w-20 h-7 justify-center p-2 rounded-md bg-gray-200 animate-pulse "
                  }
                ></div>
              );
            })
          : options.map(({ value: OptionValue, option }, index) => {
              return (
                <div
                  key={option + index}
                  onClick={(e) =>
                    setCurrentValue(e.currentTarget.dataset.value)
                  }
                  className={
                    "flex w-20 justify-center p-2 rounded-md text-sm hover:cursor-pointer hover:bg-brandLight " +
                    (OptionValue == currentValue &&
                      "bg-brandLight font-semibold")
                  }
                  data-value={OptionValue}
                >
                  <h1 className="text-center">
                    {option}
                  </h1>
                </div>
              );
            })}
      </VStack>
    </VStack> */
}
