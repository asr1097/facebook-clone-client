import { LikePost } from "./LikePost";
import { PostCommentForm } from "./PostCommentForm";
import { PostComment } from "./PostComment";

const Post = ({ post, index, likePost, unlikePost, pushNewComment }) => {
    return (
        <div key={post._id}>
            {post.image ? <img alt="Post" src={"https://localhost:3000/images/" + post.image}></img> 
            : null}
            <p>{post.user.name.full}</p>
            <p>{post.text}</p>
            <p>{post.date}</p>
            {post.comments.map(comment => {
                if(!comment.parentComment){
                    return (
                        <div>
                            <PostComment
                                key={comment._id} 
                                comment={comment}
                                postID={post._id}
                                index={index}
                                pushNewComment={pushNewComment} 
                            />
                            
                        </div>)
                } else {
                    return null;
                }})
            }
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
            <hr />
        </div>
    )
}

export { Post };