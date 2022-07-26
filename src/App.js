import { useState, useEffect, createContext } from "react";
import './styles/App.css';
import { io } from "socket.io-client";
import { Routes, Route, Link } from "react-router-dom";
import { SearchBar } from "./components/SearchBar";
import { IndexPage } from "./components/IndexPage";
import { SearchResults } from "./components/SearchResults";
import { ChatWindow } from "./components/ChatWindow";
import { Notifications } from "./components/Notifications";
import { Comment } from "./components/Comment";


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

  const [notifications, setNotifications] = useState([]);
  const [notifsActive, setNotifsActive] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState();

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
              if(newMessages[friend][i].content.read) {break}
              newMessages[friend][i].content.read = true;
            }
          }
          setMessages(newMessages);
        }
      })
    } else {return 0};
  };

  /* Fetch read notifications when "Notifications" component is active */
  useEffect(() => {

    const readNotifications = () => {
      let readNotifsIDs = [];
      for (let i = notifications.length - 1; i >= 0; i--) {
        if(!notifications[i].read) {
        
          readNotifsIDs.push(notifications[i]._id)
        }
        else {break}
      };
      return readNotifsIDs;
    };
    
    const fetchReadNotifs = async() => {
      let notifs = readNotifications();
      if(notifs.length) {
        let formData = new FormData()
        formData.append("notifs", notifs);
        let statusCode = await fetch("https://localhost:3000/notifications/read", {
          mode: "cors",
          credentials: "include",
          method: "post",
          body: formData
        })
        if(statusCode === 200){
          let newNotifications = [...notifications];
          for (let i = notifs.length - 1; i >= 0; i--) {
            newNotifications[i].read = true;
          }
          setNotifications(newNotifications);
        }
      } else{return}
    };

    if(notifsActive) {
      setUnreadNotifsCount(0)
      fetchReadNotifs()
    };

  }, [notifsActive, notifications])

  /* Fetch notifications */
  useEffect(() => {
    const fetchNotifications = async() => {
      const fetchedNotifsData = await fetch("https://localhost:3000/notifications", {
        credentials: "include",
        mode: "cors"
      })
      const fetchedNotifs = await fetchedNotifsData.json();
      setNotifications(fetchedNotifs);
    };

    if(user && loggedIn) {fetchNotifications()}

  }, [user, loggedIn])

  useEffect(() => {
    let unreadNotifs = 0;
      for (let i = notifications.length - 1; i >= 0; i--) {
        if(!notifications[i].read) {
          unreadNotifs++;
        }
        else {break}
      };
      setUnreadNotifsCount(unreadNotifs);
    }, [notifications])

  /* Check if user is logged in by checking cookies */
  useEffect(() => {
    let cookies = document.cookie.split(";");
    cookies.some(cookie => {
      let regex = new RegExp("loggedIn*");
      cookie.match(regex) ? setloggedIn(true): setloggedIn()
    })
  }, [])

  /* Fetch messages */
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

  /* Fetch user data */
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

  /* SocketIO events handlers */
  useEffect(() => {

    const onNotification = (notif) => {
      if(notifsActive){notif.read = true};
      let newNotifications = [...notifications, notif];
      setNotifications(newNotifications);
    }

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

      socket.on("new notification", onNotification);

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
      socket.off("new notification");
    }
  }, [loggedIn, socketID, activeUsers, user, messages]);

  return (
    <div className="App">
      {!loggedIn ? 
      <a href="https://localhost:3000/auth/facebook">Log in</a> :
      <a href="https://localhost:3000/logout">Log out</a>}
      <SearchBar setsearchResult={setsearchResult}/>
      <Link to={"/chat"}>
        <button>Message</button>
      </Link>
      <Link to={"/notifications"}>
        <button>Notifications {unreadNotifsCount}</button>
      </Link>
      <UserContext.Provider value={user}>
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/" 
            element={<IndexPage 
              loggedIn={loggedIn}
              user={user}
              />}
            />
          <Route 
            path="/chat" 
            element={<ChatWindow 
              activeUsers={activeUsers}
              messages={messages}
              readMessages={readMessages}
              activeRoom={activeRoom}
              setActiveRoom={setActiveRoom}
              />} 
          />
          <Route 
            path="/search" 
            element={<SearchResults users={searchResult}/>} 
          />
          <Route 
            path="/notifications"
            element={<Notifications 
              notifs={notifications}
              setNotifsActive={setNotifsActive}
              />}
          />
          <Route
            path="/comments/:id"
            element={<Comment />}
          />
        </Routes>
      </SocketContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export { App, SocketContext, UserContext };
