import { FriendRequestStatus } from "../profile/FriendRequestStatus";
import { useEffect } from "react";

const SearchResults = ({ users, setsearchResult }) => {

    useEffect(() => {
        return (() => {
            setsearchResult();
        })
    }, []);

    if(users) {
        if(!users.length) {return <p>No results found.</p>}
        else {
            return (
                users.map(profile => {
                    return (
                        <div>
                            <img 
                                src={`https://localhost:3000/${profile.profilePhoto}`} 
                                alt={"Profile"}
                            />
                            <p>{profile.name.full}</p>
                            <FriendRequestStatus profile={profile} />
                            <hr/>
                        </div>
                    )
                })
            )
        }
    } else {
        return <div>Type a name into search bar to search for friends!</div>
    }
}

export { SearchResults };