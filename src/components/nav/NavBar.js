import { Link } from "react-router-dom";
import { SearchBar } from "../search/SearchBar";

const NavBar = ({ loggedIn, setsearchResult, unreadNotifsCount, unreadMsgsGlobal, user, friendRequests }) => {
    
        return (
            <nav>
                {!loggedIn ? <a href={`${process.env.REACT_APP_SERVER_URL}/auth/facebook`}>Log in</a> 
                :<a href={`${process.env.REACT_APP_SERVER_URL}/logout`}>Log out</a>}
                {user ?
                <div>
                  <SearchBar setsearchResult={setsearchResult}/>
                  <Link to={"/"}>
                    <button>Home</button>
                  </Link>
                  <Link to={"/requests"}>
                    <button>Friend requests {friendRequests ? friendRequests : null}</button>
                  </Link>
                  <Link to={"/chat"}>
                    <button>Message {unreadMsgsGlobal ? unreadMsgsGlobal : null}</button>
                  </Link>
                  <Link to={"/notifications"}>
                    <button>Notifications {unreadNotifsCount ? unreadNotifsCount : null}</button>
                  </Link>
                  <Link to={`/profile/${user._id}`}>{user.name.full}</Link>
                </div> 
                  : null}
            </nav>
        )
    
};

export { NavBar };