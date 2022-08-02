import { LikePost } from "./LikePost";
import { PostCommentForm } from "../comment/PostCommentForm";
import { PostComment } from "../comment/PostComment";

const PostIndex = ({ post, index, likePost, unlikePost, pushNewComment }) => {
    return (
        <div key={post._id}>
            {post.image ? <img alt="Post" src={"https://localhost:3000/images/" + post.image}></img> 
            : null}
            <p>{post.user.name.full}</p>
            <p>{post.text}</p>
            <p>{post.date}</p>
             <LikePost 
                postID={post._id} 
                index={index} 
                likes={post.likes} 
                likePost={likePost}
                unlikePost={unlikePost}
            />
            <PostCommentForm 
                postID={post._id}
                user={post.user._id}
                index={index}
                pushNewComment={pushNewComment}
            />
            {post.comments.map(comment => {
                if(!comment.parentComment){
                    return (
                        <PostComment
                            key={comment._id} 
                            comment={comment}
                            postID={post._id}
                            index={index}
                            pushNewComment={pushNewComment} 
                        />
                    )
                } else {
                    return null;
                }})
            }
           
            <hr />
        </div>
    )
}

export { PostIndex };