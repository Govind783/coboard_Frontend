import React, { useState } from "react";
// index page for workspace manager
// where i see the dashboard
// the left side bar with all the workspaces and boards
// the right side with the details of the workspace and created boards in that workspace
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

const WorkspaceManagerIndex = () => {
  const { user, error, isLoading } = useUser();
  const { toast } = useToast();
  const [
    doesUsersWorkspaceAndBoardsExist,
    setdoesUsersWorkspaceAndBoardsExist,
  ] = useState(true); // FALSE 🌟🌟🌟🌟🌟🌟🌟
  const [flagToRender, setFlagToRender] = useState(false);
  const router = useRouter();

  const checkIfUserExistsAndFetchWorkSpaces = async () => {
    const formData = new FormData();
    formData.append("sub", user?.sub);
    // const accessToken = await fetchAccessToken()
    const backendDomain = backendDomainHandler();
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
      console.log(backendResponse);
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
      console.log(backendResponse.data);
    } catch (err) {
      console.log(err, "CETCH BLOCLMERR");

      // toast({
      //     title: "Error",
      //     description: "An error occured in fetching your workspaces",
      // })
    }
  };

  useEffect(() => {
    if (user?.email) {
      setCookiesNext("user_email", user?.email);
      setCookiesNext("userName", user?.name);
    }
  }, []);

  useEffect(() => {
    console.log("user effect ran");
    checkIfUserExistsAndFetchWorkSpaces();
  }, [user.email]);

  return (
    <div className="w-full h-full">
      {/* <div>
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
            </div> */}
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
// .data.data
// {
//     "_id": "65c7aa40cf2789eaa78e8e5f",
//     "board_name": [
//         "expirement"
//     ],
//     "email": "govindganeriwal@gmail.com",
//     "name": "Govind",
//     "sub": "google-oauth2|115319505565704843057",
//     "teamMembers": [],
//     "user_avatar": "12",
//     "user_id": "5fe6981d1b68489c8243567ee9b21d72",
//     "workspace_name": [
//         "MyClan"
//     ]
// }
