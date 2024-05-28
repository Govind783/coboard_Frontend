import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { backendDomainHandler } from "@/generalConfig/BackendAndMiddlewareHelpers";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/UI_Components/LoadingSpinner";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  arrayOfImages,
  randomizeUsersAvatar,
} from "@/helperFunctions/assignUserAavatar";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
const PostInviteAcceptanceIndexPage = () => {
  const [loadingForValidation, setLoadingForValidation] = useState(true);
  const [invitersData, setInvitesData] = useState();
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [errState, setErrState] = useState(false);
  const [errorMessage, setErrorMesasge] = useState("Some Error Occured");

  const completeUsersInviteAcceptance = async () => {
    const formData = new FormData();
    formData.append("invite_uuid", router.query.inviteUuid);
    formData.append("InvitedTOWorkspaceOrBoard", router.query.inviteToSource);
    formData.append("soucre_uuid", router.query.invitingToSourceUuid);
    formData.append("source_name", router.query.nameOfBoartOrWorkspace);
    formData.append("role", "write_access");
    if (router.query.inviteToSource === "board") {
      formData.append("workspace_uuid", router.query.workSpaceUuid); // need them specifically when inviting to board.
      formData.append("workspace_name", router.query.worksapceName); // need them specifically when inviting to board.
    }
    formData.append("email", user.email);
    formData.append("sub", user.sub);
    formData.append("name", user.nickname);
    formData.append("inviters_Uuid", router.query.invitersUuid);
    formData.append("user_avatar", randomizeUsersAvatar());
    try {
      const backendRes = await axios.post(
        `${backendDomainHandler()}/AcceptInviedUser`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(backendRes.data, "backendRes");
      if (backendRes.data.message === "SUCCESS") {
        setLoadingForValidation(false);
        toast({
          title: "Invite Accepted",
          description: "You have successfully accepted the invite",
        });
        router.push("/Workspace");
        // setInvitesData(res.data.invitersData);
      }
    } catch (error) {
      setErrState(true);
      setLoadingForValidation(false);

      if (error.response.data.message === "User is already part of the board") {
        setErrorMesasge("You are already part of this board");
      }
      console.log(error);
    }
  };
  useEffect(() => {
    if (router.isReady && user) {
      // console.log(router.query, "router");
      completeUsersInviteAcceptance();
    }
  }, [router.isReady, user]);

  return (
    <div className="w-full h-full">
      <div
        className={`w-full h-full items-center flex justify-center ${
          errState ? "flex-col" : ""
        }`}
      >
        {!errState ? (
          <div className="flex items-center gap-3">
            <p>Setting Up and Redirecting</p>
            <div className="relative -top-3">
              <LoadingSpinner />
            </div>
          </div>
        ) : (
          <>
            <p className="text-xl">{errorMessage}</p>

            <Link href="/" className="mt-2">
              <Button>Tap to go back</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PostInviteAcceptanceIndexPage;
