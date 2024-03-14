import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sign_in.css'
import { AuthContext, AuthProvider } from './context/AuthContext';
export default function Sign_in() {
  let {loginUser} = useContext(AuthContext)
  
const [sign_in_data, setsign_in_data] = useState({
  phone_number: "",
  password: "",
})

const handleChange = (e) => {
  setsign_in_data({ ...sign_in_data, [e.target.name]: e.target.value });
};
return (
  <div className="full_height bg-indigo-400" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url("../assets/welcome_bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="main_container flex bg-white">
      <div className="img_container bg-slate-500 p-80"></div>
      <div className="form_container flex-col space-y-5 p-40 px-[10vw] text-xl"> {/* Adjusted padding */}
        <h1 className='text-4xl mb-6 text-center'>Sign In</h1> {/* Centered text */}

        <form className = 'flex flex-col space-y-8' onSubmit={loginUser}>
          <label htmlFor="phone_number">Phone Number</label>
          <input type="tel" name="phone_number" onChange={handleChange} value={sign_in_data.phone_number} placeholder='Enter Your Phone #' />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" onChange={handleChange} value={sign_in_data.password} required placeholder='Enter Your Password' />
          <button className='bg-indigo-500 p-4 px-10 rounded-xl mt-6 hover:bg-indigo-400'>Sign In</button>
        </form>

        <div className="additional_btns">
          <p className='text-center'>Don't Have An Account? <Link to="/sign_up" className='font-bold underline hover:text-indigo-800'>Create New Account</Link></p>
        </div>
        
      </div>
    </div>
  </div>
);

}
