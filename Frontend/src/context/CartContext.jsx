import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({children}){
    const {user} = useAuth();

    const [cart, setCart] = useState({
        items: [],
        totalAmount: 0,
        totalItems: 0
    })

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(user){
            fetchCart();
        }else{
            setCart({
                items: [],
                totalAmount: 0,
                totalItems: 0
            });
        }
    },[user])


    const fetchCart = async () => {
     try {

      setLoading(true);

      const { data } = await API.get("/cart");

      setCart({
        items: data.cart?.items || [],
        totalAmount: data.totalAmount || 0,
        totalItems: data.totalItems || 0,
      });

     } catch (error) {

      console.log(
        error.response?.data?.message || error.message
      );

     } finally {

      setLoading(false);
     }
    };
   
    // Add to cart
 const addToCart = async (bookId, quantity = 1) => {

    const { data } = await API.post("/cart/add", {
      bookId,
      quantity,
    });

    setCart({
      items: data.cart?.items || [],
      totalAmount: data.totalAmount || 0,
      totalItems: data.totalItems || 0,
    });
  };

  // Update quantity
  const updateQuantity = async (bookId, quantity) => {

    const { data } = await API.patch(
      `/cart/update/${bookId}`,
      { quantity }
    );

    setCart({
      items: data.cart?.items || [],
      totalAmount: data.totalAmount || 0,
      totalItems: data.totalItems || 0,
    });
  };

  // Remove item
  const removeFromCart = async (bookId) => {

    const { data } = await API.delete(
      `/cart/remove/${bookId}`
    );

    setCart({
      items: data.cart?.items || [],
      totalAmount: data.totalAmount || 0,
      totalItems: data.totalItems || 0,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export const useCart = () => useContext(CartContext);