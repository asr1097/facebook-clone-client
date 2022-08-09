import { SendMessage } from "./SendMessage";
import { Message} from "./Message";

const ChatRoom = ({ activeRoom, messages }) => {

    if(messages) {
        return (
            <div>
                {messages.map(msg => {
                    return <Message key={msg._id} msg={msg} />
                })}
                <SendMessage activeRoom={activeRoom}/>
            </div>
        )
    } else {
        return (
            <div>
                <p>Write something to start chatting!</p>
                <SendMessage activeRoom={activeRoom}/>
            </div>
        )
    }
}

export { ChatRoom };