import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Welcome.css';  // Import your CSS file

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="center-container welcome-page">
      <div className="container content-around p-8 text-[1.5vw] text-white">
        <div className="items_container flex justify-center">
          <div className="items" id="desc">
            <h1 className="items text-[2.2em]">Welcome to our ChatBot</h1>
            <h3 className="mx-36 ">Here you can connect with anyone!</h3>
          </div>
          <div className="items flex flex-col" id="buttons">
            <Link to="/sign_in" className="mx-4 mt-10 bg-slate-900 p-4 px-28 rounded-xl hover:bg-black hover:text-white">Login With Email</Link>
            <Link to="/sign_up" className='text-center my-2'>New User? Sign Up</Link>
          </div>
          <div className="items" id="misc"></div>
        </div>
      </div>
    </div>
  );
}
