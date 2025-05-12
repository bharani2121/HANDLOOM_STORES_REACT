import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
        console.log("Cart API Response:", response.data); // Debug log
        setCartItems(response.data || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item?.clothing?.price || 0) * (item?.quantity || 1);
  }, 0);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  const updateQuantity = async (id, delta) => {
    try {
      const updatedItems = cartItems.map((item) => {
        if (item._id === id) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      });

      const updatedItem = updatedItems.find((item) => item._id === id);
      if (!updatedItem) return;

      setCartItems(updatedItems);

      await axios.put(`http://localhost:5000/api/cart/${id}`, {
        quantity: updatedItem.quantity,
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty. Add items before checkout.");
      return;
    }
    
    // Calculate final total with shipping
    const finalTotal = totalAmount + (cartItems.length > 0 ? 50 : 0);
    
    // Navigate to checkout with cart data
    navigate("/checkout", {
      state: {
        cartItems: cartItems,
        totalAmount: finalTotal
      }
    });
  };

  if (loading) {
    return (
      <div className="page cart">
        <h2>Your Shopping Cart 🛍️</h2>
        <p style={{ textAlign: "center" }}>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page cart">
        <h2>Your Shopping Cart 🛍️</h2>
        <div className="error-message">{error}</div>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  return (
    <div className="page cart">
      <h2>Your Shopping Cart 🛍️</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty. Start adding some fashion! 👗</p>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-left">
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                {item.clothing ? (
                  <>
                    <img
                      src={item.clothing.image || "/placeholder.png"}
                      alt={item.clothing.name}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    <div className="cart-item-info">
                      <h4>{item.clothing.name || "Unnamed Item"}</h4>
                      <p>Price: ₹{(item.clothing.price || 0).toFixed(2)}</p>
                      <p>Size: {item.clothing.size || "N/A"}</p>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item._id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <button 
                        onClick={() => handleRemove(item._id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="invalid-item">
                    <p>Product information unavailable</p>
                    <button 
                      onClick={() => handleRemove(item._id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="cart-right">
            <div className="summary-box">
              <h3>Cart Summary</h3>
              <div className="summary-details">
                <p>Subtotal: ₹{totalAmount.toFixed(2)}</p>
                <p>Estimated Shipping: ₹{cartItems.length > 0 ? "50.00" : "0.00"}</p>
                <p className="total-amount">Total: ₹{(totalAmount + (cartItems.length > 0 ? 50 : 0)).toFixed(2)}</p>
              </div>
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;