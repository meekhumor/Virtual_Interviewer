import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register/Register";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import './index.css'
import 'regenerator-runtime/runtime';


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
import About from "./components/Home/About";
import Contact from "./components/Home/Contact";
import Courses from "./components/Courses/Courses";
import Practice from "./components/Practice/Practice";
import Email_Verification from "./components/Email_Verification/Email_Verification";
import Interview_Setting from "./components/Interview_Setting/Interview_Setting";
import Interview_Simulator from "./components/Interview_Simulator/Interview_Simulator";
import Animation from "./components/Animation";
import Acknowledgement from "./components/Home/Acknowledgement";
import Support from "./components/Home/Support";
import Review_Interface from "./components/Review_Interview/Review_Interface";
import DisplayResume from "./components/Check";

function Logout() {
  localStorage.clear();
  return <Navigate to="/register" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
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
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="logout" element={<Logout />} />
            <Route path="courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
            <Route path="email-verification" element={<ProtectedRoute><Email_Verification /></ProtectedRoute>} />
            <Route path="interview-setting" element={<ProtectedRoute><Interview_Setting /></ProtectedRoute>} />
            <Route path="interview-simulator" element={<ProtectedRoute><Interview_Simulator /></ProtectedRoute>} />
            <Route path="animation" element={<Animation />} />
            <Route path="acknowledgement" element={<Acknowledgement />} />
            <Route path="support" element={<Support />} />
            <Route path="*" element={<NotFound />} />
            <Route path="review" element={<Review_Interface />} />
            <Route path="display" element={<DisplayResume />} />




          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;

{/* <img style="display: block;-webkit-user-select: none;margin: auto;cursor: zoom-in;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src="https://interviewbot.ai/assets/feature3.png" width="819" height="968"> </img> */}
{/* <img style="display: block;-webkit-user-select: none;margin: auto;cursor: zoom-in;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src="https://interviewbot.ai/assets/feature2.png" width="819" height="968"> </img> */}
{/* <img style="display: block;-webkit-user-select: none;margin: auto;cursor: zoom-in;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src="https://interviewbot.ai/assets/feature.png" width="819" height="968"> </img> */}