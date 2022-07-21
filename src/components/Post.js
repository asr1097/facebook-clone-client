import { LikePost } from "./LikePost";

const Post = ({ post, index, likePost, unlikePost }) => {
    return (
        <div key={post._id}>
            {post.image ? <img alt="Post" src={"https://localhost:3000/images/" + post.image}></img> 
            : null}
            <p>{post.user.name.full}</p>
            <p>{post.text}</p>
            <p>{post.date}</p>
            {post.comments.map(comment => {
                return (
                    <div key={comment._id}>
                    <p>{comment.text}</p>
                    <p>{comment.date}</p>
                    </div>)
                }
            )}
            <LikePost 
                postID={post._id} 
                index={index} 
                likes={post.likes} 
                likePost={likePost}
                unlikePost={unlikePost}
            />
            <hr />
        </div>
    )
}

export { Post };