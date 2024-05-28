import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
const TooltipComponent = ({ label, content, side }) => {
    return (
        <div>
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                    {label}
                    </TooltipTrigger>
                    <TooltipContent side={side || "right"}>
                        <p>
                            {content}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

        </div>
    )
}

export default TooltipComponent