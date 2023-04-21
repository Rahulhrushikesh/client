import React, { useState , useEffect, } from "react";
import socketIOClinet from "socket.io-client";
import ChatBoxReciever, { ChatBoxSender } from "./ChatBox";
import UserLogin from "./UserLogin";
import InputText from "./InputText";


export default function ChatContainer() {
    
    let socketio  = socketIOClinet("http://localhost:5001")
    const [chats , setChats] = useState([])
    const [user , setUser] = useState(localStorage.getItem("user"))
    const [avatar , setAvatar] = useState(localStorage.getItem("avatar"))


    useEffect(() => {
        socketio.on('chat', senderChats => {
            setChats(senderChats)
        })
    })

    function sendChatToSocket(chat) {
        socketio.emit("chat" , chat)
    }

    function addMessage(chat) {
        const newChat = {...chat , user  , avatar}
        setChats([...chats , newChat])
        sendChatToSocket([...chats , newChat])
    }


    function logout() {
        localStorage.removeItem("user")
        localStorage.removeItem("avatar")
        setUser("")
    }
    function ChatsList() {
        return chats.map((chat, index) => {
            if(chat.user === user) return <ChatBoxSender key={index} message={chat.message} avatar={chat.avatar} user={chat.user}/>
            return <ChatBoxReciever key={index} message={chat.message} avatar={chat.avatar}  user={chat.user}/>
        })
    }

    return (
        <div>
            {
            user ? 
            <div>
                <div style={{display:'flex', flexDirection:"row", justifyContent:"space-between"}} >
                    <h3>USERNAME: {user}</h3>
                    <p onClick={() => logout()} style={{color:"brown", cursor:"pointer"}} > Log Out </p>
                </div>
                    <ChatsList/>
                    <InputText addMessage={addMessage} />

            </div>
            :
            
             <UserLogin setUser={setUser} />
            }


        </div>
    )
}