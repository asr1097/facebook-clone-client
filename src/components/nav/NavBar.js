import { Link } from "react-router-dom";
import { SearchBar } from "../search/SearchBar";

const NavBar = ({ loggedIn, setsearchResult, unreadNotifsCount, user }) => {
    
        return (
            <nav>
                {!loggedIn ? <a href="https://localhost:3000/auth/facebook">Log in</a> 
                :<a href="https://localhost:3000/logout">Log out</a>}
                {user ?
                <div>
                  <SearchBar setsearchResult={setsearchResult}/>
                  <Link to={"/"}>
                    <button>Home</button>
                  </Link>
                  <Link to={"/chat"}>
                    <button>Message</button>
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