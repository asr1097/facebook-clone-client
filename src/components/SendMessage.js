import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../App";

const SendMessage = () => {

    const [text, setText] = useState();

    const socket = useContext(SocketContext);

    const sendMessage = (ev) => {
        ev.preventDefault();
        socket.emit("message", {
            text,
            to: "Karim"
        })
        setText();
        ev.target.value = ""; 
    }

    useEffect(() => {
        if(socket.connected) {socket.emit("user joined", socket.id)}
    }, [socket.connected])

    return (
        <form onSubmit={sendMessage}>
            <input type="text" onChange={(ev) => {setText(ev.target.value)}} />
            <input type="submit" value="Send"></input>
        </form>
    )
}

export { SendMessage };