import { getCookiesNext } from "@/cookies/cookiesConfig";
import { generateUuidHandlerUniversal } from "../UniversalUuidGenerator";
import copy from "copy-to-clipboard";

export const inviteMembersToBoardOrWorkspaceHandlerUniversal = async (
  invitingToUuid,
  setLoadingState,
  toast,
  inviteToSource,
  validityDuration,
  nameOfBoartOrWorkspace,
  workSpaceUuid,
  worksapceName
) => {
  // invitingToUuid can either be board uuid or workspace uuid
  // inviteToSource can either be board or workspace

  //workSpaceUuid, worksapceName -> need it when inviting to board to avoid DB calls

  setLoadingState(true);
  const inviteUuidBackendRes = await generateUuidHandlerUniversal();
  console.log(inviteUuidBackendRes, "uuid res generaorter from backend");
  if (!inviteUuidBackendRes) return;
  // const inviteLinkForMembers = `${window.location.origin}/${inviteUuidBackendRes}/${getCookiesNext("userId")}/${invitingToUuid}`
  const inviteLink = `${
    window.location.origin
  }/invite?inviteUuid=${inviteUuidBackendRes}&invitingToSourceUuid=${invitingToUuid}&invitersUuid=${getCookiesNext(
    "userId"
  )}&inviteToSource=${inviteToSource}&validTill=${validityDuration}&nameOfBoartOrWorkspace=${nameOfBoartOrWorkspace}&workSpaceUuid=${workSpaceUuid}&worksapceName=${worksapceName}`;
  copy(inviteLink);
  setLoadingState(false);
  toast({
    title: "Invite url copied to clipboard",
    description: "The link is vald for 30 minutes",
  });
};
// and this thing  can be reused in the code universally
