import WorkspaceSidebar from "@/components/WorkspaceComponents/WorkspaceSidebar";
import React from "react";

import axios from "axios";
import { backendDomainHandler } from "@/generalConfig/BackendAndMiddlewareHelpers";
import { useRouter } from "next/router";
import { getCookiesNext, setCookiesNext } from "@/cookies/cookiesConfig";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/UI_Components/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import team1 from "../../assets/team1.jpg";
import team2 from "../../assets/team2.jpg";
import team3 from "../../assets/team3.jpg";
import team4 from "../../assets/team4.jpg";
import team5 from "../../assets/team5.jpg";
import team6 from "../../assets/team6.jpg";
// import team7 from "../../assets/team7.jpg";
import team8 from "../../assets/team8.jpg";
import team9 from "../../assets/team9.jpg";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import AdditionalSettingsEachBoard from "@/components/WorkspaceComponents/AdditionalSettingsEachBoard";
import { Button } from "@/components/ui/button";
import emptyImage from "../../assets/emptyImageDog.png"
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

const FavouritesBoardIndexPage = () => {
  const router = useRouter();
  const [favouriteBoards, setfavouriteBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const domiain = backendDomainHandler();
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
    const fetchFavouriteBoards = async () => {
      const userId = getCookiesNext("userId");

      const formData = new FormData();
      formData.append("user_id", userId);
      try {
        const response = await axios.post(
          `${domiain}/fetchFavouriteBoards`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setLoading(false);
        if (response.data.data.length > 0) {
          const finalDataWithImage = response.data.data.map((item) => {
            return {
              ...item,
              illustartion:
                listOfTeamIllustartionsForBoards[Math.floor(Math.random() * 8)],
              isOpen: false,
            };
          });
          setfavouriteBoards(finalDataWithImage);
        } else {
          // setError("You have not Starred any boards yet");
        }
      } catch (error) {
        console.log(error);
        setError("An error occured while fetching your favourite boards");
        setLoading(false);
      }
    };
    fetchFavouriteBoards();
  }, []);
  return (
    <div className="w-full h-full flex">
      {loading && (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-4xl">{error}</h1>
        </div>
      )}
      {!loading && !error && favouriteBoards.length > 0 && (
        <div className="mt-8 ml-10">
          <p className="text-5xl mb-4 relative linear-wipe text-left" style={{ textAlign: "left" }}>
            Favourites
          </p>
          <Breadcrumb className="mb-9">
            <BreadcrumbList>
              {/* <BreadcrumbItem>
                <Link
                  className="hover:text-slate-950 transition-all ease-in duration-150 dark:hover:text-slate-50"
                  href="/"
                >
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator /> */}
              <BreadcrumbItem>
                <Link
                  className="hover:text-slate-950 transition-all ease-in duration-150 dark:hover:text-slate-50"
                  href="/Workspace"
                >
                  Workspace
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link
                  className="hover:text-slate-950 transition-all ease-in duration-150 dark:hover:text-slate-50"
                  href="/starred"
                >
                  Favourites
                </Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap items-center gap-7">
            {favouriteBoards.map((board, index) => {
              return (
                <div
                  key={index}
                  className="w-72 h-96 rounded-md border-slate-500 border"
                >
                  <div className="w-full h-full flex-col flex justify-start p-2 items-center">
                    <Image
                      src={board.illustartion}
                      quality={100}
                      alt="illustartion"
                      className="rounded-md h-80"
                      width={300}
                      height={300}
                    />
                    <div className="w-full items-center mt-1 gap-2 flex">
                      <p className="text-lg text-left">{board.title}</p>
                      <IoSettingsOutline
                        onClick={() => {
                          setfavouriteBoards((prev) => {
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
                  <AdditionalSettingsEachBoard
                    setUsersBoards={setfavouriteBoards}
                    isOpen={board.isOpen}
                    index={index}
                    boardUuid={board.board_uuid}
                    boardName={board.title}
                    isBoardStarred={board.isStarred}
                    allUserBoards={favouriteBoards}
                    workspaceUuidOnlyForFavouritesRouteToUnstarBoard={board.assosiatedWorkspace_uuid}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {
        !loading && !error && favouriteBoards.length === 0 && (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl">Wow such empty</h1>
                <Image src={emptyImage} quality={100} className="w-20 h-20 rounded-full" />
              </div>
              <Button>
                <Link className="w-full h-full flex justify-center items-center" href={'/Workspace'}>
                  Go to Workspace
                </Link>
              </Button>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default withPageAuthRequired(FavouritesBoardIndexPage)
