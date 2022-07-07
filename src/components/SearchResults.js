import { SRFriendRequest } from "./SearchResultsFriendRequest";

const SearchResults = ({users}) => {
    return (
        <div>
            {users ? 
            users.map(profile => {
                    return (
                        <div>
                            <img 
                                src={`https://localhost:3000/${profile.profilePhoto}`} 
                                alt={"Profile"}
                            />
                            <p>{profile.name.full}</p>
                            <SRFriendRequest profile={profile} />
                            <hr/>
                        </div>
                    )
                } 
            )
            : <div>Type a name into search bar to search for friends!</div>}
        </div>
    )
}

export { SearchResults };