import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getCookiesNext, setLocalStorageFunction } from "@/cookies/cookiesConfig";
import { backendDomainHandler } from "@/generalConfig/BackendAndMiddlewareHelpers";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import RemoveBoardToFavouritesModal from "./RemoveBoardsFromFavourites";
import LoadingSpinner from "../UI_Components/LoadingSpinner";
import { Cross1Icon } from "@radix-ui/react-icons";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { inviteMembersToBoardOrWorkspaceHandlerUniversal } from "@/helperFunctions/invitingToWorkspaceOrBoard/InviteLinkGneration";
import { DeleteIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const AdditionalSettingsEachBoard = ({
  isOpen,
  index,
  setUsersBoards,
  boardUuid,
  boardName,
  isBoardStarred,
  allUserBoards,
  workspaceUuidOnlyForFavouritesRouteToUnstarBoard,
  accessedFrom,
  isBoardShared
}) => {
  const router = useRouter();
  const toggleAdditionalSettiontgsModal = (index) => {
    setUsersBoards((prev) => {
      console.log(prev);
      const tempState = [...prev];
      tempState[index] = { ...tempState[index], isOpen: !isOpen };
      return tempState;
    });
  };
  useEffect(() => {
    const viewTeamMembersHandler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsTeamMembersModalOpen(false);
      }
    };
    document.addEventListener("keydown", viewTeamMembersHandler);
    return () =>
      document.removeEventListener("keydown", viewTeamMembersHandler);
  }, []);

  const [isTeamMembersModalOpen, setIsTeamMembersModalOpen] = useState(false);
  const [teamMembersInBoard, setTeamMembersInBoard] = useState([]);
  const [
    loadingForInviteAndUuidGeneration,
    setLoadingForInviteAndUuidGeneration,
  ] = useState(false);

  const [starBoardToggleModal, setstarBoardToggleModal] = useState(false);
  const [starBoardToggleModalForRemove, setstarBoardToggleModalForRemove] =
    useState(false);

  useEffect(() => {
    setTeamMembersInBoard([]);
  }, [router.query?.workspaceId]);

  const fetchTeamMembersHandler = async () => {
    const formData = new FormData();
    formData.append("board_uuid", boardUuid);
    try {
      const backendRes = await axios.post(
        `${backendDomainHandler()}/fetchTeamMembers`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(backendRes.data);
      if (backendRes.data?.length > 0) {
        setTeamMembersInBoard(backendRes.data);
      } else if (backendRes.data.message === "you are the only member") {
        console.log("in else io");
        setTeamMembersInBoard([
          {
            name: getCookiesNext("userName"),
            role: getCookiesNext("userRole"),
            user_id: getCookiesNext("userId"),
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const starAndUnstarBoardHandler = async (
    toStarOrUnstar,
    boardUuid,
    setIsOpen
  ) => {
    console.log(index, "indexxxxx");
    if (toStarOrUnstar === "starIt") {
      // setstarBoardToggleModal(true);
      const backendResponseOFStarringBoard =
        await sendAddingBoardsToFavouriteToBackendHandler(boardUuid, "starIt");
      if (!backendResponseOFStarringBoard) return;
      setUsersBoards((prev) => {
        const tempState = [...prev];
        tempState.find(
          (item) => item.board_uuid === boardUuid
        ).isStarred = true;
        return tempState;
      });
      setIsOpen(false);
    } else {
      setstarBoardToggleModalForRemove(true);
      const backendResponseOFStarringBoard =
        await sendAddingBoardsToFavouriteToBackendHandler(
          boardUuid,
          "unstarIt"
        );
      if (!backendResponseOFStarringBoard) return;
      if (accessedFrom === "workspaceIndexComp") { // doing this we'll just toggle off the switch but in else we'll remove the board from the list altogether
        setUsersBoards((prev) => {
          const tempState = [...prev];
          tempState.find(
            (item) => item.board_uuid === boardUuid
          ).isStarred = false;
          return tempState;
        });
      } else {
        setUsersBoards((prev) => {
          const tempState = [...prev];
          tempState.splice(index, 1);
          return tempState;
        });
      }

      setIsOpen(false);
    }
  };
  const sendAddingBoardsToFavouriteToBackendHandler = async (
    boardUuid,
    star_IT_OR_UnStarIt
  ) => {
    const formData = new FormData();
    formData.append("board_uuid", boardUuid);
    formData.append(
      "workspace_uuid",
      router.query.workspaceId ||
      workspaceUuidOnlyForFavouritesRouteToUnstarBoard
    );
    formData.append("user_id", getCookiesNext("userId"));
    formData.append("toStarOrUnstar", star_IT_OR_UnStarIt);
    try {
      const backendRes = await axios.post(
        `${backendDomainHandler()}/starOrUnStarBoard`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(backendRes.data);
      if (star_IT_OR_UnStarIt === "starIt") {
        toast({
          title: "Board Starred Successfully",
          description: "You can access this board in the favourites section",
        });
      } else {
        toast({
          title: "Board removed from favourites",
        });
      }

      return true;
    } catch (err) {
      console.log(err);
      toast({
        title: "An error occured while starring the board",
      });
      return false;
    }
  };
  const removeMemberFromBoardHandler = async () => {
    if (!userIdToRemove) return;
    const formData = new FormData();
    formData.append("board_uuid", boardUuid);
    formData.append("user_id", userIdToRemove);
    formData.append("workspace_uuid", router.query.workspaceId);
    formData.append("userThatIsRemoving", getCookiesNext("userId"));

    try {
      const backendRes = await axios.post(`${backendDomainHandler()}/removeMemberFromBoard`, formData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (backendRes.data.message === "Member removed successfully") {
        setTeamMembersInBoard((prev) => {
          const tempState = [...prev];
          tempState.splice(tempState.findIndex(item => item.user_id === userIdToRemove), 1)
          return tempState
        })
        toast({
          title: "Member removed successfully"
        })

        // fetchTeamMembersHandler()
        setIsModalToRemovememberFromBoardOpen(false)
      }
    }
    catch (err) {
      console.log(err);
      if (err?.response?.data?.error == "Only master admin can remove the member") {
        toast({
          title: "Only master admin can remove the member"
        })
        return

      }
      toast({
        title: "An error occured while removing the member"
      })
    }
  }

  const [isModalToRemovememberFromBoardOpen, setIsModalToRemovememberFromBoardOpen] = useState(false)
  const [nameOfMemberToRemove, setNameOfMemberToRemove] = useState("")
  const [userIdToRemove, setUserIdToRemove] = useState("")
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false)

  const deleteBoardHandler = async (boardNameParam, boardUuidParam, isBoardSharedParam) => {

    const formData = new FormData()
    formData.append("board_uuid", boardUuidParam)
    formData.append("workspace_uuid", router.query.workspaceId || workspaceUuidOnlyForFavouritesRouteToUnstarBoard)
    formData.append("user_id", getCookiesNext("userId"))
    formData.append("board_name", boardNameParam)
    if (isBoardSharedParam) formData.append("isShared", isBoardSharedParam)

    try {
      const backendRes = await axios.post(
        `${backendDomainHandler()}/deleteBoard`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(backendRes.data, 'backendRessssssss');
      if (backendRes.data.message === "Board deleted successfully") {
        toast({
          title: "Board deleted successfully"
        })
        setUsersBoards((prev) => {
          const tempState = [...prev];
          tempState.splice(index, 1);
          return tempState;
        });
        setLocalStorageFunction("boardDeleted", index, 2)
        const alertAfterDeletingBoard = new CustomEvent("alertAfterDeletingBoard")
        window.dispatchEvent(alertAfterDeletingBoard)
      }
    }
    catch (err) {
      console.log(err);
      if (err.response.data.error === "Only master admin can delete the board") {
        toast({
          title: "You are not the owner of this board ✋",
          description: "Only master admin can delete the board"
        })
        return
      } else {
        toast({
          title: "An error occured while deleting the board"
        })

      }
    }
  }

  return (
    <>
      <Dialog open={isOpen}>
        <DialogTrigger
          onClick={() => toggleAdditionalSettiontgsModal(index)}
        ></DialogTrigger>

        <DialogContent
          onEscapeKeyDown={() => {
            toggleAdditionalSettiontgsModal(index);

          }}
        >
          <div className="flex justify-end">
            <Cross1Icon
              onClick={() => toggleAdditionalSettiontgsModal(index)}
              className="cursor-pointer"
            />
          </div>
          <DialogHeader>
            {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
            <DialogDescription>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isBoardStarred}
                    onClick={() => {
                      console.log('ldasdsadasd');
                      if (!isBoardStarred) {
                        setstarBoardToggleModal(true);
                      } else {
                        setstarBoardToggleModalForRemove(true);
                      }
                    }}
                  />
                  <div>
                    <p className="text-sm text-white">Star this board</p>
                    <p className="text-xs">
                      Star the board and access it in starred section
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 cursor-pointer">
                  {/* <Switch /> */}
                  {/* <p className="text-3xl font-bold">+</p> */}
                  <AiOutlineUsergroupAdd className="text-3xl" />
                  <div
                    onClick={() => {
                      inviteMembersToBoardOrWorkspaceHandlerUniversal(
                        boardUuid,
                        setLoadingForInviteAndUuidGeneration,
                        toast,
                        "board",
                        30,
                        boardName,
                        router.query.workspaceId,
                        router.query.wokrspaceName
                      );
                    }}
                    className="ml-1"
                  >
                    <p className="text-sm text-white">Invite To Board</p>
                    <p className="text-xs">
                      Invite members to this board and start collaborating
                    </p>
                    <p className="text-xs text-red-600">
                      When You invite members to your board it will no longer be
                      private
                    </p>
                  </div>
                </div>
                {/* <LoadingSpinner /> */}

                <div className="flex flex-col">
                  {/* <Button className="mt-2">Apply Changes</Button> */}
                  <Button
                    onClick={() => {
                      if (teamMembersInBoard.length === 0)
                        fetchTeamMembersHandler();
                      setIsTeamMembersModalOpen(true);
                    }}
                  >
                    View Team members
                  </Button>
                  <Button onClick={() => setIsDeleteBoardModalOpen(!isDeleteBoardModalOpen)} variant="destructive" className="mt-2">
                    Delete Board
                  </Button>
                </div>
              </div>

              {/* view team members */}

              <CommandDialog open={isTeamMembersModalOpen}>
                <CommandInput placeholder="Search team members..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Team Members">
                    {teamMembersInBoard.length > 0 &&
                      teamMembersInBoard.map((item, index) => {
                        return (
                          <>
                            <CommandItem key={index}>
                              <div className="flex justify-between items-center w-full pr-2">
                                <div className="flex flex-col gap-1">
                                  <p>{item.name.replace(/[._]/g, " ")} </p>
                                  <p className="secondaryTextColorGray text-xs">
                                    {item.role.replace(/_/g, " ")}
                                  </p>
                                </div>
                                <TooltipProvider>
                                  <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                      <DeleteIcon
                                        className={`text-lg font-semibold ${item.role === "master_admin"
                                          ? "text-gray-500"
                                          : "text-red-500"
                                          }`}
                                        onClick={() => {
                                          if (item.role !== "master_admin") {
                                            setIsModalToRemovememberFromBoardOpen(true)
                                            setNameOfMemberToRemove(item.name)
                                            setUserIdToRemove(item.user_id)
                                          } else {
                                            toast({
                                              title: "Really bruh??",
                                              description: "He's litereally the master admin of this board",
                                            });
                                          }
                                        }}

                                      />
                                    </TooltipTrigger>
                                    <TooltipContent side={"left"}>
                                      {
                                        item.role === "master_admin"
                                          ? "Really bruh? He's the master admin"
                                          : "Remove member from board"
                                      }
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </CommandItem>

                            {isModalToRemovememberFromBoardOpen && <RemovingMemberFromBoardConfirmationModal
                              removeMemberFromBoardHandler={removeMemberFromBoardHandler}
                              nameOfMember={nameOfMemberToRemove}
                              isOpen={isModalToRemovememberFromBoardOpen}
                              setIopen={setIsModalToRemovememberFromBoardOpen}
                            />}

                          </>


                        );
                      })}
                  </CommandGroup>

                  <CommandGroup heading="End of the List">
                    {/* <CommandItem>
                      <div className="flex items-center gap-4 cursor-pointer">
         
                        <AiOutlineUsergroupAdd className="text-3xl" />
                        <div
                          onClick={() => {
                            inviteMembersToBoardOrWorkspaceHandlerUniversal(
                              boardUuid,
                              setLoadingForInviteAndUuidGeneration,
                              toast,
                              "board",
                              30,
                              boardName,
                              router.query.workspaceId,
                              router.query.wokrspaceName
                            );
                          }}
                          className="ml-"
                        >
                          <p className="text-sm text-white">Invite To Board</p>
                          {loadingForInviteAndUuidGeneration && (
                            <div className="flex w-full justify-end relative -top-1 left-3">
                              <LoadingSpinner />
                            </div>
                          )}
                          <p className="text-xs">
                            Invite members to this board and start collaborating
                          </p>
                        </div>
                      </div>
                    </CommandItem> */}
                  </CommandGroup>
                </CommandList>
              </CommandDialog>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <AddBoardToFavouritesModal
        isOpen={starBoardToggleModal}
        setIsOpen={setstarBoardToggleModal}
        // setIsPrivate={isBoardStarred}
        setUsersBoards={setUsersBoards}
        index={index}
        starAndUnstarBoardHandler={starAndUnstarBoardHandler}
        boardUuid={boardUuid}
      // allUserBoards={allUserBoards}
      // boardUuid={boardUuid}
      />

      <RemoveBoardToFavouritesModal
        isOpen={starBoardToggleModalForRemove}
        setIsOpen={setstarBoardToggleModalForRemove}
        setUsersBoards={setUsersBoards}
        index={index}
        boardUuid={boardUuid}
        starAndUnstarBoardHandler={starAndUnstarBoardHandler}
      />
      <DeletBoardConfirmationModal
        setIsDeleteBoardModalOpen={setIsDeleteBoardModalOpen}
        isDeleteBoardModalOpen={isDeleteBoardModalOpen}
        deleteBoardHandler={deleteBoardHandler}
        // deleteBoardHandler(boardName, boardUuid, isBoardShared)
        boardName={boardName}
        boardUuid={boardUuid}
        isBoardShared={isBoardShared}
      />
    </>
  );
};

export default AdditionalSettingsEachBoard;

const AddBoardToFavouritesModal = ({
  isOpen,
  setIsOpen,
  // setUsersBoards,
  index,
  starAndUnstarBoardHandler,
  boardUuid,
}) => {
  return (
    <AlertDialog open={isOpen}>
      {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="">
            Add this board to favourites?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Star marking this board adds it to your favourites
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              starAndUnstarBoardHandler("starIt", boardUuid, setIsOpen);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const RemovingMemberFromBoardConfirmationModal = ({ nameOfMember, removeMemberFromBoardHandler, isOpen, setIopen }) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            By clicking continue {nameOfMember} will be removed from the board
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIopen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={removeMemberFromBoardHandler}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const DeletBoardConfirmationModal = ({ setIsDeleteBoardModalOpen, isDeleteBoardModalOpen, deleteBoardHandler, boardName, boardUuid, isBoardShared }) => {
  return (
    <AlertDialog open={isDeleteBoardModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            By clicking continue this board will be deleted
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsDeleteBoardModalOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            deleteBoardHandler(boardName, boardUuid, isBoardShared)
            setIsDeleteBoardModalOpen(false)
          }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}