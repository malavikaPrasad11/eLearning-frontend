import React from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51SEXhv7L17jBLVDp3cOEFhVlmz9lQwBzMhZLN35R6flE0832aUxpGqk0V4i8YLW0J71cEjTLsDL5scwEWhxJ2iBk00zoVb7bev");
export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseName, price } = location.state || { courseName: "Unknown", price: 0 };

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const { data } = await axios.post("http://localhost:5000/create-checkout-session", {
        amount: price * 100, // Stripe expects amount in paise
        courseName,
      });

      window.location.href = data.url; // Redirect to Stripe Checkout
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="text-center my-5">
      <h2>Buy {courseName}</h2>
      <h4>₹{price} Only</h4>
      <button
        onClick={handlePayment}
        className="btn btn-primary mt-3 px-4 py-2"
      >
        Pay with Stripe
      </button>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary mt-3 mx-2 px-4 py-2"
      >
        Cancel
      </button>
    </div>
  );
}
