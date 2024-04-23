import { useState } from "react";
import { AddProduct } from "./AddProduct";
import { Product } from "../models/Product";

export const Admin = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const handleAddProduct = async (product: Product) => {
    //Lägg till logiken för att lägga till produkter här.
    console.log(product);
  };

  return (
    <>
      <h1>Admin</h1>
      <button onClick={handleToggleAddModal}>Add new Product</button>
      <AddProduct
        open={showAddModal}
        onClose={handleToggleAddModal}
        onAddProduct={handleAddProduct}
      />
    </>
  );
};
