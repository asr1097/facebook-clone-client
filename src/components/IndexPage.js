import { useState, useEffect } from "react";

const IndexPage = (props) => {
    const [data, setData] = useState();

    useEffect(() => {
        if(props.loggedIn){
          fetch("https://localhost:3000/", {
            credentials: "include",
            mode: "cors"  
          })
            .then(res => res.json())
            .then(res => {setData(res.posts)})
            .catch(err => console.log(err))
        }
    }, [props.loggedIn]);

    return (
        <div>
            {data ? data.map(post => {
                return (
                <div key={post._id}>
                    <p>{post.user.name.full}</p>
                    <p>{post.text}</p>
                    <p>{post.date}</p>
                    {post.comments.map(comment => {
                        return (
                        <div key={comment._id}>
                        <p>{comment.text}</p>
                        <p>{comment.date}</p>
                        </div>)}
                    )}
                    {post.image ? <img alt="Post" src={"https://localhost:3000/images/" + post.image}></img> : null}
                    <hr />
                </div>
                )})
                : null}
        </div>
    )
}

export { IndexPage };