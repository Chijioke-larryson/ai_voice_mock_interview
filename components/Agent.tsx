import React from 'react'
import Image from "next/image";
import {AgentProps} from "@/types";

const Agent = ({userName}: AgentProps) => {

    const isSpeaking = true;
    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className="object-cover"/>
                        {isSpeaking && <span className="animate-speak"/>}


                    </div>

                    <h3> AI Interviewer</h3>


                </div>
                <div className="card-border">
                    <div className="card-content">
                        <Image src="/user-avatar1.png" alt="user-avatar" height={540} width={540} className="rounded-full object-cover size-[120px] "/>
                        <h3>{userName}</h3>

                    </div>

                </div>

            </div>


        </>

    )
}
export default Agent
