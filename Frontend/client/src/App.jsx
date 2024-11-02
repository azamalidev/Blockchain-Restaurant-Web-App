import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/signup';
import Home from '../pages/home';
import ChatApp from '../pages/socket'
import ChatRoom from '../pages/group-chat'

const App = () => {


  return (
    


    // <ChatRoom/>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
