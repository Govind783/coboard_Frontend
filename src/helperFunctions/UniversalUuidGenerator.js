import { backendDomainHandler } from "@/generalConfig/BackendAndMiddlewareHelpers";
import axios from "axios";

export const generateUuidHandlerUniversal = async () => {
  const fromData = new FormData();
  fromData.append("validTill", 30);
  try {
    const uuid = await axios.post(
      `${backendDomainHandler()}/generate_Uuid`,
      fromData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(uuid);
    return uuid.data.uuid;
  } catch (err) {
    console.log(err, "in generatinmg  uuid");
    return null;
  }
};
