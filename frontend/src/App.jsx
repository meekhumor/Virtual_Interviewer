import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./components/Register/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import './index.css'

import Home from './components/Home/Home';
import Layout from "./Layout";
import Dashboard from './components/Dashboard/Dashboard';
import Category from './components/Category/Category';
import Permission from './components/Permission/Permission';
import Camera_Preview1 from './components/Camera_Preview/Camera_Preview1';
import Camera_Preview2 from './components/Camera_Preview/Camera_Preview2';
import Resume from './components/Resume/Resume';
import Review_Interview from './components/Review_Interview/Review_Interview';
import Analysis from './components/Review_Interview/Analysis';
import About from './components/About/About';
import Contact from './components/Contact/Contact';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="interview-category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
            <Route path="cam-permission" element={<ProtectedRoute><Permission /></ProtectedRoute>} />
            <Route path="register" element={<RegisterAndLogout />} />
            <Route path="cam-preview1" element={<ProtectedRoute><Camera_Preview1 /></ProtectedRoute>} />
            <Route path="cam-preview2" element={<ProtectedRoute><Camera_Preview2 /></ProtectedRoute>} />
            <Route path="resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
            <Route path="review-interview" element={<ProtectedRoute><Review_Interview /></ProtectedRoute>} />
            <Route path="analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
            <Route path="about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
