import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Sign_up.css' 
import { AuthContext } from './context/AuthContext';
import axios from 'axios'
export default function Sign_up() {

  const [formData, setformData] = useState({
    phone_number: '',
    email: '',
    password: '',
    username: '',
  })

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const submitForm = async (e) => {
    e.preventDefault();
  
    // Construct FormData object
    const form_Data = new FormData();
    form_Data.append('phone_number', formData.phone_number);
    form_Data.append('email', formData.email);
    form_Data.append('password', formData.password);
    form_Data.append('username', formData.username);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/sign_up/', {
        method: 'POST',
        body: form_Data, // Pass FormData object as the body
      });
  
      const data = await response.json();
      console.log(data); // Handle the response from the server
    } catch (error) {
      console.error('Error:', error);
    }
    
  };

  
  return (
    <div className = "full_height bg-indigo-400" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url("../assets/welcome_bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="main_container flex bg-white">
      <div className="img_container bg-slate-500 p-80"></div>
        <div className="form_container flex flex-col space-y-5 p-40 px-[10vw] text-xl">

        <h1 className='text-4xl mb-6'>Create Your Account</h1>
        <form onSubmit={submitForm}>

        <label htmlFor="phone_number">Phone Number</label>
        <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required placeholder='Enter Your Phone #' />
        <label htmlFor="username">Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder='Enter Your Username' />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder='Enter Your Email' />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder='Enter Your Password' />
        <button className='bg-indigo-500 p-4 px-10 rounded-xl mt-6 hover:bg-indigo-400'>Sign Up</button>

        </form>
        <div className="additional_btns">
          <p className='text-center'>Already Have An Account? <Link to="/sign_in" className='font-bold underline hover:text-indigo-800'>Sign In</Link></p>
        </div>
        </div>
        
      </div>
    </div>
  );
}
