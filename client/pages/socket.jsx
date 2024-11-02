import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to backend
const ChatApp = () => {
  const [messages, setMessage] = useState('');
  const [name, setName] = useState('');
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState([]);
  const [userId, setUserId] = useState('')
  // const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    socket.on('user-connected-list', (user) => {
      console.log(user, 'message')
    });

    // Handle receiving private messages
    socket.on('receive-privateMessage', (message) => {
      console.log('Receive Private message')
      setChat((prev) => [...prev, `Private: ${message.recipient}: ${message.message}`]);
    });


    socket.emit('get-user-list');
    socket.on('get-users-list', (user) => {
      console.log(user)
      setUser(user)
    });
    // // Handle receiving group messages
    // socket.on('group-message', (message) => {
    //   console.log('Receive Group message')
    //   setChat((prev) => [...prev, `Group: ${message.sender}: ${message.message}`]);
    // });

    // Handle receiving real-time notifications
    // socket.on('receive-notification', (notification) => {
    //   console.log('Receive Public message')
    //   setNotifications((prev) => [...prev, notification]);
    // });

    // return () => {

    //   socket.off('group-message');
    //   socket.off('receive-notification');
    // };
  }, []);


  const connectWithSocket = () => {
    socket.emit('register', name);
    socket.emit('get-user-list');
  }
  // Send private message
  function sendPrivateMessage() {
    socket.emit('privateMessage', {
      sender: "Gh23",
      recipient: userId, // The username of the person you're sending the message to
      message: messages
    });
  }

  // Send group message
  // const sendGroupMessage = (room) => {
  //   socket.emit('group-message', { content: message, room });
  // };

  // Send notification
  // const sendNotification = () => {
  //   socket.emit('send-notification', { content: message });
  // };


  // socket.on('privateMessage', ({ sender, message }) => {
  //   console.log(`Private message from ${sender}: ${message}`);
  // });

  return (
    <div>
      {/* <div>
        <h2>Notifications</h2>
        {notifications.map((note, index) => (
          <div key={index}>{note.content}</div>
        ))}
      </div> */}
      Enter User Name With which you want to connect socket
      <input onChange={(e) => setName(e.target.value)} />
      <button onClick={() => connectWithSocket()}>Connect With User name</button>
      <div>
        <h2>Chat</h2>
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>

      <input value={messages} onChange={(e) => setMessage(e.target.value)} />
      <select id="dropdown"  onChange={(e)=> setUserId(e.target.value)}>
        <option value="">Select User To whom you wnat to send message : </option>
        {user.map((option, index) => (
          <option key={index} value={option.socketID}>
            {option.name}
          </option>
        ))}
      </select>
      <button onClick={() => sendPrivateMessage()}>Send Private Message</button>
      {/* <button onClick={() => sendGroupMessage('room1')}>Send Group</button>
      <button onClick={sendNotification}>Send Notification</button> */}
    </div>
  );
};

export default ChatApp;
