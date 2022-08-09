import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const ChatFriendTile = ({ sender, messages, activeUsers }) => {

    const [unreadMsgs, setUnreadMsgs] = useState(0);
    const user = useContext(UserContext);

    let senderData = messages[sender][0].from._id === user._id ? 
        messages[sender][0].to 
        : messages[sender][0].from

    useEffect(() => {
        let unreadMsgsCount = 0;
        for(let i = messages[sender].length - 1; i >= 0; i--) {
            if(!messages[sender][i].read && messages[sender][i].from._id !== user._id)
            {unreadMsgsCount++}
            else if(messages[sender][i].read && messages[sender][i].from._id !== user._id)
            {break}
        }
        setUnreadMsgs(unreadMsgsCount);
    }, [activeUsers, messages, sender, user._id]);

    return (
        <Link to={`../chat/${senderData._id}`}>
            {senderData.name.full}
             {activeUsers.includes(senderData._id) ? <span>(active)</span> : null}
             {unreadMsgs}
        </Link>
    )
};

export { ChatFriendTile };