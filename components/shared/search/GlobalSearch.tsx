"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import GlobalResult from "./GlobalResult";

interface Props {
  handleCloseModal?: () => void;
}

const GlobalSearch = ({ handleCloseModal }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef(null);

  const query = searchParams.get("global");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    if (search) {
      setIsOpen(true);
    }

    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, [pathname, search]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keys: ["global"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchParams, router, pathname, query, search]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !search) return null;
    if (e.key === "Enter") setIsOpen(true);
  };

  return (
    <div ref={searchContainerRef}>
      <div className="background-light800_dark300 relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src={"/assets/icons/search.svg"}
          width={24}
          height={24}
          className="cursor-pointer"
          alt={"global search"}
        />
        <Input
          type="text"
          placeholder="Search globally"
          value={search}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setSearch(e.target.value);

            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="paragraph-regular no-focus placeholder text-dark400_light700 bg-transparent border-none shadow-none outline-none"
        />
      </div>
      {isOpen && <GlobalResult handleCloseModal={handleCloseModal} />}
    </div>
  );
};

export default GlobalSearch;
