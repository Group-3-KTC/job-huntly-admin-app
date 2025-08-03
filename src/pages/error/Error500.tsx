import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Error500: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-white px-4 text-center">
      <h1 className="text-9xl font-extrabold text-blue-600">500</h1>
      <p className="text-2xl font-semibold mt-4 mb-2">Internal Server Error</p>
      <p className="text-gray-600 max-w-md">
        Something went wrong on our end. Please try again later or contact
        support if the issue persists.
      </p>
      <div className="h-[90px] w-[240px] my-8">
        <img src={assets.error500} alt="" />
      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-12 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
      >
        Try Again
      </button>
    </div>
  );
};

export default Error500;
