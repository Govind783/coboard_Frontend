import '@livekit/components-styles';
import {
    LiveKitRoom,
    GridLayout,
    ParticipantTile,
    useTracks,
    ControlBar,
    DisconnectButton,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// import { io } from "socket.io-client"
import { getCookiesNext } from '@/cookies/cookiesConfig';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from 'next/router';

const CallingComponent = ({ socket, teamMembers }) => {
    const router = useRouter()

    const [tokens, setTokens] = useState();
    const [nameOfCaller, setnameOfCaller] = useState('');
    const [callerUserid, setCallerUserId] = useState(null)
    const [callAcceptOrDeclineStatus, setCallAcceptOrDeclineStatus] = useState({
        accepted: false,
        declined: false,
        isRinging: false
    });
    const [listOfTeamMembersToCall, setListOfTeamMembersToCall] = useState([])

    const [roomToken, setRoomToken] = useState();
    const [isTeamMembersModalOpen, setIsTeamMembersModalOpen] = useState(false);

    const finalTeamMembers = teamMembers.filter((member) => member.user_id !== getCookiesNext('userId'))
    useEffect(() => {
        socket.on("incoming_call", (data) => {
            setRoomToken(data.roomTokenString)
            setnameOfCaller(data.caller_username);
            setCallerUserId(data.caller_id);
            console.log(data.caller_id, 'caller iod shoyuld be 7')
            setCallAcceptOrDeclineStatus({ ...callAcceptOrDeclineStatus, isRinging: true });
        });

        socket.on("call_accepted", async (data) => {
            setCallAcceptOrDeclineStatus({ ...callAcceptOrDeclineStatus, accepted: true, isRinging: false });
            const resp = await fetch(`/api/get_lk_token?room=${data.roomTokenString}&username=${getCookiesNext("userName")}&boardId=${router.query.BoardUuid}`);
            const Tokendata = await resp.json();
            console.log(`Token for ${getCookiesNext("userName")}:`, Tokendata);
            setTokens(Tokendata.token);
        });

        socket.on("call_declined", (data) => {
            setCallAcceptOrDeclineStatus({ ...callAcceptOrDeclineStatus, declined: true, isRinging: false });
            toast({
                title: `${data.name} has declined the call`,
                variant: "destructive"
            });
        })

        return () => {
            socket.off("incoming_call");
            socket.off("call_accepted");
            socket.off("call_declined");
        };
    }, []);

    const makeCall = async () => {
        if (listOfTeamMembersToCall.length === 0) {
            return toast({
                title: "Please select atleast one member to call",
            })
        }
        setnameOfCaller(getCookiesNext('userName'));
        const roomTokenStr = uuidv4()
        const roomString = `Meetroom+boardUuid=${router.query.BoardUuid}+roomToken=${roomTokenStr}+callerId=${getCookiesNext('userId')}`
        const resp = await fetch(`/api/get_lk_token?room=${roomString}&username=${getCookiesNext("userName")}&boardId=${router.query.BoardUuid}`);
        const data = await resp.json();
        // console.log(`Token for ${getCookiesNext("userName")}:`, data);
        setTokens(data.token);
        socket.emit("make_call", { "caller_username": getCookiesNext('userName'), userIds: listOfTeamMembersToCall, roomTokenString: roomString, calerId: getCookiesNext("userId") }); // Ensure these are correct user IDs
        toast({
            title: "Your team has received the Notification to join the call",
        })
        setIsTeamMembersModalOpen(false);
    };

    const accept = async () => {
        socket.emit("accept_call", { "userId": getCookiesNext("userId"), "caller_id": callerUserid, "roomTokenString": roomToken });
    };

    const declineCall = async () => {
        socket.emit("decline_call", { "userId": getCookiesNext("userId"), "caller_id": callerUserid, "name": getCookiesNext("userName"), "roomTokenString": roomToken });
        setCallAcceptOrDeclineStatus({ ...callAcceptOrDeclineStatus, isRinging: false });
    }


    return (
        <div>

            {/* we make the button dissapear when the user is already in a call */}
            {!tokens && <Popover open={isTeamMembersModalOpen}>
                <PopoverTrigger onClick={() => setIsTeamMembersModalOpen((prev) => !prev)} className='border !border-gray-500' asChild>
                    <Button style={{
                        background: "black",
                        color: "white"
                    }} variant="roundedBorderBtn">Choose Members to call</Button>
                </PopoverTrigger>
                <PopoverContent style={{ position: "relative", left: "-2rem" }} onEscapeKeyDown={() => {
                    setIsTeamMembersModalOpen(false)
                }} onInteractOutside={() => {
                    setIsTeamMembersModalOpen(false)
                }} className="w-80">
                    <div className="flex flex-col gap-3">
                        {
                            finalTeamMembers.map((member, index) => {
                                return (
                                     <div key={index} onClick={() => {
                                        if (listOfTeamMembersToCall.includes(member)) {
                                            setListOfTeamMembersToCall((prev) => prev.filter((mem) => mem.id !== member.user_id))
                                        } else {
                                            setListOfTeamMembersToCall((prev) => [...prev, {
                                                'name': member.name,
                                                'id': member.user_id
                                            }])
                                        }
                                    }} className="flex items-center gap-2">
                                        <Checkbox className="cursor-pointer" />
                                        <p className="cursor-pointer">{member?.name}</p>
                                    </div>
                                )
                            })
                        }

                    </div>
                    <div className="flex w-full mt-7">
                        <Button onClick={makeCall} className="w-full">Call</Button>
                    </div>
                </PopoverContent>
            </Popover>}
            {
                <div className={`relative transition-all ease-in duration-150 ${callAcceptOrDeclineStatus.isRinging ? 'slideFromUpForCallNotification opacity-100' : "slideDown opacity-0"}`}>
                    <div className="absolute top-4 w-96 h-32 pl-9 -left-48 border bg-black border-white p-3 rounded-md flex items-center">
                        <div className="modal">
                            <div className='text-gray-400'>You have an incoming call from
                                <span className='text-white ml-2'>{nameOfCaller}...</span>
                            </div>
                            <div className="flex items-center mt-2 gap-3">
                                <Button onClick={accept}>Answer</Button>
                                <Button variant="roundedBorderBtn" onClick={declineCall}>Decline</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {tokens && <LiveKitRoom
                video={true}
                audio={true}
                token={tokens}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                data-lk-theme="default"
                style={{ height: '20dvh', width: "20rem" }}
                onDisconnected={() => {
                    setTokens(null)
                }}
            >
                <MyVideoConference />
                <ControlBar variation='minimal' />
                {/* <DisconnectButton>Cut</DisconnectButton> */}
            </LiveKitRoom>}

        </div>
    );
}

export default CallingComponent

function MyVideoConference() {

    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );
    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            <ParticipantTile />
        </GridLayout>
    );
}
