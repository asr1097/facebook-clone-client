import { LikeComment } from "./LikeComment";
import { CommentCommentForm } from "./CommentCommentForm";
import { Link } from "react-router-dom";

const ChildComment = ({ childComment }) => {
    return (
        <div>
            <p>{childComment.text}</p>
            <p>{childComment.date}</p>
            <p>{childComment.user.name.full}</p>
            <LikeComment id={childComment._id} likes={childComment.likes} />
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
}

export { ChildComment };