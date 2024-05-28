
import avatar1 from "../assets/avatar1Girl.png"
import avatar2 from "../assets/avatar2Girl.png"
import avatar3 from "../assets/avatar1Boy.png"
import avatar4 from "../assets/avatar2Boy.png"
import avatar5 from "../assets/avatar3Boy.png"
import avatar6 from "../assets/avatar4Boy.png"
import avatar7 from "../assets/avatar5Boy.svg"
import avatar8 from "../assets/avatar6.svg"
import avatar9 from "../assets/avatar9.svg";
import avatar10 from "../assets/avatar10.svg";
import avatar11 from "../assets/avatar11.svg";
import avatar12 from "../assets/avatar12.svg";
import avatar13 from "../assets/avatar13.svg";
import avatar14 from "../assets/avatar14.svg";
import avatar15 from "../assets/avatar15.svg";
import avatar16 from "../assets/avatar16.svg";
import avatar17 from "../assets/avatar17.svg";
import avatar18 from "../assets/avatar18.svg";
import avatar19 from "../assets/avatar19.svg";
import avatar20 from "../assets/avatar20.svg";

export const arrayOfImages = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14, avatar15, avatar16, avatar17, avatar18, avatar19, avatar20]

export const randomizeUsersAvatar = () => {
    return Math.floor(Math.random() * 20) + 1;
}