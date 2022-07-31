import { useState, useContext } from "react";
import { SocketContext, UserContext } from "../../App";

const SendMessage = ({ activeRoom }) => {

    const [text, setText] = useState();

    const socket = useContext(SocketContext);
    const user = useContext(UserContext);

    const sendMessage = (ev) => {
        ev.preventDefault();
        let target = ev.target;
        socket.emit("message", {
            content: {
                text,
                
                date: Date.now()
            },
            to: activeRoom,
            from: user._id
        })
        target.value = ""; 
    }

    return (
        <form onSubmit={sendMessage}>
            <input type="text" onChange={(ev) => {setText(ev.target.value)}} />
            <input type="submit" value="Send"></input>
        </form>
    )
}

export { SendMessage };