import { useEffect } from "react";
import { ChatLobby } from "./ChatLobby";
import { ChatRoom } from "./ChatRoom";
import { useParams } from "react-router-dom";

const ChatWindow = ({setActiveRoom, activeRoom, readMessages, activeUsers, messages}) => {

    const params = useParams();

    useEffect(() => {
        if(params.id) {
            setActiveRoom(params.id);
            readMessages(params.id)
        }
        if(!params.id) {setActiveRoom()}

        return () => {
            setActiveRoom();
        }
    }, [params.id, setActiveRoom, readMessages]);

    return (
        <div>
            <ChatLobby 
                messages={messages} 
                activeUsers={activeUsers} 
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