// PaymentModal.tsx
import React, { useState } from "react";
import { Modal } from "@mui/material";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPay: (email: string, name: string, address: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onPay,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [emailError, setEmailError] = useState("");
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.trim()) {
      setEmailError("");
    }
  };

  const handlePay = () => {
    setNameError(!name.trim() ? "Name is required." : "");
    setAddressError(!address.trim() ? "Address is required." : "");
    setEmailError(!email.trim() ? "Email is required." : "");

    if (name.trim() && address.trim() && email.trim()) {
      onPay(email, name, address);
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
          onChange={handleNameChange}
        />
        {<div> {nameError && <p>{nameError}</p>}</div>}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={handleAddressChange}
        />
        {<div> {addressError && <p>{addressError}</p>}</div>}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        {<div> {emailError && <p>{emailError}</p>}</div>}
        <button
          onClick={handlePay}
          disabled={
            nameError !== "" || addressError !== "" || emailError !== ""
          }>
          Pay
        </button>
      </div>
    </Modal>
  );
};

export default PaymentModal;
