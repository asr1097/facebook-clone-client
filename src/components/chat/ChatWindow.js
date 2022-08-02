import { useEffect } from "react";
import { ChatLobby } from "./ChatLobby";
import { ChatRoom } from "./ChatRoom";

const ChatWindow = ({setActiveRoom, activeRoom, readMessages, activeUsers, messages}) => {

    const renderChatroom = (ev) => {
        setActiveRoom(ev.target.id);
        readMessages(ev.target.id);
    }

    useEffect(() => {
        return (() => {
            setActiveRoom(false)
        })
    }, [])

    return (
        <div>
            <ChatLobby 
                messages={messages} 
                activeUsers={activeUsers} 
                renderChatroom={renderChatroom}
            />
            {activeRoom ? <ChatRoom  
                messages={messages[activeRoom]}
                activeRoom={activeRoom}
                /> 
            : null}
        </div>
    )
}

export { ChatWindow };