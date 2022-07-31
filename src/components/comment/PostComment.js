import { CommentCommentForm } from "./CommentCommentForm";
import { LikeComment } from "./LikeComment";
import { Link } from "react-router-dom";

const PostComment = ({ comment, postID }) => {
    return (
        <div>
            <p>{comment.text}</p>
            <p>{comment.date}</p>
            <p>{comment.user.name.full}</p>
            <LikeComment id={comment._id} likes={comment.likes} />
            <CommentCommentForm 
                postID={postID} 
                parentCommentID={comment._id}
                commentOwner={comment.user}
            />
            {comment.childrenComments.length ? 
                <Link to={`../../comments/${comment._id}`}>{comment.childrenComments.length} replies</Link>
                : null
            }
        </div>
    )
}

export { PostComment };