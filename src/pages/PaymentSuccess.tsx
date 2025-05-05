import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png"; // Update the path to your logo file

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-green-100 to-green-50">
      <img src={logo} alt="Logo" className="w-24 h-24 mb-6 animate-bounce" />
      <h1 className="text-4xl font-extrabold text-green-700 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-gray-800 mb-8 text-center">
        Thank you for your payment. Your transaction was successful, and your account has been updated.
      </p>
      <button
        onClick={handleRedirect}
        className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 transition transform hover:scale-105"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;