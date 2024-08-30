"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import GlobalSearch from "./GlobalSearch";
import Image from "next/image";
import { useState } from "react";

const ModalGlobalSearch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <div className="hover:background-light800_dark300 cursor-pointer rounded-md p-1.5 transition-all duration-300">
          <Image
            src={"/assets/icons/search.svg"}
            width={24}
            height={24}
            className="hidden max-lg:flex"
            alt={"global search"}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="top-[15%] w-full max-w-[800px]">
        <DialogHeader className="relative">
          <GlobalSearch handleCloseModal={handleCloseModal} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ModalGlobalSearch;
