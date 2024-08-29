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
        <div className="p-1.5 rounded-md hover:background-light800_dark300 transition-all duration-300 cursor-pointer">
          <Image
            src={"/assets/icons/search.svg"}
            width={24}
            height={24}
            className="hidden max-lg:flex"
            alt={"global search"}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] w-full top-[15%]">
        <DialogHeader className="relative">
          <GlobalSearch handleCloseModal={handleCloseModal} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ModalGlobalSearch;
