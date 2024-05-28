import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
// import  UserProvider  from "@auth0/nextjs-auth0"
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }) {
  // console.log(UserProvider());

  return (
    <UserProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
          <Component {...pageProps} />
        <Toaster />
      </ThemeProvider>
    </UserProvider>
  );
}

// /api/auth/login: The route used to perform login with Auth0.
// /api/auth/logout: The route used to log the user out.
// /api/auth/callback: The route Auth0 will redirect the user to after a successful login.
// /api/auth/me: The route to fetch the user profile from.
