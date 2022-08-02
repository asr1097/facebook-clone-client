import { useState, useEffect } from "react";
import { PostIndex } from "./PostIndex";
import { NewPost } from "./NewPost";

const IndexPage = ({loggedIn, user}) => {
    const [data, setData] = useState();

    const likePost = (index) => {
        let newData = [...data];
        newData[index].likes.push(user);
        setData(newData);
    }

    const unlikePost = (index) => {
        let newData = [...data];
        let filteredPostLikes = newData[index].likes.filter(_user => _user._id !== user._id);
        newData[index].likes = filteredPostLikes;
        setData(newData);
    }

    const pushNewComment = (index, comment) => {
        let newData = [...data];
        newData[index].comments.splice(0, 0, comment);
        setData(newData);
    };

    useEffect(() => {
        if(loggedIn){
          fetch("https://localhost:3000/", {
            credentials: "include",
            mode: "cors"  
          })
            .then(res => res.json())
            .then(res => {setData(res.posts)})
            .catch(err => console.log(err))
        }
    }, [loggedIn]);

    if(data) {
        return (
            <div>
                <NewPost />
                {data.map((post, index) => <PostIndex 
                        key={post._id} 
                        index={index} 
                        post={post}
                        likePost={likePost}
                        unlikePost={unlikePost}
                        pushNewComment={pushNewComment} 
                    />)
                }
            </div>
           
        )
    }
}

export { IndexPage };