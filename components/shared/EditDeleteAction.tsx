"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "./modal/Modal";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };

  const progressAction = (timer: ReturnType<typeof setInterval>) => {
    setProgress((prev) => {
      if (prev < 90) {
        return prev + 10;
      } else {
        clearInterval(timer);
        return prev;
      }
    });
  };

  const handleDelete = async () => {
    if (type === "Question") {
      setIsDeleting(true);
      const timer = setInterval(() => progressAction(timer), 100);
      // Delete question
      try {
        await deleteQuestion({
          questionId: JSON.parse(itemId),
          path: pathname,
        });
        setProgress(100);
      } catch (error) {
        console.log(error);
      } finally {
        setIsDeleting(false);
        clearInterval(timer);
        setTimeout(() => setProgress(0), 1000);
      }
    } else if (type === "Answer") {
      setIsDeleting(true);
      const timer = setInterval(() => progressAction(timer), 100);
      // Delete Answer
      try {
        await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
        setProgress(100);
      } catch (error) {
        console.log(error);
      } finally {
        setIsDeleting(false);
        clearInterval(timer);
        setTimeout(() => setProgress(0), 1000);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3 max-sm:w-full">
        {type === "Question" && (
          <Image
            src={"/assets/icons/edit.svg"}
            alt="Edit"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
            onClick={handleEdit}
          />
        )}
        <Modal
          progress={progress}
          open={isDeleting}
          setOpen={setIsDeleting}
          handleClick={handleDelete}
          triggerButtonCont={
            <Image
              src={"/assets/icons/trash.svg"}
              alt="Delete"
              width={14}
              height={14}
              className="cursor-pointer object-contain"
            />
          }
          title="Are you absolutely sure?"
          description={`This action cannot be undone. This will permanently delete your ${type === "Question" ? "question." : "answer."}`}
          actionButtonCont="Delete"
        />
      </div>
    </>
  );
};

export default EditDeleteAction;
