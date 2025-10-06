// import React from "react";

// export default function Success() {
//   return (
//     <div className="text-center text-success mt-5">
//       <h2>✅ Payment Successful!</h2>
//       <p>Thank you for your purchase. Your course is now unlocked!</p>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const { courseName, price } = location.state || { courseName: "Unknown", price: 0 };
  const [saving, setSaving] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Save payment info to backend
    const savePayment = async () => {
      try {
        const response = await axios.post("https://elearning-backend-oa0u.onrender.com/payment/save", {
          courseName,
          price,
          sessionId,
        });
        console.log("Payment saved:", response.data);
        setSaving(false);
      } catch (err) {
        console.error("Failed to save payment:", err);
        setError("Failed to save payment details");
        setSaving(false);
      }
    };

    savePayment();
  }, [courseName, price, sessionId]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 mt-5">
            <div className="card-body text-center p-5">
              {/* Success Icon */}
              <div className="mb-4">
                <svg 
                  className="mx-auto" 
                  width="80" 
                  height="80" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#28a745" 
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>

              {/* Success Message */}
              <h2 className="text-success mb-3">Payment Successful! 🎉</h2>
              <p className="text-muted mb-4">
                Your payment has been processed successfully.
              </p>

              {/* Course Details */}
              {courseName !== "Unknown" && (
                <div className="bg-light rounded p-3 mb-4">
                  <h5 className="mb-2">{courseName}</h5>
                  <p className="text-muted mb-0">Amount Paid: ₹{price}</p>
                </div>
              )}

              {/* Saving Status */}
              {saving && (
                <div className="alert alert-info">
                  <small>Saving payment details...</small>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="alert alert-warning">
                  <small>{error}</small>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <button
                  onClick={() => navigate("/")}
                  className="btn btn-primary btn-lg"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => navigate("/my-courses")}
                  className="btn btn-outline-primary"
                >
                  View My Courses
                </button>
              </div>

              <p className="text-muted mt-4 mb-0">
                <small>A confirmation email has been sent to your registered email address.</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}