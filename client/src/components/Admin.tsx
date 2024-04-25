import { useEffect, useState } from "react";
import { AddProduct } from "./AddProduct";
import { CreateProduct } from "../models/CreateProduct";
import { Product } from "../models/Product";
import { EditProduct } from "./EditProduct";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

export const Admin = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleToggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const handleOpenEditModal = (productId: string) => {
    setSelectedProductId(productId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProductId(null);
  };

  const handleAddProduct = async (product: CreateProduct) => {
    try {
      const response = await fetch("/api/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Product added:", data);
      } else {
        console.error("Failed to add product:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async (
    productId: string,
    product: CreateProduct
  ) => {
    try {
      const response = await fetch(`/api/update-product/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Product updated:", data);
      } else {
        console.error("Failed to update product:", response.statusText);
      }
    } catch (error) {
      console.error("Error with updating product:", error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/delete-product/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Product deleted:", productId);
        fetchProducts();
      } else {
        console.error("Failed to delete product:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
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

      <ul className="product-list">
        {products.map((product) => (
          <li key={product._id}>
            <div className="product-wrapper">
              <img
                src={product.image}
                style={{ width: "190px", height: "200px" }}
                alt={product.name}
              />
              <div className="product-info">
                <p>
                  {product.name} - {product.price} SEK
                </p>
                <button onClick={() => handleOpenEditModal(product._id)}>
                  <FiEdit />
                </button>
                <button onClick={() => deleteProduct(product._id)}>
                  <RiDeleteBin6Line />
                </button>
                {selectedProductId && (
                  <EditProduct
                    open={showEditModal}
                    onClose={handleCloseEditModal}
                    onEditProduct={handleEditProduct}
                    productId={selectedProductId}
                    product={
                      products.find(
                        (p) => p._id === selectedProductId
                      ) as CreateProduct
                    }
                  />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
