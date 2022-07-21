import { useState, useEffect } from "react";
import { Post } from "./Post";
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

    return (
        <div>
            <NewPost />
            {data ? data.map((post, index) => <Post 
                    key={post._id} 
                    index={index} 
                    post={post}
                    likePost={likePost}
                    unlikePost={unlikePost} 
                />)
            : null}
        </div>
    )
}

export { IndexPage };