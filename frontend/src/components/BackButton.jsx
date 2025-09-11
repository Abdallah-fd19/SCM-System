import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
      aria-label="Go back"
    >
      <IoArrowBackCircleOutline className="w-7 h-7" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default BackButton;


