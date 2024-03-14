import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome_page';
import Sign_in from './components/Sign_in';
import Sign_up from './components/Sign_up';
import Chat from './components/Chat';
import ChatDisplay from './components/ChatDisplay';
import PrivateRoute from './components/utils/PrivateRoute';
import { AuthProvider } from './components/context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
function App() {
  const theme = createTheme();
  return (
    <>
     <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          
          <Route path="/sign_in" element={<Sign_in />} />
          <Route path="/sign_up" element={<Sign_up />} />
          <Route
            path="/chat"
            element = { <PrivateRoute Component={Chat} />}
          />
           <Route
            path="/chat_test"
            element = { <PrivateRoute Component={ChatDisplay} />}
          />
          {/* Add more routes as needed */}
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
