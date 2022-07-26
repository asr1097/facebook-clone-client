import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CommentCommentForm = ({ commentOwner, postID, parentCommentID, index, pushNewComment }) => {
  
    const [text, setText] = useState();
    const [showForm, setShowForm] = useState(false);

    const navigate = useNavigate();

    const formSwitch = (ev) => {
        if(showForm) {setShowForm(false)}
        else{setShowForm(true)}
    }

    const onSubmit = async(ev) => {
        ev.preventDefault();
        let formData = new FormData();
        formData.append("text", text);
        formData.append("parentCommentID", parentCommentID);
        formData.append("postID", postID);
        formData.append("user", commentOwner);
        let response = await fetch(`https://localhost:3000/comments/${parentCommentID}/new`, {
            mode: "cors",
            credentials: "include",
            method: "post",
            body: formData
        });
        if(response.ok) {
            let comment = await response.json();
            /* If called from top comment - comment which is not a child comment */
            if(pushNewComment) { pushNewComment(index, comment);}
            /* If called from child comment */
            else {
                navigate(`../comments/${parentCommentID}`)
            }
        }
    }

    const onTextChange = (ev) => {
        setText(ev.target.value)
    };

    if(showForm) {
        return (
            <div key={parentCommentID + 1}>
                <form onSubmit={onSubmit}>
                    <input type="text" onChange={onTextChange}></input>
                    <input type="submit"></input>
                </form>
                <button onClick={formSwitch}>Close</button>
            </div>
        )
    } else {
        return <button key={parentCommentID + 1} onClick={formSwitch}>Reply</button>
    }
}

export { CommentCommentForm };