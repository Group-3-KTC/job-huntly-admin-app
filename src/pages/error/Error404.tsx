import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Error404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-evenly bg-white px-4 text-center mx-6 mt-4 rounded-lg shadow-lg">
      <div className="h-[90px] w-[240px] my-8">
        <img src={assets.error404} alt="" />
      </div>
      <div>
        <p className="text-2xl font-semibold mt-2 mb-2">Oops! Page Not Found</p>
        <p className="text-gray-600 max-w-md mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Error404;
