import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomMarquee from "../UI_Components/CustomMarquee";
import { FcGoogle } from "react-icons/fc";
import avatargirl1 from "../../assets/avatar1Girl.png";
import avatargirl2 from "../../assets/avatar2Girl.png";
import avatarBoy1 from "../../assets/avatar1Boy.png";
import avatarBoy2 from "../../assets/avatar2Boy.png";
import avatarBoy3 from "../../assets/avatar3Boy.png";
import avatarBoy4 from "../../assets/avatar4Boy.png";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/router";
import LoginButton from "./LoginButton";
const Hero = () => {
  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];

  const [teamMembersList, setTeamMembersList] = useState([
    {
      name: "Govind",
      role: "Full stack dev",
      avatar: avatargirl1,
      isOpenFlag: false,
      ProjectBased_access: "Admin",
    },
    {
      name: "Rahul",
      role: "Frontend dev",
      avatar: avatargirl2,
      isOpenFlag: false,
      ProjectBased_access: "Write access",
    },
    {
      name: "Raj",
      role: "Backend dev",
      avatar: avatarBoy1,
      isOpenFlag: false,
      ProjectBased_access: "Read access",
    },
  ]);

  const [canViewOrEditList, setCanViewOrEditList] = useState([
    {
      name: "Govind",
      avatar: avatarBoy2,
      isOpenFlag: false,
      permission: "can edit",
    },
    {
      name: "Shanaya",
      avatar: avatarBoy3,
      isOpenFlag: false,
      permission: "can edit",
    },
    {
      name: "Riya",
      avatar: avatargirl2,
      isOpenFlag: false,
      permission: "can view",
    },
  ]);

  const handleRoleChange = (index, newRole) => {
    setTeamMembersList((prevTeamMembers) => {
      const updatedTeamMembers = [...prevTeamMembers];
      updatedTeamMembers[index].ProjectBased_access = newRole;
      updatedTeamMembers[index].isOpenFlag = false;
      return updatedTeamMembers;
    });
  };
  const roles = ["Admin", "Write access", "Read access"];
  const permissionList = ["can edit", "can view"];

  const handlePermissionChange = (index, newPermission) => {
    setCanViewOrEditList((prevCanViewOrEditList) => {
      const updatedCanViewOrEditList = [...prevCanViewOrEditList];
      updatedCanViewOrEditList[index].permission = newPermission;
      updatedCanViewOrEditList[index].isOpenFlag = false;
      return updatedCanViewOrEditList;
    });
  };

  return (
    <div>
      <div className="w-full text-center lg:pt-24 pt-16">
        <div className="lg:text-6xl text-3xl secondaryTextColorGray">
          Enter with a{" "}
          <span className=" font-semibold  linear-wipe text-white">DREAM</span>{" "}
        </div>
        <div className="lg:text-6xl text-2xl secondaryTextColorGray mt-4">
          Exit with the next BIG{" "}
          <span className=" font-semibold linear-wipe  text-white">THING</span>{" "}
        </div>
        {/* <p className=' text-sm mt-4 text-white'>Build, iterate, and design faster with CoBoard — the visual workspace for innovation.</p> */}

        <div className="flex lg:mt-2 mt-8 items-center justify-center lg:gap-4 gap-8 flex-wrap">
          <div className=" text-sm secondaryTextColorGray px-8 lg:px-0">
            Build, iterate, and design faster{" "}
            <span className=" text-white">
              with CoBoard — the visual workspace for innovation.
            </span>{" "}
          </div>
          <LoginButton />
        </div>

        <div className="lg:mt-28 mt-12">
          <div className="flex mb-2 justify-center">
            <div className=" text-xs flex items-center gap-2">
              Rated 4.8+ out of 5,134 reviews on
              <FcGoogle className=" text-xl" />
            </div>
          </div>
          <CustomMarquee />
        </div>

        <div className="text-3xl mt-20 secondaryTextColorGray">
          Build Relentlessely With{" "}
          <span className=" font-semibold  linear-wipe text-white">CoBoard</span>{" "}
        </div>
        {/* <p>Invite your entire team</p>
        <p>Assign Member based Roles</p>
        <p>Collaborate in real time</p> */}
        <div className="flex items-start w-full justify-center gap-12 mx-auto mt-7 flex-wrap px-6 lg:px-0">
          <div className="w-[26rem]">
            <div className=" text-left">
              <strong class="text-sm">Full control over</strong>
              <p class="text-xs secondaryTextColorGray ">
                Have full control over your team and manage role based access
              </p>
            </div>

            <div className="p-4 mt-4 border rounded-xl border-gray-600 w-full h-full">
              <div className=" text-left">
                <p className=" text-sm">Team Members</p>
                <p className="secondaryTextColorGray text-xs">
                  Invite your team members to collaborate.
                </p>
              </div>

              <div className="flex mt-5 items-center gap-4">
                <div className="w-full h-full flex gap-7 flex-col items-start">
                  {teamMembersList.map((member, index) => {
                    return (
                      <div key={index} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <Image
                            src={member.avatar}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex flex-col w-28 items-start">
                            <p className=" text-sm">{member.name}</p>
                            <p className="text-xs  secondaryTextColorGray">
                              {member.role}
                            </p>
                            <p className="text-xs secondaryTextColorGray">
                              {member.ProjectBased_access}
                            </p>
                          </div>
                        </div>

                        {index > 0 && (
                          <Popover open={member.isOpenFlag}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="roundedBorderBtn"
                                role="combobox"
                                aria-expanded={member.isOpenFlag}
                                className="lg:w-[150px] w-[131px] justify-between capitalize"
                                onClick={() => {
                                  setTeamMembersList((prev) => {
                                    const tempList = [...prev];
                                    tempList[index].isOpenFlag =
                                      !tempList[index].isOpenFlag;
                                    return tempList;
                                  });
                                }}
                              >
                                {member.ProjectBased_access
                                  ? member.ProjectBased_access
                                  : "Grant access..."}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[150px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Decide Access"
                                  className="h-9"
                                />
                                <CommandEmpty>No Role found</CommandEmpty>
                                <CommandGroup>
                                  {roles.map((framework) => (
                                    <CommandItem
                                      key={framework}
                                      value={framework}
                                      onSelect={(currentValue) => {
                                        handleRoleChange(index, currentValue);
                                      }}
                                    >
                                      {framework}
                                      <CheckIcon
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          member.ProjectBased_access.toLowerCase() ===
                                            framework.toLowerCase()
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                  {/* <p>hi</p> */}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[36rem]">
            <div className=" text-left">
              <strong class="text-sm">
                Team as well as Individual contributions
              </strong>
              <p class="text-xs secondaryTextColorGray ">
                Invite your Team members and collaborate or contribute to a
                project as a guest
              </p>
            </div>

            <div className="p-4 mt-4 border rounded-xl border-gray-600 w-full h-full">
              <div className=" text-left">
                <p className=" text-sm">Share this document</p>
                <p className="secondaryTextColorGray text-xs">
                  Anyone with the link can start collobtrating on the document.
                </p>
              </div>

              <div className="flex mt-5 gap-4 w-full mx-auto items-center">
                <Input
                  value={"https://example.com/link/to/document"}
                  className="w-[97%] gap-4 bg-transparent h-8 rounded"
                  type="email"
                  placeholder="Email"
                />
                <Button type="submit">Copy Link</Button>
              </div>

              <p className="text-left text-sm mt-7">People with access</p>
              <div className="flex  mt-2 items-center gap-4">
                <div className="w-full h-full flex gap-7 flex-col items-start">
                  {canViewOrEditList.map((member, index) => {
                    return (
                      <div key={index} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <Image
                            src={member.avatar}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex flex-col w-28 items-start">
                            <p className=" text-sm">{member.name}</p>
                            <p className="text-xs hidden lg:flex secondaryTextColorGray">
                              {member.name}@gmail.com
                            </p>
                            <p className="text-xs secondaryTextColorGray">
                              {member.permission}
                            </p>
                          </div>
                        </div>

                        {
                          <Popover open={member.isOpenFlag}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="roundedBorderBtn"
                                role="combobox"
                                aria-expanded={member.isOpenFlag}
                                className="lg:w-[150px] w-[120px] justify-between capitalize"
                                onClick={() => {
                                  setCanViewOrEditList((prev) => {
                                    const tempList = [...prev];
                                    tempList[index].isOpenFlag =
                                      !tempList[index].isOpenFlag;
                                    return tempList;
                                  });
                                }}
                              >
                                {member.permission
                                  ? member.permission
                                  : "Grant access..."}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[150px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Decide Access"
                                  className="h-9"
                                />
                                <CommandEmpty>No Role found</CommandEmpty>
                                <CommandGroup>
                                  {permissionList.map((framework) => (
                                    <CommandItem
                                      key={framework}
                                      value={framework}
                                      onSelect={(currentValue) => {
                                        handlePermissionChange(
                                          index,
                                          currentValue
                                        );
                                      }}
                                    >
                                      {framework}
                                      <CheckIcon
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          member.permission.toLowerCase() ===
                                            framework.toLowerCase()
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                  {/* <p>hi</p> */}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
