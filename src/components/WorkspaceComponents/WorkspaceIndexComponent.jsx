import React from "react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import {
  deletCookiesNext,
  deleteCookiesAndLocalStorageUniversalFN,
  getCookiesNext,
  getLocalStorageFunction,
  setLocalStorageFunction,
} from "@/cookies/cookiesConfig";
import { Button } from "../ui/button";
import Link from "next/link";
import { FaMinus, FaPlus } from "react-icons/fa6";

import { useUser } from "@auth0/nextjs-auth0/client";
// import { getAccessToken } from '@auth0/nextjs-auth0'
// import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
// import { backendDomainHandler } from "@/generalConfig/BackendAndMiddlewareHelpers";
import team1 from "../../assets/team1.jpg";
import team2 from "../../assets/team2.jpg";
import team3 from "../../assets/team3.jpg";
import team4 from "../../assets/team4.jpg";
import team5 from "../../assets/team5.jpg";
import team6 from "../../assets/team6.jpg";
// import team7 from "../../assets/team7.jpg";
import team8 from "../../assets/team8.jpg";
import team9 from "../../assets/team9.jpg";

import { IoSettingsOutline } from "react-icons/io5";
// import { Switch } from "@/components/ui/switch";
import { FaMinusCircle, FaRegStar } from "react-icons/fa";
// import axios from "axios";
// import { Input } from "postcss";
// import { toast } from "../ui/use-toast";
import { ModalToCreateWS_or_Board } from "../UI_Components/ModalToCreateWS_Or_Board";
import { useRouter } from "next/router";
import emptyDataIllustartion from "../../assets/boardsDataIsEmpty.jpg";
// import { inviteMembersToBoardOrWorkspaceHandlerUniversal } from "@/helperFunctions/invitingToWorkspaceOrBoard/InviteLinkGneration";
import { arrayOfImages } from "@/helperFunctions/assignUserAavatar";
// import { DeleteIcon } from "lucide-react";
// import TooltipComponent from "../UI_Components/TooltipComponent";
import AdditionalSettingsEachBoard from "./AdditionalSettingsEachBoard";

