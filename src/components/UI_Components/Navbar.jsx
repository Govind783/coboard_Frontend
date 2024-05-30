import React from "react";
import Image from "next/image";
// import logo from "../../assets/CoBoardLogo2.png";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { getCookiesNext } from "@/cookies/cookiesConfig";
import { useRouter } from "next/router";
import { toast } from "../ui/use-toast";
const Navbar = () => {
  const firstNavItemContents = [
    {
      heading: "Visual Collaboration",
      description: "Enhance teamwork through real-time creative collaboration.",
    },
    {
      heading: "Enterprise Solutions",
      description: "CoBoard offers scalable features for large organizations.",
    },
    {
      heading: "Top-notch Security",
      description: "Ensure data security with CoBoard's advanced measures.",
    },
    {
      heading: "Seamless Integrations",
      description:
        "Effortlessly integrate CoBoard, optimizing workflows and productivity.",
    },
    {
      heading: "Diverse Use Cases",
      description: "Adapt CoBoard to various scenarios, fostering innovation.",
    },
    {
      heading: "Ready-to-Use Templates",
      description:
        "Jumpstart projects with CoBoard's diverse templates, saving time.",
    },
    {
      heading: "Satisfied Customers",
      description:
        "Join a community relying on CoBoard for seamless collaboration.",
    },
    {
      heading: "Inspiring Blog Content",
      description:
        "Stay informed and inspired with CoBoard's blog on collaboration trends.",
    },
  ];
  const whyUseCoBoard = [
    {
      heading: "Collaborative Innovation",
      description:
        "Drive creative innovation through real-time collaboration with CoBoard.",
    },
    {
      heading: "Scalable Enterprise Solutions",
      description:
        "Opt for CoBoard's scalable features tailored for the diverse needs of large organizations.",
    },
    {
      heading: "Secure Collaboration Environment",
      description:
        "Ensure a secure collaboration environment with CoBoard's advanced security measures.",
    },
    {
      heading: "Streamlined Workflows",
      description:
        "Effortlessly integrate CoBoard to streamline workflows and enhance overall productivity.",
    },
    {
      heading: "Versatile Adaptability",
      description:
        "Adapt CoBoard to diverse use cases, fostering innovation across various business scenarios.",
    },
    {
      heading: "Efficient Project Kickstarts",
      description:
        "Jumpstart projects efficiently using CoBoard's ready-to-use templates, saving valuable time.",
    },
  ];

  const CoBoardFeatures = [
    {
      heading: "Real-time Collaboration",
      description:
        "Experience seamless real-time collaboration on a digital whiteboard with CoBoard.",
    },
    {
      heading: "Multi-platform Integration",
      description:
        "Integrate CoBoard effortlessly with your favorite tools, enhancing cross-platform accessibility.",
    },
    {
      heading: "Voice+Video Calling",
      description:
        "Initiate voice and video calls directly from your CoBoard board for efficient communication.",
    },
    {
      heading: "Versatile Templates Library",
      description:
        "Access a diverse library of templates for various use cases, accelerating project kickstarts.",
    },
    {
      heading: "Advanced Security Measures",
      description:
        "Ensure data security with CoBoard's robust security features for a safe collaboration environment.",
    },
    {
      heading: "Interactive Widgets and Plugins",
      description:
        "Enhance board functionality with interactive widgets and plugins, customizing your collaboration experience.",
    },
  ];

  const router = useRouter();
  return (
    <div className=" backdrop-blur-md sticky top-0 z-40 bg-transparent">
      <div className="sticky top-0 z-30 h-20 bg-black bg-opacity-30 w-full px-10">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-12 h-full">
            <p className="lg:text-4xl text-xl">CoBoard</p>
            <div className="lg:flex hidden cursor-pointer items-center gap-4">
              <NavigationMenu delayDuration={5}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>What is CoBoard</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul class="grid gap-3 p-4 md:w-[400px] lg:w-[600px] md:grid-cols-2">
                        {firstNavItemContents.map((point, index) => (
                          <div
                            className="hover:bg-[#212020] transition-all ease-in duration-150 rounded-md p-2"
                            key={index}
                          >
                            <li>
                              <strong class="text-sm">{point.heading}</strong>
                              <p class="text-xs secondaryTextColorGray ">
                                {point.description}
                              </p>
                            </li>
                          </div>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Why use CoBoard</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {whyUseCoBoard.map((point, index) => (
                          <div
                            className="hover:bg-[#212020] transition-all ease-in duration-150 rounded-md p-2"
                            key={index}
                          >
                            <li>
                              <strong class="text-sm">{point.heading}</strong>
                              <p class="text-xs secondaryTextColorGray ">
                                {point.description}
                              </p>
                            </li>
                          </div>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      Features of CoBoard
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {CoBoardFeatures.map((point, index) => (
                          <div
                            className="hover:bg-[#212020] transition-all ease-in duration-150 rounded-md p-2"
                            key={index}
                          >
                            <li>
                              <strong class="text-sm">{point.heading}</strong>
                              <p class="text-xs secondaryTextColorGray ">
                                {point.description}
                              </p>
                            </li>
                          </div>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <Button
            onClick={() => {
              if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                return toast({
                  title: "Please use a desktop to use CoBoard",
                })
              }
              if (getCookiesNext("userEmail") && getCookiesNext("userName")) {
                router.push("/Workspace");
              } else {
                router.push("/api/auth/login");
              }
            }}
            variant=""
            className="w-32 font-semibold"
          >
            Enter Co-Board
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
