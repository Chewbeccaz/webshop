import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Order } from "../models/Order";
import { LineItem } from "../models/Order";

interface OrdersProps {
  open: boolean;
  onClose: () => void;
}

export const Orders: React.FC<OrdersProps> = ({ open, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data: Order[] = await response.json();
      setOrders(data);
      console.log(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Orders</DialogTitle>
      <DialogContent>
        <List>
          {orders.map((order) => (
            <ListItem
              key={order._id}
              style={{
                border: "1px solid #ccc",
                padding: "8px",
                marginBottom: "8px",
              }}>
              <ListItemText primary={`Order ID: ${order._id}`} />
              <div>
                <Typography>Status: {order.status}</Typography>
                <Typography>Order Date: {order.orderDate}</Typography>
                <Typography>Total Price: {order.totalPrice}</Typography>
                <Typography>Payment ID: {order.paymentId || "N/A"}</Typography>
                <Typography>Customer: {order.customer}</Typography>
                <Typography style={{ marginTop: "10px", fontWeight: "bold" }}>
                  Products:
                </Typography>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto",
                  }}>
                  {order.lineItems.map((item: LineItem) => (
                    <div key={item._id}>
                      <Typography>
                        {item.linkedProduct.name} - Quantity: {item.amount}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
