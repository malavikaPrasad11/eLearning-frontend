// import { useAuth0 } from "@auth0/auth0-react";
// import { useEffect } from "react";

// export default function SignIn() {
//   const { loginWithRedirect, user, isAuthenticated, getAccessTokenSilently } = useAuth0();

//   useEffect(() => {
//     if (isAuthenticated && user) {
//       // send user info to your backend
//       const saveUser = async () => {
//         const token = await getAccessTokenSilently(); // required if backend protected by JWT
//         await fetch("http://localhost:3000/profile", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // pass JWT if using checkJwt
//           },
//           body: JSON.stringify({
//             name: user.name,
//             email: user.email,
//           }),
//         });
//       };
//       saveUser();
//     }
//   }, [isAuthenticated, user]);

//   return (
//     <div className="text-center mt-5">
//       <h2>Sign In</h2>
//       <button onClick={() => loginWithRedirect()}>Log In with Auth0</button>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return false;
    }

    if (!isLogin && !formData.name) {
      setError("Name is required");
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const response = await axios.post("https://elearning-backend-oa0u.onrender.com/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        // Save token to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        // Register logic
        const response = await axios.post("https://elearning-backend-oa0u.onrender.com/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setSuccess("Registration successful! Please login.");
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">
                    {isLogin ? "Welcome Back!" : "Create Account"}
                  </h2>
                  <p className="text-muted">
                    {isLogin
                      ? "Login to access your courses"
                      : "Sign up to start learning"}
                  </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Name Field (Register only) */}
                  {!isLogin && (
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Confirm Password (Register only) */}
                  {!isLogin && (
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : isLogin ? (
                      "Login"
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {/* Forgot Password (Login only) */}
                  {isLogin && (
                    <div className="text-center mb-3">
                      <a href="#" className="text-decoration-none small">
                        Forgot Password?
                      </a>
                    </div>
                  )}
                </form>

                {/* Toggle Login/Register */}
                <div className="text-center mt-4">
                  <p className="mb-0">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={toggleMode}
                      className="btn btn-link p-0 text-decoration-none"
                      disabled={loading}
                    >
                      {isLogin ? "Sign Up" : "Login"}
                    </button>
                  </p>
                </div>

                {/* Divider */}
                <div className="position-relative my-4">
                  <hr />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                    OR
                  </span>
                </div>

                {/* Social Login Buttons */}
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-secondary">
                    <svg className="me-2" width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}