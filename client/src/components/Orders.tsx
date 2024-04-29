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
} from "@mui/material";
import { Order } from "../models/Order";
import { LineItem } from "../models/Order";

interface OrdersProps {
  open: boolean;
  onClose: () => void;
}

export const Orders: React.FC<OrdersProps> = ({ open, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
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
    fetchOrders();
  }, []);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Orders</DialogTitle>
      <DialogContent>
        <List>
          {orders.map((order) => (
            <ListItem key={order._id}>
              <ListItemText
                primary={`Order ID: ${order._id}`}
                secondary={
                  <>
                    <div>Status: {order.status}</div>
                    <div>Order Date: {order.orderDate}</div>
                    <div>Total Price: {order.totalPrice}</div>
                    <div>Payment ID: {order.paymentId || "N/A"}</div>
                    <div>Customer: {order.customer}</div>
                    <div>Products:</div>
                    <ul>
                      {order.lineItems.map((item) => (
                        <li key={item._id}>
                          {item.linkedProduct.name} - Quantity: {item.amount}
                        </li>
                      ))}
                    </ul>
                  </>
                }
              />
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
