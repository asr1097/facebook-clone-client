import { useState, useEffect, createContext } from "react";
import './styles/App.css';
import { io } from "socket.io-client";
import { Routes, Route, Link } from "react-router-dom";
import { SearchBar } from "./components/SearchBar";
import { IndexPage } from "./components/IndexPage";
import { SendMessage } from "./components/SendMessage";
import { SearchResults } from "./components/SearchResults";

const socket = io("https://localhost:3000/", {
  autoConnect: false
});

const SocketContext = createContext();
const UserContext = createContext();

function App() {

  const [user, setUser] = useState();
  const [loggedIn, setloggedIn] = useState();
  const [socketID, setSocketID] = useState();
  const [activeUsers, setActiveUsers] = useState([]);
  const [searchResult, setsearchResult] = useState();

  useEffect(() => {
    let cookies = document.cookie.split(";");
    cookies.some(cookie => {
      let regex = new RegExp("loggedIn*");
      cookie.match(regex) ? setloggedIn(true): setloggedIn()
    })
  }, [])

  useEffect(() => {
    const fetchUser = async() => {
      const fetchedUserData = await fetch("https://localhost:3000/profile/loggedUser", {
        credentials: "include",
        mode: "cors"  
      })
      const fetchedUser = await fetchedUserData.json()
      setUser(fetchedUser);
      setSocketID(fetchedUser._id)
      console.log("fetch user runs")
    }
    if(!user && !socketID && loggedIn) {fetchUser()}

  }, [loggedIn, user, socketID])

  useEffect(() => {
    if(loggedIn && socketID){
      socket.auth = { socketID };
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected with ID: " + socket.id);
      });

      socket.on("activeUsers", users => {
        let newActiveUsers = [];
        users.forEach(_user => {
          if(user.friendsList.includes(_user.userID)) {newActiveUsers.push(_user.userID)}
        })
        setActiveUsers(newActiveUsers);
      })

      socket.on("new connection", _user => {
        if(user.friendsList.includes(_user)) {
          let newActiveUsers = [];
          activeUsers.forEach(activeUser => newActiveUsers.push(activeUser));
          newActiveUsers.push(_user);
          setActiveUsers(newActiveUsers);
        }
      })

      socket.on("user disconnected", _user => {
        if(activeUsers.includes(_user)) {
          let newActiveUsers = [];
          activeUsers.forEach(activeUser => {
            if(activeUser !== _user) {newActiveUsers.push(activeUser)}
          });
          setActiveUsers(newActiveUsers);
        }
      })
    }

    return () => {
      socket.off("connect");
      socket.off("activeUsers");
      socket.off("new connection");
      socket.off("user disconnected");
    }
  }, [loggedIn, socketID, activeUsers, user]);

  return (
    <div className="App">
      {!loggedIn ? 
      <a href="https://localhost:3000/auth/facebook">Log in</a> :
      <a href="https://localhost:3000/logout">Log out</a>}
      <SearchBar setsearchResult={setsearchResult}/>
      <Link to={"/facebook-clone-client/message"}>
        <button>Message</button>
      </Link>
      <UserContext.Provider value={user}>
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/facebook-clone-client" element={<IndexPage loggedIn={loggedIn}/>}/>
          <Route 
            path="/facebook-clone-client/message" 
            element={<SendMessage />} 
          />
          <Route 
            path="/facebook-clone-client/search" 
            element={<SearchResults users={searchResult}/>} />
        </Routes>
      </SocketContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export { App, SocketContext, UserContext };
