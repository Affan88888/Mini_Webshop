import { useNavigate } from "react-router-dom";

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="px-4 py-2 mb-4 text-white bg-gray-600 rounded hover:bg-gray-700"
    >
      ← Go Back
    </button>
  );
};

export default GoBackButton;
