import React, { createContext, useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState({});
    const navigate=useNavigate();
    const [auth_token, setAuth_token] = useState(
        localStorage.getItem('auth_token') ? JSON.parse(localStorage.getItem('auth_token')) : null
      );
      
    

      const loginUser = async (e) => {
        e.preventDefault();
        console.log("Form Submitted");
        const formData = new FormData();
        formData.append('phone_number', e.target.phone_number.value);
        formData.append('password', e.target.password.value);
    
        try {
            let response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                body: formData,
            });
    
            let data = await response.json();
            setUserData({
                ...userData,
                data: data
            });
    
            if(response.status === 200){
                localStorage.setItem('auth_token', JSON.stringify(data.access_token))
                navigate('/chat_test')
            }
         
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    const logOut = async (user_id) => {
        // console.log("Log Out ID: " + user_id); This is working correctly
        const formData = new FormData();
        formData.append('user_id', user_id);
        
        try {
            const response = await fetch('http://127.0.0.1:8000/logout/', {
              method: 'POST',
              body: formData,
            });
      
            if (!response.ok) {
              throw new Error(`Logout request failed with status ${response.status}`);
            }
      
            const data = await response.json();
      
            localStorage.removeItem('auth_token'); // Remove auth token from local storage
            navigate('/sign_in')
      
            // Handle successful logout here, e.g., redirect to login page
            console.log('Logout successful:', data);
            // window.location.href = '/login'; // Redirect to login page
          } catch (error) {
            console.error('Logout error:', error);
          }

    }

    // console.log("This is the User Data: ");
    // console.log(userData);

    const contextValue = {
        ...userData,
        loginUser: loginUser,
        logOut: logOut
    };

    return (
        <AuthContext.Provider value={{userData, loginUser, logOut, auth_token}}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
