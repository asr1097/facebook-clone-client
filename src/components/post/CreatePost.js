const CreatePost = () => {

    const createPost = (ev) => {
        ev.preventDefault();
        let formData = new FormData();
        formData.append("text", ev.target.text);
        if(ev.target.imageField){ formData.append("imageField", ev.target.imageField);}
       
    }

    return (
        <form onSubmit={createPost}>
            <input type="text" name="text"></input>
            <input type="file" name="imageField"></input>
            <input type="submit"></input>
        </form>
    )
}