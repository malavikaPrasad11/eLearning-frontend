import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51SEXhv7L17jBLVDp3cOEFhVlmz9lQwBzMhZLN35R6flE0832aUxpGqk0V4i8YLW0J71cEjTLsDL5scwEWhxJ2iBk00zoVb7bev");

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseName, price } = location.state || { courseName: "Unknown", price: 0 };
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    
    try {
      console.log("Initiating payment for:", { courseName, price });
      
      // Make the API call
      const { data } = await axios.post(
        "https://elearning-backend-oa0u.onrender.com/create-checkout-session",
        {
          amount: price * 100, // Stripe expects amount in paise
          courseName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Response from backend:", data);

      // Check if we got a valid URL
      if (data && data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      
      // Better error messages based on error type
      if (err.response) {
        // Backend responded with error
        console.error("Backend error:", err.response.data);
        setError(`Server Error: ${err.response.data.message || err.response.data.error || "Payment processing failed"}`);
      } else if (err.request) {
        // Request made but no response received
        console.error("No response from backend:", err.request);
        setError("Cannot connect to payment server. Make sure backend is running on http://localhost:3000");
      } else {
        // Something else went wrong
        setError(err.message || "Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="text-center my-5">
        <h2>Buy {courseName}</h2>
        <h4>₹{price} Only</h4>
        
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
        
        <button
          onClick={handlePayment}
          className="btn btn-primary mt-3 px-4 py-2"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </button>
        
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary mt-3 mx-2 px-4 py-2"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}