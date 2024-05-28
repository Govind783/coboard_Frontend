import { deleteCookiesAndLocalStorageUniversalFN } from "@/cookies/cookiesConfig"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/router"


export const backendDomainHandler = () => {
  return 'http://127.0.0.1:5000'
}

// export async function fetchAccessToken() {
// const toast  = useToast()
// const router = useRouter()

//   const response = await fetch('/api/token');
//   console.log(response);
//   if (!response.ok) {
//     // make the user re login if the token is expired
//     localStorage.clear()
//     deleteCookiesAndLocalStorageUniversalFN("userId", 'appSession', 'userAvatar', 'user_email', 'userName', 'userRole', 'userEmail')
//     toast({
//       title: "Login Expired",
//       description: "Please login again",
    
//     })
//     router.push("/api/auth/logout")
//   }
//   const data = await response.json();
//   return data.accessToken;
// }

