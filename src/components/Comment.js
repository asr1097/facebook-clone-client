import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CommentCommentForm } from "./CommentCommentForm";

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
                <CommentCommentForm 
                    commentOwner={comment.comment.user._id}
                    postID={comment.comment.post}
                    parentCommentID={comment.comment._id}
                />
                {comment.childrenComments.map((childComment, index) => {
                    return (
                        <div>
                            <p>{childComment.text}</p>
                            <p>{childComment.date}</p>
                            <p>{childComment.user.name.full}</p>
                            <CommentCommentForm 
                                commentOwner={childComment.user._id}
                                postID={childComment.post}
                                parentCommentID={childComment._id}
                            />
                            {childComment.childrenComments.length ? 
                                <Link to={`/comments/${childComment._id}`}>{childComment.childrenComments.length} replies</Link>
                                : null
                            }
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return null
    }

}

export { Comment };