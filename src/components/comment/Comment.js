import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CommentCommentForm } from "./CommentCommentForm";
import { LikeComment } from "./LikeComment";
import { ChildComment } from "./ChildComment";

const Comment = () => {

    const [comment, setComment] = useState();
    const params = useParams();

    useEffect(() => {
        const fetchComment = async() => {
            let response = await fetch(`https://localhost:3000/comments/${params.id}`, {
                mode: "cors",
                credentials: "include"
            });
            let comment = await response.json();
            setComment(comment)
        };

        fetchComment();

        return (() => {
            setComment()
        })

    }, [params.id]);

    if(comment){
        return (
            <div>
                <p>{comment.comment.text}</p>
                <p>{comment.comment.date}</p>
                <p>{comment.comment.user.name.full}</p>
                <LikeComment id={comment.comment._id} likes={comment.comment.likes} />
                <CommentCommentForm 
                    commentOwner={comment.comment.user._id}
                    postID={comment.comment.post}
                    parentCommentID={comment.comment._id}
                />
                {comment.childrenComments.map(childComment => {
                    return <ChildComment key={childComment._id} childComment={childComment} />
                })}
            </div>
        )
    } 
}

export { Comment };