const WorkspaceIndexComponent = ({ flagToRender, successfullyONBoardered }) => {
  const { user, error, isLoading } = useUser();

  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [currentUsersRole, setCurrentUsersRole] = useState("");
  const [usersBoards, setUsersBoards] = useState([]);
  const [openModalToCreateWS_orBoard, setOpenModalToCreateWS_orBoard] =
    useState(false);
  const router = useRouter();

  const listOfTeamIllustartionsForBoards = [
    team1,
    team2,
    team3,
    team4,
    team5,
    team6,
    // team7,
    team8,
    team9,
  ];

  useEffect(() => {
    if (!user.email) return;
    setUserAvatar(arrayOfImages[getCookiesNext("userAvatar") - 1]);

    // fetchAccessToken()

    setUserName(getCookiesNext("userName"));
    setUserEmail(getCookiesNext("userEmail"));
    setCurrentUsersRole(getCookiesNext("userRole"));
  }, [flagToRender, successfullyONBoardered]);

  useEffect(() => {
    // console.log("asdsadasdd");
    if (router.isReady && flagToRender && router.query.workspaceId) {
      if (!getLocalStorageFunction("userWorkspaces")) return;
      // setUsersBoards(JSON.parse(getLocalStorageFunction("userWorkspaces")));
      const allWorkspacesandBoardsData = JSON.parse(
        getLocalStorageFunction("userWorkspaces")
      );
      // console.log(allWorkspacesandBoardsData, "allWorkspacesandBoardsData");
      const details_Of_Current_Workspace =
        allWorkspacesandBoardsData.workspace_details.find(
          (item) => item.workspace_uuid === router.query.workspaceId
        );
      // console.log(details_Of_Current_Workspace, "details_Of_Current_Workspace");
      if (!details_Of_Current_Workspace) return;
      console.log('ran post delete?????????');
      setUsersBoards(details_Of_Current_Workspace.userBoards);

      //   illustartion:
      //   listOfTeamIllustartionsForBoards[Math.floor(Math.random() * 9)],
      // isOpen: false,
      setUsersBoards((prev) => {
        const tempState = [...prev];
        tempState.forEach((item) => {
          item.illustartion =
            listOfTeamIllustartionsForBoards[Math.floor(Math.random() * 8)];
          item.isOpen = false;
        });
        return tempState;
      });
    }
  }, [flagToRender, router.query.workspaceId]);


  useEffect(() => {
    const handleStorageUpdate = () => {
      const boardToRemoveStr = getLocalStorageFunction("boardDeleted");
      const boardToRemove = Number(boardToRemoveStr);
      const rawData = JSON.parse(getLocalStorageFunction("userWorkspaces"));
      rawData.workspace_details.forEach((item) => {
        if (item.workspace_uuid === router.query.workspaceId) {
          item.userBoards = item.userBoards.filter((_, index) => index !== boardToRemove);
        }
      });
      setLocalStorageFunction("userWorkspaces", JSON.stringify(rawData), 20);
    }

    window.addEventListener('alertAfterDeletingBoard', handleStorageUpdate);

    return () => {
      window.removeEventListener('alertAfterDeletingBoard', handleStorageUpdate);
    };
  }, []);

  return (
    <div className="w-full h-full flex">
      {flagToRender && (
        <WorkspaceSidebar successfullyONBoardered={successfullyONBoardered} />
      )}
      {flagToRender && (
        <div className="w-[93.5%] h-full pl-6 overflow-auto workspaceDashboardParentDiv">
          <div className="w-full pr- pt-1 flex justify-end sticky top-0 z-20">
            <div className="flex items-center gap-5">
              {/* <div className="flex cursor-pointer items-center gap-2">
                <FaPlus className="text-lg" />
                <p className="underline-animation">Invite To Workspace</p>
              </div> */}
              <Popover>
                <PopoverTrigger>
                  <Image
                    src={userAvatar}
                    alt="user avatar"
                    className="w-[2.8rem] cursor-pointer h-[2.8rem] rounded-full hover:p-[2.5px] hover:border-white hover:border transition-all ease-in duration-150 mt-6"
                  />
                </PopoverTrigger>
                <PopoverContent className="dark:border-slate-500 dark:bg-black mr-1 mt-2">
                  <section>
                    <div className="text-sm secondaryTextColorGray capitalize">
                      {userName}, {currentUsersRole?.replace(/_/g, " ")}
                    </div>
                    <p className="text-sm mt-1 secondaryTextColorGray">
                      {userEmail}
                    </p>
                  </section>
                  <Link
                    onClick={() => {
                      deleteCookiesAndLocalStorageUniversalFN(
                        "userEmail",
                        "userAvatar",
                        "userName",
                        "userRole",
                        "userWorkspaces",
                        "userBoards",
                        "userId",
                        "currentActiveWorkspace"
                      );
                    }}
                    href={"/api/auth/logout"}
                  >
                    <Button className="font-semibold h-[1.8rem] mt-3">
                      Logout
                    </Button>
                  </Link>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="text-4xl mt-3">
            Your
            <span className="ml-4 linear-wipe">Boards</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-7">
            <div className=" ">
              <div className="w-72 h-[26rem] rounded-md border-slate-500 border">
                <div className="w-full h-full flex-col flex justify-center items-center">
                  <FaPlus
                    onClick={() =>
                      setOpenModalToCreateWS_orBoard(
                        !openModalToCreateWS_orBoard
                      )
                    }
                    className="text-5xl cursor-pointer"
                  />
                  <p
                    onClick={() =>
                      setOpenModalToCreateWS_orBoard(
                        !openModalToCreateWS_orBoard
                      )
                    }
                    className="text-lg text-center w-full mt-1 cursor-pointer"
                  >
                    Create New Board
                  </p>
                </div>
              </div>
            </div>

            {usersBoards.length === 0 ? (
              <div className="w-72 h-96 rounded-md border-slate-500 border">
                <div className="w-full h-full flex-col flex justify-start p-2 items-center">
                  <Image
                    src={emptyDataIllustartion}
                    quality={100}
                    alt="illustartion"
                    className="rounded-md h-64"
                  />
                  <div className="w-full items-center flex-col mt-3 gap-2 flex">
                    <FaMinusCircle className="text-white text-5xl cursor-pointer" />
                    <p className="secondaryTextColorGray">
                      You have not created any boards
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {usersBoards?.map((board, index) => {
                  return (
                    <div
                      key={index}
                      className="w-72 h-[26rem] rounded-md border-slate-500 border"
                    >
                      <div className="w-full h-full flex-col flex justify-between p-2 items-end">
                        <div>
                          <Image
                            src={board.illustartion}
                            quality={100}
                            alt="illustartion"
                            className="rounded-md h-80"
                          />
                          <div className="w-full items-center mt-1 gap-2 flex">
                            <p className="text-lg text-left">{board.title}</p>
                            <IoSettingsOutline
                              onClick={() => {
                                setUsersBoards((prev) => {
                                  const tempState = [...prev];
                                  tempState[index] = {
                                    ...tempState[index],
                                    isOpen: !board.isOpen,
                                  };
                                  return tempState;
                                });
                              }}
                              className="text-white text-xl cursor-pointer"
                            />
                          </div>
                        </div>
                        <Link onClick={() => {
                          sessionStorage.setItem("isBoardShared", board.sharedBoard_id || "false")
                        }} href={`/Workspace/${router.query.workspaceId}/${board.board_uuid}`}>
                          <Button variant="secondary">Open</Button>
                        </Link>

                      </div>
                      <AdditionalSettingsEachBoard
                        setUsersBoards={setUsersBoards}
                        isOpen={board.isOpen}
                        index={index}
                        boardUuid={board.board_uuid}
                        boardName={board.title}
                        isBoardStarred={board.isStarred}
                        allUserBoards={usersBoards}
                        accessedFrom={"workspaceIndexComp"}
                        isBoardShared={board.sharedBoard_id || false}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
      {openModalToCreateWS_orBoard && (
        <ModalToCreateWS_or_Board
          openModalToCreateWS_orBoard={openModalToCreateWS_orBoard}
          typeOfCreation="board"
          setOpenModalToCreateWS_orBoard={setOpenModalToCreateWS_orBoard}
        />
      )}

    </div>
  );
};

export default WorkspaceIndexComponent;

// 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟




