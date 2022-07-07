import { useState, useContext } from "react";
import { UserContext, SocketContext } from "../App";
import { ChatWindow } from "./ChatWindow";

const ChatLobby = ({activeUsers}) => {
    const [messages, setMessages] = useState({});
    const [unreadMessages, setUnreadMessages] = useState({})
    const socket = useContext(SocketContext);
    const user = useContext(UserContext);

    socket.on("message", msg => {
        let sender = msg.from;
        if(sender in unreadMessages) {
            let senderNewUnreadMessages = [];
            let senderNewMessages = [];
            unreadMessages.sender.forEach(msg => {
                senderNewUnreadMessages.push(msg.text)
                senderNewMessages.push(msg.text)
            });
            let newUnreadMessages = {...unreadMessages, sender: [senderNewUnreadMessages]};
            let newMessages = {...messages, sender: [...sender, senderNewUnreadMessages]}
            setUnreadMessages(newUnreadMessages);
            setMessages(newMessages);
        } else {
            let newSenderMessage = {sender: [msg.text]};
            let newMessages = {...messages, newSenderMessage};
            let newUnreadMessages = {...unreadMessages, newSenderMessage};
            setUnreadMessages(newUnreadMessages);
            setMessages(newMessages);
        }
    })

    const renderComp = () => {
        messages.map(msg => {
            let sender = msg.sender;
            if(sender in unreadMessages) {
                return (
                    <button>{`${sender} (${unreadMessages.sender.length})`}</button>  
                )
            } else {
                return (
                    <button>{`${sender}`}</button>
                )
            }
        })
    }

    return (
        <div>
            {renderComp()}
        </div>
    )
}

export { ChatLobby };