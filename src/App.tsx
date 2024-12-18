import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  );
}

export default App;