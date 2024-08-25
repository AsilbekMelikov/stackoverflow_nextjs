"use cli";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  handleClick: () => void;
  progress: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  triggerButtonCont: string | ReactNode;
  actionButtonCont: string;
  title: string;
  description: string;
  otherClasses?: string;
}

const Modal = ({
  handleClick,
  progress,
  open,
  setOpen,
  triggerButtonCont,
  actionButtonCont,
  title,
  description,
  otherClasses,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`${otherClasses}`}>{triggerButtonCont}</Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:border-dark-500 dark:bg-dark-400">
        {progress !== 0 && <Progress value={progress} className="mb-2" />}

        <DialogHeader>
          <DialogTitle className="dark:text-white">{title}</DialogTitle>
          <DialogDescription className="dark:text-white">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start md:justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center rounded-md px-5 py-3 text-[14px] font-medium leading-5 tracking-wide text-black duration-300 hover:bg-light-800 dark:text-white dark:hover:bg-dark-300"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleClick}
            className="flex items-center justify-center rounded-md bg-red-600 px-5 py-3 text-[14px] font-medium leading-5 tracking-wide text-white duration-300 hover:bg-red-700"
          >
            {actionButtonCont}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
