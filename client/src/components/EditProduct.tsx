import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { CreateProduct } from "../models/CreateProduct";

interface EditProductProps {
  open: boolean;
  onClose: () => void;
  onEditProduct: (productId: string, product: CreateProduct) => void;
  productId: string;
  product: CreateProduct;
}

export const EditProduct: React.FC<EditProductProps> = ({
  open,
  onClose,
  onEditProduct,
  productId,
  product,
}) => {
  const [localProduct, setLocalProduct] = useState<CreateProduct>(product);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocalProduct({ ...localProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditProduct(productId, localProduct); // Use localProduct for submission
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Name"
            value={localProduct.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={localProduct.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={localProduct.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="image"
            label="Image URL"
            value={localProduct.image}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="inStock"
            label="In Stock"
            type="number"
            value={localProduct.inStock}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="status"
            label="Status"
            value={localProduct.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} type="submit" color="primary">
              Edit Product
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
