import { getCookiesNext } from "@/cookies/cookiesConfig";
import { backendDomainHandler } from "@/generalConfig/BackendAndMiddlewareHelpers";
import axios from "axios";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export const ModalToCreateWS_or_Board = ({
  openModalToCreateWS_orBoard,
  typeOfCreation,
  setOpenModalToCreateWS_orBoard,
}) => {
  const [ttile, setTitle] = useState("");
  const router = useRouter();

  const createHandler = async (e) => {
    e.preventDefault();

    if (ttile === "") {
      return toast({
        title: "Error",
        description: "Please enter a title",
      });
    }
    const formData = new FormData();
    formData.append("userId", getCookiesNext("userId"));
    formData.append("title", ttile);
    formData.append("type", typeOfCreation);
    if (typeOfCreation === "board") {
      formData.append("workspace_uuid", router.query.workspaceId);
    }

    try {
      const backendRes = await axios.post(
        `${backendDomainHandler()}/create`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (backendRes.data.message === "SUCCESS") {
        toast({
          title: "Success",
          description: `Board ${ttile} created successfully`,
        });
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }
      console.log(backendRes.data);
    } catch (err) {
      console.log(err, "create err");
      return toast({
        title: "Error",
        description: "An error occured in creating the board",
      });
    }
  };

  return (
    <Dialog open={openModalToCreateWS_orBoard}>
      <DialogTrigger asChild>
        <Button variant="outline"></Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={() => {
        setOpenModalToCreateWS_orBoard(false);
      }}
        onEscapeKeyDown={() => {
          setOpenModalToCreateWS_orBoard(false);

        }}
        className="sm:max-w-md">
        <DialogHeader>
          <DialogDescription>Please enter the details</DialogDescription>
        </DialogHeader>
        <div className="flex items-end gap-3">
          <form
            action=""
            className="w-[80%]"
            onSubmit={(e) => createHandler(e)}
          >
            <p className="text-xs capitalize secondaryTextColorGray mb-1">
              {typeOfCreation} Name
            </p>
            <input
              autoFocus
              type="text"
              className="bg-transparent rounded-md h-8 w-full placeholder:text-[13px] pl-4"
              placeholder="Enter Title"
              value={ttile}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>
          <Button
            type="submit"
            onClick={(e) => createHandler(e)}
            className="h-8"
          >
            Create
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose
            onClick={() => setOpenModalToCreateWS_orBoard(false)}
            asChild
          >
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
