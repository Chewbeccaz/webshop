// export const Orders = ({open, onClose}) => {
//   return (
//     <>
//      <div className={`modal ${open ? "open" : ""}`}>
//       <div className="modal-content">
//         <span className="close" onClick={onClose}>&times;</span>
//         <h2>All Orders</h2>
//         <Orders />
//       </div>
//     </div>
//     </>
//   );
// };

import React from "react";
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

// Dummy orders data
const dummyOrders: Order[] = [
  {
    _id: "1",
    customer: "John Doe",
    orderDate: "2024-04-26",
    status: "unpaid",
    totalPrice: 100,
    paymentId: null,
  },
  {
    _id: "2",
    customer: "Jane Doe",
    orderDate: "2024-04-25",
    status: "paid",
    totalPrice: 200,
    paymentId: "payment123",
  },
];

interface OrdersProps {
  open: boolean;
  onClose: () => void;
}

export const Orders: React.FC<OrdersProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Orders</DialogTitle>
      <DialogContent>
        <List>
          {dummyOrders.map((order) => (
            <ListItem key={order._id}>
              <ListItemText
                primary={`Order ID: ${order._id}`}
                secondary={`Status: ${order.status}`}
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
