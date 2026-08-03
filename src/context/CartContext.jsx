import { useEffect, useState } from 'react';
import { CartContext } from './CartContextValue';

const getInitialCart = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  const savedCart = localStorage.getItem('cart');

  if (!savedCart) {
    return [];
  }

  try {
    return JSON.parse(savedCart);
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getInitialCart);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (cart.find((item) => item._id === product._id)) {
      return false;
    }

    setCart((current) => [...current, product]);
    return true;
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};
