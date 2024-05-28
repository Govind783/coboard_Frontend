import { useToast } from "@/components/ui/use-toast";
import { getCookiesNext } from "@/cookies/cookiesConfig";
import { backendDomainHandler } from "@/generalConfig/BackendAndMiddlewareHelpers";
import axios from "axios";

export const createWorkspace_OR_Board = async (data) => {
    const toast = useToast();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("userId", getCookiesNext("userId"));
    formData.append("type", data.type);
    if (data.type === "board") formData.append("workspace_uuid", data.workspace_uuid);
    // const accessToken = await fetchAccessToken();
    try {
        const backendRES = await axios.post(`${backendDomainHandler()}/create`, formData, {
            'headers':{
                'Content-Type': "application/json",
                // 'Authorization': `Bearer ${accessToken}`
            }
        })
        if (backendRES.data.message === "SUCCESS") {
            window.location.reload()
        }else{
            toast({
                title: "Error",
                description: `An error occured in creating the ${data.type}`,
            })
        }
    }catch(err){
        toast({
            title: "Error",
            description: `An error occured in creating the ${data.type}`,
        })
    }
}