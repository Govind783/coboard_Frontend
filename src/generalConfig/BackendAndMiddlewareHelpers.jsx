export const backendDomainHandler = () => {
  if(typeof window !== 'undefined') {
    if(window.location.hostname === 'localhost') {
      return "http://127.0.0.1:5001"
    }else{
      return process.env.BACKEND_URL // vercel not updating url?
    }
  }
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

