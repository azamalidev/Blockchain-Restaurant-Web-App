import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Change to your backend URL

function ChatRoom() {
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [user, setUser] = useState('User' + Math.floor(Math.random() * 1000)); // Example user

    // Join a room
    const joinRoom = () => {
        if (room !== '') {
            socket.emit('joinRoom', room);
        }
    };

    // Send a message
    const sendMessage = () => {
        if (message !== '' && room !== '') {
            socket.emit('sendMessage', { room, message, user });
            setMessage('');
        }
    };

    // Listen for incoming messages
    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            setChatMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    return (
        <div>
            <h2>Group Chat Room</h2>

            <input
                type="text"
                placeholder="Enter room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>

            <div>
                <input
                    type="text"
                    placeholder="Enter message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send Message</button>
            </div>

            <div>
                <h3>Messages in {room}</h3>
                <ul>
                    {chatMessages.map((msg, index) => (
                        <li key={index}>
                            <strong>{msg.user}: </strong>{msg.message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ChatRoom;
