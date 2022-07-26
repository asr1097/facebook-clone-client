import { CommentCommentForm } from "./CommentCommentForm";
import { Link } from "react-router-dom";

const PostComment = ({ comment, postID, index, pushNewComment }) => {
    return (
        <div>
            <p>{comment.text}</p>
            <p>{comment.date}</p>
            <CommentCommentForm 
                postID={postID} 
                parentCommentID={comment._id}
                index={index}
                pushNewComment={pushNewComment}
                commentOwner={comment.user.id}
            />
            {comment.childrenComments.length ? 
                <Link to={`comments/${comment._id}`}>{comment.childrenComments.length} replies</Link>
                : null
            }
        </div>
    )
}

export { PostComment };