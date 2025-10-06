import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Components/Pages/Home";
import About1 from "./Components/Routes/About1";
import Courses1 from "./Components/Routes/Courses1";
import Team1 from "./Components/Routes/Team1";
import Testimonial1 from "./Components/Routes/Testimonial1";
import Contact1 from "./Components/Routes/Contact1";
import ErrorPage from "./Components/Pages/ErrorPage";
import SignUp from "./Components/Pages/Register";
import Sign from "./Components/Pages/Sign"; // Add this import
import Javaprog from "./Components/Course/Javaprog";
import Dsa from "./Components/Course/Dsa";
import Mern from "./Components/Course/Mern";
import Fullstack from "./Components/Course/Fullstack";
import Programming from "./Components/Course/Programming";
import ShowBook from "./Components/Ebook/ShowBook";
import BotpressChatbot from "./Components/Ebook/BotpressChatbot";
import Reactjs from "./Components/Course/Reactjs";
import Express from "./Components/Course/Express";
import Nodejs from "./Components/Course/Nodejs";
import Mongodb from "./Components/Course/Mongodb";
import Mysql from "./Components/Course/Mysql";
import Javascript from "./Components/Course/Javascript";
import Html from "./Components/Course/Html";
import Css from "./Components/Course/Css";
import Advjava from "./Components/Course/Advjava";
import JavaQuiz from "./Components/Quiz/JavaQuiz";
import Test from "./Components/Pages/Test";
import FullstackQuiz from "./Components/Quiz/FullstackQuiz";
import JavascriptQuiz from "./Components/Quiz/JavascriptQuiz";
import ReactQuiz from "./Components/Quiz/ReactQuiz";
import Profile from "./Components/Pages/Profile";
import FeedbackAll from "./Components/Pages/FeedbackAll";
import GroupDiscussion from "./Components/Pages/GroupDiscussion";
import Payment from "./Components/Pages/Payment";
import Success from "./Components/Pages/Success";
import Cancel from "./Components/Pages/Cancel";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const token = localStorage.getItem("token");

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user is authenticated via Auth0 OR has a local token
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // ---------------- Save Auth0 user to MongoDB ---------------- //
  useEffect(() => {
    const saveUserToDB = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const token = await getAccessTokenSilently(); // Get JWT from Auth0
        const res = await fetch("https://elearning-backend-oa0u.onrender.com/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
          }),
        });

        const data = await res.json();
        console.log("User saved:", data);
      } catch (err) {
        console.error("Error saving user:", err);
      }
    };

    saveUserToDB();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About1 />} />
        <Route path="/courses" element={<Courses1 />} />
        <Route path="/team" element={<Team1 />} />
        <Route path="/testimonial" element={<Testimonial1 />} />
        <Route path="/contact" element={<Contact1 />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Sign />} /> {/* New Login/Register Page */}
        
        {/* Protected Routes - Require Authentication */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group-discussion"
          element={
            <ProtectedRoute>
              <GroupDiscussion />
            </ProtectedRoute>
          }
        />

        {/* Quiz Routes - Protected */}
        <Route path="/test" element={<Test />} />
        <Route
          path="/test/java"
          element={
            <ProtectedRoute>
              <JavaQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/fullstack"
          element={
            <ProtectedRoute>
              <FullstackQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/javascript"
          element={
            <ProtectedRoute>
              <JavascriptQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/react"
          element={
            <ProtectedRoute>
              <ReactQuiz />
            </ProtectedRoute>
          }
        />

        {/* Course Routes */}
        <Route path="/courses/java" element={<Javaprog />} />
        <Route path="/courses/dsa" element={<Dsa />} />
        <Route path="/courses/mern" element={<Mern />} />
        <Route path="/courses/mern/nodejs" element={<Nodejs />} />
        <Route path="/courses/mern/express" element={<Express />} />
        <Route path="/courses/mern/react" element={<Reactjs />} />
        <Route path="/courses/mern/mongodb" element={<Mongodb />} />
        <Route path="/courses/fullstack" element={<Fullstack />} />
        <Route path="/courses/fullstack/sql" element={<Mysql />} />
        <Route path="/courses/fullstack/nodejs" element={<Nodejs />} />
        <Route path="/courses/fullstack/express" element={<Express />} />
        <Route path="/courses/fullstack/react" element={<Reactjs />} />
        <Route path="/courses/fullstack/mongodb" element={<Mongodb />} />
        <Route path="/courses/fullstack/javascript" element={<Javascript />} />
        <Route path="/courses/fullstack/html" element={<Html />} />
        <Route path="/courses/fullstack/css" element={<Css />} />
        <Route path="/cources/programming" element={<Programming />} />
        <Route path="/cources/programming/java" element={<Javaprog />} />
        <Route path="/cources/programming/advJava" element={<Advjava />} />
        <Route path="/cources/programming/javascript" element={<Javascript />} />
        
        {/* Other Routes */}
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/library" element={<ShowBook />} />
        <Route path="/feedback" element={<FeedbackAll />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <BotpressChatbot />
    </>
  );
}

export default App;