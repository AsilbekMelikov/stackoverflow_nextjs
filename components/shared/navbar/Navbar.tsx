import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";
import ModalGlobalSearch from "../search/ModalGlobalSearch";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="Stackflow"
        />
        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Stack<span className="text-primary-500">Overflow</span>
        </p>
      </Link>
      <div className="relative w-full max-w-[600px] max-lg:hidden">
        <GlobalSearch />
      </div>
      <div className="flex-between gap-5">
        <ModalGlobalSearch />
        <Theme />
        <SignedIn>
          <UserButton
            afterSwitchSessionUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          ></UserButton>
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
