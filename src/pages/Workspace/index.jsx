import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { RocketIcon } from "@radix-ui/react-icons";
import WorkspaceIndexComponent from "@/components/WorkspaceComponents/WorkspaceIndexComponent";
import WorkspaceModalWhenData_IsEmpty from "@/components/WorkspaceComponents/WorkspaceModalWhenData_IsEmpty";
import { backendDomainHandler } from "@/generalConfig/BackendAndMiddlewareHelpers";
import axios from "axios";
import {
  setCookiesNext,
  setLocalStorageFunction,
} from "@/cookies/cookiesConfig";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton"

const WorkspaceManagerIndex = () => {
  const { user, error, isLoading } = useUser();
  const { toast } = useToast();
  const [
    doesUsersWorkspaceAndBoardsExist,
    setdoesUsersWorkspaceAndBoardsExist,
  ] = useState(true); // FALSE 🌟🌟🌟🌟🌟🌟🌟
  const [flagToRender, setFlagToRender] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const checkIfUserExistsAndFetchWorkSpaces = async () => {
    const formData = new FormData();
    formData.append("sub", user?.sub);
    // const accessToken = await fetchAccessToken()
    const backendDomain = backendDomainHandler();
    setLoading(true);
    try {
      const backendResponse = await axios.post(
        `${backendDomain}/fetchUsersWorkspaces`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      // console.log(backendResponse);
      if (backendResponse.data.message === "bothExist") {
        console.log(backendResponse.data);
        setdoesUsersWorkspaceAndBoardsExist(true);
        // setCookiesNext("userWorkspaces", JSON.stringify(backendResponse.data.data.workspace_name))
        // setCookiesNext("userBoards", JSON.stringify(backendResponse.data.data.board_name))
        setLocalStorageFunction(
          "userWorkspaces",
          JSON.stringify(backendResponse.data.data),
          2
        );
        // setLocalStorageFunction("userBoards", JSON.stringify(backendResponse.data.data.board_name), 2)
        setCookiesNext("userAvatar", backendResponse.data.data.user_avatar);
        setCookiesNext("userName", backendResponse.data.data.name);
        setCookiesNext("userEmail", backendResponse.data.data.email);
        setCookiesNext("userId", backendResponse.data.data.user_id);
        setCookiesNext("userRole", backendResponse.data.data.role);
        // setCookiesNext("currentActiveWorkspace", backendResponse.data.data.workspace_details[0].workspace_uuid)
        router.push({
          pathname: "/Workspace",
          query: {
            workspaceId:
              backendResponse.data.data.workspace_details[0].workspace_uuid,
            wokrspaceName: backendResponse.data.data.workspace_name
          },
        });
        setFlagToRender(true);
      } else {
        setdoesUsersWorkspaceAndBoardsExist(false);
        setFlagToRender(true);
      }
      // console.log(backendResponse.data);
    } catch (err) {
      setLoading(false);
      console.log(err, "catch block");
      if (err.response.data.message === "User not found") {
        setdoesUsersWorkspaceAndBoardsExist(false);
      } else {
        toast({
          title: "Error loading Workspaces",
          variant: "destructive",
        })
      }

    }
  };

  useEffect(() => {
    if (user?.email) {
      setCookiesNext("user_email", user?.email);
      setCookiesNext("userName", user?.name);
    }
  }, []);

  useEffect(() => {
    checkIfUserExistsAndFetchWorkSpaces();
  }, [user.email]);

  return (
    <div className="w-full h-full">
      {/* <div>
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
            </div> */}
      {
        loading && <div className="w-full h-full flex justify-center items-center">
          <LoadingSkeleton />
        </div>
      }
      {doesUsersWorkspaceAndBoardsExist ? (
        <WorkspaceIndexComponent flagToRender={flagToRender} />
      ) : (
        <WorkspaceModalWhenData_IsEmpty
          successfullyONBoardered={doesUsersWorkspaceAndBoardsExist}
          setSuccessFullyOnBoarded={setdoesUsersWorkspaceAndBoardsExist}
        />
      )}
    </div>
  );
};

export default withPageAuthRequired(WorkspaceManagerIndex);

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-12 gap-x-40">
      {
        Array.from({ length: 8 }).map((_, index) => {
          return (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )
        })
      }
    </div>
  )
}