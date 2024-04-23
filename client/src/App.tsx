import { useEffect, useState } from "react";
import "./App.css";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/");
      const data = await response.json();
      setProducts(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    console.log("Product added to cart:", product);
  };

  return (
    <>
      <h1>Frukt</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product._id}>
            <div className="product-wrapper">
              <img
                src={product.image}
                style={{ width: "200px" }}
                alt={product.name}
              />
              <div className="product-info">
                <p>
                  {product.name} - {product.price} kr
                </p>
                <button onClick={() => addToCart(product)}>
                  Lägg till i kundvagn
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {cart.length > 0 && (
        <div>
          <h2>Kundvagn</h2>
          <ul>
            {cart.map((item: any, index: number) => (
              <li key={index}>
                {item.name} - {item.price} kr
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
