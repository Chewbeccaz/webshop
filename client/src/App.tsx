import { useEffect, useState } from "react";
import "./App.css";
import { Cart } from "./components/Cart";
import { Product } from "./models/Product";
import { useCart } from "./context/CartContext";
import { FaCartPlus } from "react-icons/fa";
import { GiFruitBowl } from "react-icons/gi";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  const { addToCart } = useCart();

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

  return (
    <>
      <h1>
        Fruktsallad <GiFruitBowl />
      </h1>
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
                <button
                  className="addtocart-btn"
                  onClick={() => addToCart(product)}>
                  <FaCartPlus />
                </button>
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
