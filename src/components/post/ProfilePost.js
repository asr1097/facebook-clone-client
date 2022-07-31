import { LikePost } from "./LikePost";
import { PostCommentForm } from "../comment/PostCommentForm";
import { PostComment } from "../comment/PostComment";
import { LikeList } from "../profile/LikeList";

const ProfilePost = ({ post, user, index, likePost, unlikePost, pushNewComment }) => {

    return (
        <div>
            {post.image ? <img src={`https://localhost:3000/images/${post.image}`} alt="Post"/> 
            : null}
            <p>{user.name.full}</p>
            <p>{post.text}</p>
            <p>{post.date}</p>
            <LikePost 
                postID={post._id}
                likePost={likePost}
                unlikePost={unlikePost}
                index={index}
                likes={post.likes}
            />
            <PostCommentForm 
                postID={post._id}
                user={post.user._id}
                index={index}
                pushNewComment={pushNewComment}
            />
            {post.comments.map(comment => {
                if(!comment.parentComment){
                    return <PostComment comment={comment} postID={post._id}/>
                }
                return null;
            })}
            <hr />
        </div>
    )

};

export { ProfilePost };