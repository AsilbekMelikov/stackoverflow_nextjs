"use client";

import Image from "next/image";
import React from "react";
import { Input } from "../../ui/input";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchBar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] w-full grow items-center gap-4 rounded-xl border border-light-700 px-4 dark:border-none ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        id="local search"
        name="localSearch"
        placeholder={placeholder}
        onChange={() => {}}
        className="placeholder:placeholder paragraph-regular text-dark200_light900 no-focus background-light800_darkgradient border-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchBar;
