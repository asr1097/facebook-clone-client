import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { PostComment } from "../comment/PostComment";
import { LikePost } from "./LikePost";
import { PostCommentForm } from "../comment/PostCommentForm";
import { UserContext } from "../../App";

const Post = () => {

    const [post, setPost] = useState();
    const params = useParams();
    const user = useContext(UserContext);

    const singlePostLiked = () => {
        let newPost = {...post};
        newPost.likes.push(user);
        setPost(newPost);
    };

    const singlePostUnliked = () => {
        let newPost = {...post};
        let newLikes = newPost.likes.filter(_user => _user._id !== user._id);
        newPost.likes = newLikes;
        setPost(newPost);
    };

    const singlePostPushComment = (comment) => {
        let newPost = {...post};
        newPost.comments.push(comment);
        setPost(newPost);
    }

    useEffect(() => {
        const fetchPost = async() => {
            let response = await fetch(`https://localhost:3000/posts/${params.id}`, {
                mode: "cors",
                credentials: "include"
            });
            let post = await response.json();
            setPost(post)
        };

        fetchPost();

        return (() => {
            setPost();
        });

    }, [params.id]);

    if(post) {
        return (
            <div key={post._id}>
                {post.image ? <img alt="Post" src={"https://localhost:3000/images/" + post.image}></img> 
                : null}
                <p>{post.user.name.full}</p>
                <p>{post.text}</p>
                <p>{post.date}</p>
                <LikePost 
                    postID={post._id} 
                    likes={post.likes}
                    singlePostLiked={singlePostLiked}
                    singlePostUnliked={singlePostUnliked} 
                />
                <PostCommentForm 
                    postID={post._id}
                    user={post.user._id}
                    singlePostPushComment={singlePostPushComment}
                />
                {post.comments.map(comment => {
                    if(!comment.parentComment){
                        return (
                            <div>
                                <PostComment
                                    key={comment._id} 
                                    comment={comment}
                                    postID={post._id} 
                                />
                                
                            </div>)
                    } else {
                        return null;
                    }})
                }
               
                <hr />
            </div>
        )
    }
};

export { Post };