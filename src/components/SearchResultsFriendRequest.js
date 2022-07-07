import { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";

const SRFriendRequest = ({profile}) => {
    const [requestStatus, setRequestStatus] = useState()
    const user = useContext(UserContext);

    useEffect(() => {
        if(user.friendsList.includes(profile._id)){setRequestStatus("Friend")}
        else if(user.sentRequests.includes(profile._id)){setRequestStatus("Sent")}
        else if(user.receivedRequests.includes(profile._id)){setRequestStatus("Received")}
        else{setRequestStatus("Add")}
    }, [user, profile])

    const sendRequest = async() => {
        let formData = new FormData();
        formData.append("profileID", profile._id)
        const response = await fetch("https://localhost:3000/profile/friends/add", {
            method: "post",
            body: formData,
            credentials: "include",
            mode: "cors"
        });
        response.ok ? setRequestStatus("Sent") : setRequestStatus("Add");
    }

    const cancelRequest = async() => {
        let formData = new FormData();
        formData.append("profileID", profile._id)
        const response = await fetch("https://localhost:3000/profile/friends/cancel", {
            method: "post",
            body: formData,
            credentials: "include",
            mode: "cors"
        });
        response.ok ? setRequestStatus("Add") : setRequestStatus("Sent");
    }

    const rejectRequest = async() => {
        let formData = new FormData();
        formData.append("profileID", profile._id)
        const response = await fetch("https://localhost:3000/profile/friends/reject", {
            method: "post",
            body: formData,
            credentials: "include",
            mode: "cors"
        });
        response.ok ? setRequestStatus("Add") : setRequestStatus("Received");
    }

    const acceptRequest = async() => {
        let formData = new FormData();
        formData.append("profileID", profile._id)
        const response = await fetch("https://localhost:3000/profile/friends/accept", {
            method: "post",
            body: formData,
            credentials: "include",
            mode: "cors"
        });
        response.ok ? setRequestStatus("Friend") : setRequestStatus("Received");
    }

    const switchRender = () => {

        if(requestStatus === "Friend") {return <button>Friends</button>}
        else if(requestStatus === "Sent") {return <button onClick={cancelRequest}>Cancel Request</button>}
        else if(requestStatus === "Received") {
            return (
                <div>
                    <button onClick={acceptRequest}>Accept Request</button>
                    <button onClick={rejectRequest}>Reject Request</button>
                </div>
            )
            }
        else {return <button onClick={sendRequest}>Add Friend</button>}
    }

    
    return (
        switchRender()
    )
};

export { SRFriendRequest };