import { useState } from "react";
import { Modal } from "@mui/material";
import { useCart } from "../context/CartContext";
import { Product } from "../models/Product";
import { FaRegTrashAlt, FaShoppingCart } from "react-icons/fa";
import PaymentModal from "./PaymentModal";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  const { cart, addToCart, removeFromCart, decreaseQuantity } = useCart();
  const navigate = useNavigate();
  const [openCart, setOpenCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const handleIncrement = (productId: string) => {
    const product = cart.find((item) => item.product._id === productId);
    if (product) {
      addToCart(product.product);
    }
  };

  const handleDecrement = (productId: string) => {
    const product = cart.find((item) => item.product._id === productId);
    if (product && product.quantity > 1) {
      decreaseQuantity(product.product);
    }
  };

  const handleRemoveItem = (product: Product) => {
    removeFromCart(product);
  };

  const handleCloseModal = () => {
    setOpenCart(false);
    setSelectedProduct(null);
  };

  //***********************  PAYMENT ************************ */

  const handleOpenPaymentModal = () => {
    setOpenPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };

  const createOrder = async (email: string, name: string, address: string) => {
    const items = cart.map((item) => ({
      product: item.product._id,
      amount: item.quantity,
      price: item.product.price,
    }));

    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.amount,
      0
    );

    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        address: address,
        orderDate: new Date().toISOString(),
        status: "Paid",
        totalPrice: totalPrice,
        paymentId: "random payment id",
        items: items,
      }),
    });

    console.log("This is your response:", response);

    if (response.ok) {
      const data = await response.json();
      console.log("Order created: ", data);
      localStorage.removeItem("cart");
      navigate("/confirmation");
    } else {
      console.error("Failed to create order: ", response.status);
      const errorResponse = await response.json();
      console.error("Error message: ", errorResponse.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpenCart(!openCart)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          display: "flex",
          alignItems: "center",
          background: "rgb(238, 245, 227)",
          fontSize: "16px",
        }}>
        <div style={{ position: "relative" }}>
          <FaShoppingCart />
          {totalQuantity > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-20px",
                right: "-30px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                padding: "5px 10px",
                fontSize: "12px",
              }}>
              {totalQuantity}
            </span>
          )}
        </div>
      </button>
      <Modal
        open={openCart}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
        }}>
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            width: "300px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}>
          <button
            onClick={handleCloseModal}
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
          <h2 style={{ color: "rgb(148, 199, 214)" }}>Kundvagn:</h2>
          <h3>Artiklar:</h3>
          <div style={{ marginBottom: "20px" }}>
            {cart.map((item) => (
              <div key={item.product._id} style={{ marginBottom: "10px" }}>
                <hr style={{ marginBottom: "20px" }} />
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: "100px", marginRight: "10px" }}
                />
                <div>
                  <h4 style={{ fontSize: "16px", marginBottom: "2px" }}>
                    {item.product.name}
                  </h4>
                  <p style={{ fontSize: "12px", marginBottom: "2px" }}>
                    Pris: {item.product.price} kr
                  </p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrement(item.product._id);
                      }}
                      style={{
                        marginLeft: "5px",
                        padding: "5px 10px",
                        fontSize: "12px",
                      }}>
                      -
                    </button>
                    <p
                      style={{
                        marginRight: "5px",
                        padding: "5px 10px",
                        fontSize: "12px",
                      }}>
                      Antal: {item.quantity}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrement(item.product._id);
                      }}
                      style={{
                        marginRight: "5px",
                        padding: "5px 10px",
                        fontSize: "12px",
                      }}>
                      +
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.product);
                      }}
                      style={{
                        marginLeft: "5px",
                        padding: "5px 10px",
                        fontSize: "14px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "red",
                      }}>
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h3>Total: {calculateTotal()} kr</h3>
          <button onClick={handleOpenPaymentModal}>Gå till betalning</button>
          <PaymentModal
            open={openPaymentModal}
            onClose={handleClosePaymentModal}
            onPay={createOrder}
          />
        </div>
      </Modal>
    </>
  );
};
