import { useState, useEffect, createContext } from "react";
import './styles/App.css';
import { io } from "socket.io-client";
import { Routes, Route, Link } from "react-router-dom";
import { SearchBar } from "./components/SearchBar";
import { IndexPage } from "./components/IndexPage";
import { SearchResults } from "./components/SearchResults";
import { ChatWindow } from "./components/ChatWindow";


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

  const [messages, setMessages] = useState({});
  const [activeRoom, setActiveRoom] = useState();

  const readMessages = (friend, msgArray=[]) => {

     /* 
      If the chatroom is already active when message from friend is received,
      "msgArray" is passed from socketIO event handler so the received message
      will be marked as "read" imediately.
    */
    let readMessages = [];
    if(msgArray.length){readMessages.push(msgArray[0]._id)}
    
    if(!msgArray.length){
      /* 
        When the chatroom is opened, loop messages from the last one 
        and check if it's been read - if not, push it to the "readMessages".
        When first read message is reached, break from the loop.
      */
      for(let i = messages[friend].length - 1; i >= 0; i--) {
        if(messages[friend][i].from === friend && !messages[friend][i].content.read){
          readMessages.push(messages[friend][i]._id)
        }
        else if(messages[friend][i].from === friend && messages[friend][i].content.read){
          break;
        }
      };
    }
    if(readMessages.length) {
      let formData = new FormData();
      formData.append("readMessages", readMessages);
      formData.append("friend", friend);
      fetch("https://localhost:3000/messages/read", {
        credentials: "include",
        method: "post",
        mode: "cors",
        body: formData
      }).then(res => {
        if(res.ok) {
          let newMessages = {...messages};
          if(msgArray.length){newMessages[friend] = [...newMessages[friend], msgArray[0]]}
          else {
            for(let i = newMessages[friend].length - 1; i >= 0; i--){
              newMessages[friend][i].content.read = true;
            }
          }
          setMessages(newMessages);
        }
      })
    } else {return 0};
  };

  useEffect(() => {
    let cookies = document.cookie.split(";");
    cookies.some(cookie => {
      let regex = new RegExp("loggedIn*");
      cookie.match(regex) ? setloggedIn(true): setloggedIn()
    })
  }, [])

  useEffect(() => {

    const fetchMessages = async() => {
      const fetchedMessagesData = await fetch("https://localhost:3000/messages", {
        credentials: "include",
        mode: "cors" 
      })
      const fetchedMessages = await fetchedMessagesData.json();
      onFetchMessages(fetchedMessages);
    }

    const onFetchMessages = (messages) => {
      let fetchedMessages = {};
      messages.forEach(msg => {
      let friend = msg.from === user._id ? msg.to : msg.from;
      if(friend in fetchedMessages){
        fetchedMessages[friend] = [...fetchedMessages[friend], msg];
      } else {
        fetchedMessages[friend] = [msg];
      };
    })  
    setMessages(fetchedMessages);
    };

    if(user && loggedIn) {fetchMessages()};

  }, [user, loggedIn]);

  useEffect(() => {
    const fetchUser = async() => {
      const fetchedUserData = await fetch("https://localhost:3000/profile/loggedUser", {
        credentials: "include",
        mode: "cors"  
      })
      const fetchedUser = await fetchedUserData.json()
      setUser(fetchedUser);
      setSocketID(fetchedUser._id)
    };

    if(!user && !socketID && loggedIn) {fetchUser();};

  }, [loggedIn, user, socketID])

  useEffect(() => {

    const onMessage = (msg) => {
      let sender = msg.from;
      let newMessages = {...messages};
      if(sender === activeRoom){
        msg.content.read = true;
        readMessages(sender, [msg])
        return;
      } else {
        if(sender === user._id) {
          if(msg.to in newMessages) {newMessages[msg.to] = [...newMessages[msg.to], msg]} 
          else {newMessages[msg.to] = [msg]};
        }
        else if(sender in newMessages) {
          newMessages[sender] = [...newMessages[sender], msg]
        } 
        else {newMessages[sender] = [msg]}
        setMessages(newMessages);
      }    
    };

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

      socket.on("new message", onMessage);

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
      socket.off("new message");
      socket.off("user disconnected");
    }
  }, [loggedIn, socketID, activeUsers, user, messages]);

  return (
    <div className="App">
      {!loggedIn ? 
      <a href="https://localhost:3000/auth/facebook">Log in</a> :
      <a href="https://localhost:3000/logout">Log out</a>}
      <SearchBar setsearchResult={setsearchResult}/>
      <Link to={"/facebook-clone-client/chat"}>
        <button>Message</button>
      </Link>
      <UserContext.Provider value={user}>
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/facebook-clone-client" element={<IndexPage loggedIn={loggedIn}/>}/>
          <Route 
            path="/facebook-clone-client/chat" 
            element={<ChatWindow 
              activeUsers={activeUsers}
              messages={messages}
              readMessages={readMessages}
              activeRoom={activeRoom}
              setActiveRoom={setActiveRoom}
              />} 
          />
          <Route 
            path="/facebook-clone-client/search" 
            element={<SearchResults users={searchResult}/>} 
          />
        </Routes>
      </SocketContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export { App, SocketContext, UserContext };