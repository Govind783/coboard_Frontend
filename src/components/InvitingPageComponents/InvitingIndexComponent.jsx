import React, { useState } from "react";
import { useRouter } from "next/router";
import { getCookiesNext, setCookiesNext } from "@/cookies/cookiesConfig";
import axios from "axios";
import { useEffect } from "react";
import { backendDomainHandler } from "@/generalConfig/BackendAndMiddlewareHelpers";
import LoadingSpinner from "../UI_Components/LoadingSpinner";
import avatarBoy1 from "../../assets/avatar1Boy.png";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Cross1Icon } from "@radix-ui/react-icons";
const InvitingIndexComponent = () => {
  const [loadingForValidation, setLoadingForValidation] = useState(true);
  const [invitersData, setInvitesData] = useState();
  const router = useRouter();
  const [errorState, setErrorState] = useState(false);
  const [isSameUserWarning, setIsSameUserWarning] = useState(false);
  console.log(router.query, "router");

  useEffect(() => {
    if (router.isReady) {
      if (getCookiesNext("userId") === router.query.invitersUuid) {
        setIsSameUserWarning(true);
      }
    }
  }, [router.isReady]);

  const validateInviteProcess = async () => {
    const fromData = new FormData();
    fromData.append("inviteUuid", router.query.inviteUuid);
    fromData.append("invitingToSourceUuid", router.query.invitingToSourceUuid);
    fromData.append("invitersUuid", router.query.invitersUuid);
    fromData.append("inviteToSource", router.query.inviteToSource);
    fromData.append("validTill", router.query.validTill);
    try {
      const backendRes = await axios.post(
        `${backendDomainHandler()}/validateInviteOnBoarding`,
        fromData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(backendRes, "backendRes");
      if (backendRes.data.data) {
        setInvitesData(backendRes.data.data);
      }
      // handle inficiducval if messages later that if invite is valid, if invbites is valuid, if the boatd or Ws is valid, if its not expired
      if (backendRes.data.message === "Invite is valid") {
        setLoadingForValidation(false);
        return;
      }
      if (backendRes.data.message === "uuid has expired") {
        setErrorState("Your invite has expired");
        setLoadingForValidation(false);
      }
      if (backendRes.data.message === "invite uuid does not exist") {
        setErrorState("Your invite Link is not valid");
        setLoadingForValidation(false);
      }
      if (
        backendRes.data.message === "no workspace found with the given uuid"
      ) {
        setErrorState("No workspace found with the given uuid");
        setLoadingForValidation(false);
      }
      if (backendRes.data.message === "no board found with the given uuid") {
        setErrorState("No board found with the given uuid");
        setLoadingForValidation(false);
      }
    } catch (err) {
      console.log(err, "error in validating invite");
      setLoadingForValidation(false);
    }
  };
  useEffect(() => {
    if (router.isReady && !isSameUserWarning) {
      validateInviteProcess();
    }
  }, [router.isReady]);

  //inviteToSource -> whether it is board or workspace
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[26rem] h-40 bg-[#020617] border border-[#565656] rounded-lg flex flex-col justify-center items-start pl-7">
        {invitersData && !isSameUserWarning ? (
          <div>
            <div className="flex items-center gap-5">
              <Image src={avatarBoy1} className="w-12  h-12  rounded-full" />
              <div>
                <p className=" capitalize">
                  {invitersData.invitersName.replace(/[_.]/g, " ")}
                </p>
                <p className="secondaryTextColorGray text-sm">
                  Has invited you to join their{" "}
                  {router.query.nameOfBoartOrWorkspace}{" "}
                  {router.query.inviteToSource}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`/api/auth/login?invitingToSourceUuid=${router.query.invitingToSourceUuid}&invitersUuid=${router.query.invitersUuid}&inviteToSource=${router.query.inviteToSource}&nameOfBoartOrWorkspace=${router.query.nameOfBoartOrWorkspace}&workSpaceUuid=${router.query.workSpaceUuid}&worksapceName=${router.query.worksapceName}&inviteUuid=${router.query.inviteUuid}`}
              >
                <Button>Join Now</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>{!errorState && !isSameUserWarning && <LoadingSpinner />}</div>
        )}
        {errorState && (
          <div className="w-full">
            <div className="w-[90%] justify-center flex items-center gap-4">
              <Cross1Icon className="w-5 h-5 text-red-500" />
              {errorState}
            </div>
            <div className="w-[90%] mt-4 flex justify-center">
              <Link href={"/"}>
                <Button>Go Back</Button>
              </Link>
            </div>
          </div>
        )}
        {isSameUserWarning && (
          <div className="w-full">
            <div className="w-[90%] justify-center flex items-center gap-4">
              <Cross1Icon className="w-5 h-5 text-red-500" />
              You cannot invite yourself send the invite to someone else
            </div>
            <div className="w-[90%] mt-4 ml-8">
              <Link href={"/"}>
                <Button>Go Back</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitingIndexComponent;

// validate invitte uuid 1) is it even correct and if it is correct then 2) is it expired or not
// valudate source uuid borad uuid or workspace uuid
// validate inviters uuid
