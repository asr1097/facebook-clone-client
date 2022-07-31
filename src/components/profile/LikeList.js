import { useContext, useState } from "react";
import { UserContext } from "../../App";
import { FriendRequestStatus } from "./FriendRequestStatus";
import { Link } from "react-router-dom";

const LikeList = ({ likes }) => {
    const [showList, setShowList] = useState(false);
    const user = useContext(UserContext);

    if(likes && showList) {
        return (
            <div>
                {likes.map(user => {
                    return (
                        <div>
                            <Link to={`../${user.url}`}>
                                <img src={`https://localhost:3000/images/${user.profilePhoto}`} alt="Profile"/>
                            </Link>
                            <Link to={`../${user.url}`}>{user.name.full}</Link>
                            <FriendRequestStatus profile={user} />
                        </div>
                    )
                })}
                <button onClick={() => setShowList(false)}>Close</button>
            </div>
        )
    } else if(likes && likes.length) {
        return <button onClick={() => setShowList(true)}>{likes.length} likes</button>
    } else {return null}
};

export { LikeList };