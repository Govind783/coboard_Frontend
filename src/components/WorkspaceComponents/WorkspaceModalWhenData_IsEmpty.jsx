import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Button } from '../ui/button'
import axios from 'axios'
import { backendDomainHandler } from '@/generalConfig/BackendAndMiddlewareHelpers'
import { useToast } from "@/components/ui/use-toast"
import { arrayOfImages, randomizeUsersAvatar } from '@/helperFunctions/assignUserAavatar'


const WorkspaceModalWhenData_IsEmpty = ({ setSuccessFullyOnBoarded }) => {
    // rn using local images will deploy to S3 and use the url in prod

    const [openModalDueToNoData, setOpenModalDueToNoData] = useState(true)
    const { user, error, isLoading } = useUser();
    const backendDomain = backendDomainHandler();
    const { toast } = useToast()

    const [workspaceName, setWorkspaceName] = useState('')
    const [boardName, setBoardName] = useState('')
    const [userAavatar, setUserAvatar] = useState("")
  
    const sendDataToBackendHandler = async () => {
        if (workspaceName.trim().length < 1 || boardName.trim().length < 1) {
            toast({
                title: `Please Enter Workspace and Board Name`,
                description: "You need to enter both workspace and board name to proceed",
            })
            return
        }
        const formData = new FormData();
        formData.append("name", user.nickname);
        formData.append("email", user.email);
        formData.append("sub", user.sub);
        formData.append("user_avatar", randomizeUsersAvatar());
        formData.append("workspace_name", workspaceName.trim());
        formData.append("board_name", boardName.trim());
        formData.append("teamMembers", JSON.stringify([]))
        formData.append("role", 'master_admin');

        // const accessToken = await fetchAccessToken();
        // console.log(accessToken);

        try {
            const backendRes = await axios.post(`${backendDomain}/userOnBoarding`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (backendRes.data.message === "SUCCESS") {
                toast({
                    title: `Workspace Created Successfully`,
                    description: "Lets Dive deep into Miro",
                })
                setOpenModalDueToNoData(false)
                window.location.reload()
                // setSuccessFullyOnBoarded(true)
                return
            }
        }
        catch (err) {
            toast({
                title: `Error`,
                description: "Something went wrong",
            })
            console.log(err);
        }
    }
    console.log(user);

    useEffect(() => {
        if (user?.email) {
            setUserAvatar(arrayOfImages[randomizeUsersAvatar()].src)
        }
    }, [])

    // useEffect(() => {
    //     if (user.email) {
    //         // const accessToken = async () => { try { return await fetchAccessToken() } catch (err) { console.log(err) } }

    //     }
    // }, [])

    return (
        <div>

            <Dialog open={openModalDueToNoData}>
                <DialogContent className="w-96 govindd" style={{ width: "23rem" }}>
                    <DialogHeader>
                        <DialogTitle className=" text-base font-medium">Lets On-board You</DialogTitle>
                        <p className='text-xs secondaryTextColorGray relative -top-[4px]'>Just a few details before you start</p>
                        <DialogDescription>
                            <div className="flex flex-col items-start gap-4">
                                <div className="flex items-center mt-3 gap-2">
                                    <Image src={userAavatar} width={48} height={48} quality={100} className='w-12 h-12 rounded-full' />
                                    <div>
                                        <p className='text-sm'>{user?.nickname}</p>
                                        <p className='text-sm'>{user.email}</p>

                                    </div>
                                </div>

                                <div>
                                    <p className='text-white mt-2 text-[13px]'>Create your workspace</p>
                                    <div>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            sendDataToBackendHandler();
                                        }} action="" className="flex flex-col gap-4">
                                            <input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} type="text" placeholder="Workspace Name" className='w-[20rem] h-10 bg-transparent border-slate-700 border mt-1 rounded-md pl-2' />
                                            <div>
                                                <p className='text-white mt-1 text-[13px]'>Your first Board</p>
                                                <input value={boardName} onChange={(e) => setBoardName(e.target.value)} type="text" placeholder="Board Name" className='w-[20rem] h-10 bg-transparent border-slate-700 border mt-1 rounded-md pl-2' />
                                            </div>
                                            <Button onClick={(e) => {
                                                e.preventDefault();
                                                sendDataToBackendHandler();

                                            }} className=' font-semibold text-sm mt-2'>Submit</Button>

                                            {/* <button className='bg-blue-500 w-[20rem] h-10 rounded-md text-white'>Create Workspace</button> */}
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default WorkspaceModalWhenData_IsEmpty