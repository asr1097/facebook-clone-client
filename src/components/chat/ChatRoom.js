import { SendMessage } from "./SendMessage";

const ChatRoom = ({ activeRoom, messages }) => {

    return (
        <div>
            {messages.map(msg => {
                return <p key={msg._id}>{msg.content.text}</p>
            })}
            <SendMessage activeRoom={activeRoom}/>
        </div>
    )
}

export { ChatRoom };