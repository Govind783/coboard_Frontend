import React, { useEffect, useState } from "react";
import mirioLogo from "../../assets/miroLogo2.png";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa6";
import {
  getCookiesNext,
  getLocalStorageFunction,
  setCookiesNext,
} from "@/cookies/cookiesConfig";
import TooltipComponent from "../UI_Components/TooltipComponent";
import { ModalToCreateWS_or_Board } from "../UI_Components/ModalToCreateWS_Or_Board";
import { useRouter } from "next/router";

const WorkspaceSidebar = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [boards, setBoards] = useState([]);
  const { user, error, isLoading } = useUser();
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [openModalToCreateWS_orBoard, setOpenModalToCreateWS_orBoard] =
    useState(false);

  const router = useRouter();
  const gradientColors = [
    "linear-gradient(to bottom, #2c3e50, #1e272e)",
    "linear-gradient(to bottom, #34495e, #2c3e50)",
    "linear-gradient(to bottom, #2c3e50, #1f2833)",
    "linear-gradient(to bottom, #2c3e50, #34495e)",
    "linear-gradient(to bottom, #34495e, #283747)",
    "linear-gradient(to bottom, #283747, #1f2833)",
    "linear-gradient(to bottom, #1f2833, #2c3e50)",
    "linear-gradient(to bottom, #485460, #283747)",
    "linear-gradient(to bottom, #1f2833, #485460)",
    "linear-gradient(to bottom, #485460, #2c3e50)",
    "linear-gradient(to bottom, #2c3e50, #485460)",
    "linear-gradient(to bottom, #485460, #34495e)",
    "linear-gradient(to bottom, #34495e, #485460)",
    "linear-gradient(to bottom, #283747, #34495e)",
    "linear-gradient(to bottom, #34495e, #283747)",
    "linear-gradient(to bottom, #1f2833, #34495e)",
    "linear-gradient(to bottom, #34495e, #1f2833)",
    "linear-gradient(to bottom, #1e272e, #485460)",
    "linear-gradient(to bottom, #485460, #1e272e)",
    "linear-gradient(to bottom, #1f2833, #1e272e)",
  ];

  useEffect(() => {
    if (user && getLocalStorageFunction("userWorkspaces")) {
      console.log(JSON.parse(getLocalStorageFunction("userWorkspaces")), "s");
      setWorkspaces(JSON.parse(getLocalStorageFunction("userWorkspaces")));
    }
  }, [user]);
  useEffect(() => {
    if (router.isReady && router.query?.workspaceId) {
      setActiveWorkspace((prev) => {
        return JSON.parse(
          getLocalStorageFunction("userWorkspaces")
        )?.workspace_details?.find(
          (item) => item.workspace_uuid == router.query.workspaceId
        );
      });
    }
  }, [router.query?.workspaceId]);

  return (
    <div className="h-full">
      <div className="flex w-full h-[90%]">
        <div className="px-3  border-r border-slate-800">
          <div className="flex flex-col items-center gap-6 pt-8">
            {workspaces?.workspace_details?.map((item, index) => {
              return (
                <TooltipComponent
                key={index}
                  label={
                    <div
                      onClick={() => {
                        router.push({
                          pathname: "/Workspace",
                          query: {
                            workspaceId: item.workspace_uuid,
                            wokrspaceName: item.title,
                          },
                        });
                      }}
                      style={{
                        backgroundImage: gradientColors[index],
                      }}
                      className={` flex items-center ${
                        router.query?.workspaceId == item.workspace_uuid &&
                        "border border-gray-400"
                      }  capitalize justify-center rounded-md w-12 h-12 text-white`}
                    >
                      {item?.title[0]}
                    </div>
                  }
                  content={item.title}
                />
              );
            })}

            <TooltipComponent
              label={
                <div
                  style={{
                    backgroundImage: gradientColors[13],
                  }}
                  className={` flex items-center text-lg justify-center rounded-md w-12 h-12 text-white`}
                  onClick={() => router.push(`/starred`)}
                >
                  ⭐
                </div>
              }
              content={"Starred Boards ⭐"}
            ></TooltipComponent>
            <TooltipComponent
              label={
                <div
                  style={{
                    backgroundImage: gradientColors[3],
                  }}
                  className={` flex items-center justify-center rounded-md w-12 h-12 text-white`}
                  onClick={() => setOpenModalToCreateWS_orBoard(true)}
                >
                  <FaPlus className="text-2xl" />
                </div>
              }
              content={"New Workspace"}
            ></TooltipComponent>
          </div>
        </div>

        {/* <div className="w-fit pr-3 h-full  border-r border-slate-800">
                    <div className="flex flex-col w-full h-full gap-5">
                        <div className=' overflow-x-hidden'>
                            <Image src={mirioLogo} className='w-auto' alt="Miro Logo" />
                        </div>
                        <div className=" relative pt-8">
                            <div className=' pl-3'>
                                <Select defaultValue='Anarata'>
                                    <SelectTrigger className="w-[180px] h-12">
                                        <SelectValue placeholder="Workspace" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem className="mb-1" value="Anarata">
                                            <div className="flex items-center gap-2">
                                                <div style={{
                                                    backgroundImage: gradientColors[0],
                                                }}
                                                    className={` flex items-center justify-center rounded-md w-8 h-8 text-white`}>
                                                    A
                                                </div>
                                                <p>Anarata</p>
                                            </div>
                                        </SelectItem>
                                        <SelectItem className="mb-1" value="Blanko">
                                            <div className="flex items-center gap-2">
                                                <div style={{
                                                    backgroundImage: gradientColors[1],
                                                }}
                                                    className={` flex items-center justify-center rounded-md w-8 h-8 text-white`}>
                                                    B
                                                </div>
                                                <p>Blanko</p>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Ciaz">
                                            <div className="flex items-center gap-2">
                                                <div style={{
                                                    backgroundImage: gradientColors[3],
                                                }}
                                                    className={` flex items-center justify-center rounded-md w-8 h-8 text-white`}>
                                                    C
                                                </div>
                                                <p>Ciaz</p>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>

                            <div className="flex justify-start pl-5 mt-6 cursor-pointer items-center gap-2 hover-fill-white">
                                <FiStar className='transition-all ease-in duration-300 FiStar' />
                                <p className='underline-animation'>Favourite Boards</p>
                            </div>
                        </div>

                    </div>
                </div> */}
      </div>
      {openModalToCreateWS_orBoard && (
        <ModalToCreateWS_or_Board
          typeOfCreation={"workspace"}
          openModalToCreateWS_orBoard={openModalToCreateWS_orBoard}
          setOpenModalToCreateWS_orBoard={setOpenModalToCreateWS_orBoard}
        />
      )}

      <div
        style={{
          backgroundImage: gradientColors[14],
        }}
        className={` flex items-center   capitalize justify-center rounded-md w-12 h-12 text-white ml-2 cursor-pointer`}
      >
        {activeWorkspace?.title.charAt(0)}
      </div>
    </div>
  );
};

export default WorkspaceSidebar;
