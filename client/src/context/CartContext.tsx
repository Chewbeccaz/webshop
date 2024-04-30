import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Product } from "../models/Product";

interface ICartItem {
  product: Product;
  quantity: number;
}

interface ICartContext {
  cart: ICartItem[];
  addToCart: (product: Product) => void;
  decreaseQuantity: (product: Product) => void;
  removeFromCart: (product: Product) => void;
}

const initialValues = {
  cart: [],
  addToCart: () => {},
  decreaseQuantity: () => {},
  removeFromCart: () => {},
};

const CartContext = createContext<ICartContext>(initialValues);
export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useState<ICartItem[]>(() => {
    const isData = localStorage.getItem("cart");
    return isData ? JSON.parse(isData) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const clonedCart = [...cart];

    const productAlreadyExists = clonedCart.find(
      (item) => item.product._id === product._id
    );

    if (productAlreadyExists) {
      productAlreadyExists.quantity++;
      setCart(clonedCart);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const decreaseQuantity = (product: Product) => {
    const clonedCart = cart.map((item) => {
      if (item.product._id === product._id) {
        return {
          ...item,
          quantity: item.quantity > 1 ? item.quantity - 1 : 1,
        };
      }
      return item;
    });
    setCart(clonedCart);
  };

  const removeFromCart = (product: Product) => {
    const clonedCart = cart.filter((item) => item.product._id !== product._id);
    setCart(clonedCart);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
