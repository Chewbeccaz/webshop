// PaymentModal.tsx
import React, { useState } from "react";
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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.trim()) {
      setNameError("");
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    if (value.trim()) {
      setAddressError("");
    }
  };

  const handlePay = () => {
    // Validate Namn
    if (!name.trim()) {
      setNameError("Name is required.");
    } else {
      setNameError("");
    }

    if (!address.trim()) {
      setAddressError("Address is required.");
    } else {
      setAddressError("");
    }

    if (name.trim() && address.trim()) {
      onPay(name, address);
    }
  };

  return (
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
          //   onChange={(e) => setName(e.target.value)}
          onChange={handleNameChange}
        />
        {nameError && <p>{nameError}</p>}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={handleAddressChange}
        />
        {addressError && <p>{addressError}</p>}
        <button
          onClick={handlePay}
          disabled={nameError !== "" || addressError !== ""}>
          Pay
        </button>
      </div>
    </Modal>
  );
};

export default PaymentModal;
