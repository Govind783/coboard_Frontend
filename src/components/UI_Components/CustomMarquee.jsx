import React from 'react'
import Marquee from "react-fast-marquee";

const CustomMarquee = () => {
    return (

        <Marquee gradient={true} gradientColor="black" speed={30} autoFill={true}>

            <div className="flex items-center gap-4">
                {Array(80).fill(0).map((_, index) => {
                    return (
                        index % 2 === 0 ? <div className="lg:text-3xl text-xl text-white font-semibold">KEEP</div> : <div className="lg:text-3xl text-xl secondaryTextColorGray font-semibold">BUILDING</div>
                        // <div className={`text-2xl ${index %2 ===0 ? "text-white" : "secondaryTextCol"} font-semibold`}>BUILD</div>
                    )
                })}
            </div>
        </Marquee>

    )
}

export default CustomMarquee