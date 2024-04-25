import { useEffect, useState } from "react";
import "./App.css";
import { Cart } from "./components/Cart";
import { Admin } from "./components/Admin";
import { Product } from "./models/Product";
import { useCart } from "./context/CartContext";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  const { addToCart } = useCart();

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  // const fetchProducts = async () => {
  //   try {
  //     const response = await fetch("/api/");
  //     const data = await response.json();
  //     setProducts(data);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };

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

  // const addToCart = (product: Product) => {
  //   setCart([...cart, product]);
  // };

  return (
    <>
      <h1>Fruktsallad</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product._id}>
            <div className="product-wrapper">
              <img
                src={product.image}
                style={{ width: "290px", height: "300px" }}
                alt={product.name}
              />
              <div className="product-info">
                <p>
                  {product.name} - {product.price} SEK
                </p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Cart />
    </>
  );
}

export default App;
