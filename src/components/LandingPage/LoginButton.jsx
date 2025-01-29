import React, { useState } from "react";
import { Button } from "../ui/button";
import { getCookiesNext } from "@/cookies/cookiesConfig";
import { useRouter } from "next/router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoginButton = () => {
  const router = useRouter();
  const [clickedOnButton, setClickedOnButton] = useState(false);
  return (
    <Button
      className="font-semibold"
      disabled={clickedOnButton}
      onClick={() => {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          return toast({
            title: "Please use a desktop to use CoBoard",
          });
        }
        setClickedOnButton(true);
        if (getCookiesNext("userEmail")) {
          router.push("/Workspace");
        } else {
          router.push("/api/auth/login");
        }
      }}
    >
      Join Co-Board
      {clickedOnButton && <AiOutlineLoading3Quarters className="animate-spin flex-shrink-0 w-5 h-5 ml-3" />}
    </Button>
  );
};

export default LoginButton;
