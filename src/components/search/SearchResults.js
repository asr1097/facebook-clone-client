import { FriendRequestStatus } from "../profile/FriendRequestStatus";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const SearchResults = ({ users, setsearchResult }) => {

    if(users) {
        if(!users.length) {return <p>No results found.</p>}
        else {
            return (
                users.map(profile => {
                    return (
                        <div key={profile._id}>
                            <Link to={`../${profile.url}`}>
                                <img 
                                    src={`https://localhost:3000/${profile.profilePhoto}`} 
                                    alt={"Profile"}
                                />
                            </Link>
                            <Link to={`../${profile.url}`}> {profile.name.full}</Link>
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