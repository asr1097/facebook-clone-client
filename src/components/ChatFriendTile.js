import { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";

const ChatFriendTile = ({ sender, messages, activeUsers, renderChatroom }) => {

    const [unreadMsgs, setUnreadMsgs] = useState(0);
    const user = useContext(UserContext);

    useEffect(() => {
        let unreadMsgsCount = 0;
        for(let i = messages[sender].length - 1; i >= 0; i--) {
            if(!messages[sender][i].content.read && messages[sender][i].from !== user._id)
            {unreadMsgsCount++}
            else if(messages[sender][i].content.read && messages[sender][i].from !== user._id)
            {break}
        }
        setUnreadMsgs(unreadMsgsCount);
    }, [activeUsers, messages, sender, user._id])

    return (
        
        <div key={sender} id={sender} onClick={(ev) => {
            renderChatroom(ev);
        }}>
            {sender}
             {activeUsers.includes(sender) ? <span>(active)</span> : null}
             {unreadMsgs}
        </div>
        
    )
};

export { ChatFriendTile };