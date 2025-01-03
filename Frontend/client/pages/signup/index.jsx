import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Import the CSS file
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    try {
      const response = await axios.post('http://localhost:3000/users', {
        name,
        email,
        password,
        address
      });

      console.log('Response:', response.data);
      if(response.data){
        toast.success("Your account has been created successfully")
        setTimeout(()=>{
          navigate('/login');
        },[7000])
      }
    } catch (error) {
      // Handle error
      setError(error.response ? error.response.data.message : 'An error occurred');
      toast.error(error)

      console.error('Error:', error);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer/>
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
        <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
            />
          </label>
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
          <label>
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="auth-input"
            />
          </label>
          <button type="submit" className="auth-button">Sign Up</button>
          <small className='not-have-account-span'>Already have <span className='not-have-account' onClick={()=> navigate("/login")}>Account</span></small>
        </form>
      </div>
    </div>
  );
};

export default Register;
