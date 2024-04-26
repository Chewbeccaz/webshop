// PaymentModal.tsx
import React from "react";
import { Box, Modal } from "@mui/material";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPay: (name: string, address: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onPay,
}) => {
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");

  const handlePay = () => {
    onPay(name, address);
  };

  return (
    // <Modal
    //   open={open}
    //   onClose={onClose}
    //   style={{
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //   }}>
    //   <div
    //     style={{
    //       backgroundColor: "white",
    //       padding: "20px",
    //       borderRadius: "8px",
    //       width: "300px",
    //       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    //     }}>
    //     <h2>Payment Information</h2>
    //     <input
    //       type="text"
    //       placeholder="Name"
    //       value={name}
    //       onChange={(e) => setName(e.target.value)}
    //     />
    //     <input
    //       type="text"
    //       placeholder="Address"
    //       value={address}
    //       onChange={(e) => setAddress(e.target.value)}
    //     />
    //     <button onClick={handlePay}>Pay</button>
    //   </div>
    // </Modal>
    <Modal
      open={open}
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "16px",
            color: "#666",
          }}>
          X
        </button>
        <h2>Payment Information</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={handlePay}>Pay</button>
      </div>
    </Modal>
  );
};

export default PaymentModal;
