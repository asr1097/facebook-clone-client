import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";

const LikePost = ({ postID, likes, index, likePost, unlikePost}) => {

    const [action, setAction] = useState();
    const user = useContext(UserContext);

    useEffect(() => {
        likes.some(like => like.id === user._id) ? setAction("unlike") : setAction("like")
    }, [likes, user]);

    const capitalizeString = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const submitAction = async(ev) => {
        let formData = new FormData();
        formData.append("id", postID);
        let statusCode = await fetch(`https://localhost:3000/posts/${postID}/${action}`, {
            mode: "cors",
            credentials: "include",
            method: "post",
            body: formData
        });

        if(statusCode.ok) {
            if(action === "like") {
                likePost(index);
                setAction("unlike")
            }
            else {
                unlikePost(index);
                setAction("like")
            }
        }
    }
    
    return (<div>{action ? <button onClick={submitAction}>{capitalizeString(action)}</button> : null}</div>)
}

export { LikePost };