import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png"; // Update the path to your logo file

const PaymentFailed = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-red-100 to-red-50">
      <img src={logo} alt="Logo" className="w-24 h-24 mb-6 animate-pulse" />
      <h1 className="text-4xl font-extrabold text-red-700 mb-4">
        Payment Failed
      </h1>
      <p className="text-lg text-gray-800 mb-8 text-center">
        Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
      </p>
      <button
        onClick={handleRedirect}
        className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-red-700 transition transform hover:scale-105"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentFailed;