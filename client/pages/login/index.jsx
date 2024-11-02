import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Import the CSS file
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login', { email, password });

    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        email,
        password
      });

      console.log('Response:', response);
      if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
        toast.success("Login Successful")

        navigate('/home');
      }else{
        toast.error('User not exist with this mail')
      }
    } catch (error) {
      // Handle error
      toast.error(error.response.data.message)
      setError(error.response ? error.response.data.message : 'An error occurred');
      console.error('Error:', error);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer/>
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </label>
          <button type="submit" className="auth-button">Login</button>
          <small className='not-have-account-span'>Don't have <span className='not-have-account' onClick={()=> navigate("/signup")}>Account</span></small>
        </form>
      </div>
    </div>
  );
};

export default Login;
