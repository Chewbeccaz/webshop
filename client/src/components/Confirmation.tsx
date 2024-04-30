import { useNavigate } from "react-router-dom";
import "../styles/confirmation.css";

export const Confirmation = () => {
  const navigate = useNavigate();

  const homeRedirect = () => {
    navigate("/");
  };

  return (
    <div className="confirmation-wrapper">
      <h1>Thank you for your order!</h1>
      <p>Please enjoy your fruitsallad!</p>
      <button className="home-btn" onClick={homeRedirect}>
        Go back to Homepage
      </button>
    </div>
  );
};
