import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jspdf from "jspdf";
import "./Checkout.css";
import payment from "../assets/QR.jpg";
import QRModal from "./QRModal";

function generateUniqueOrderId() {
  // Create a more robust unique order ID
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${randomStr}`;
}

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = location.state || {};

  const [formData, setFormData] = useState({
    orderId: generateUniqueOrderId(), // Generate unique ID immediately
    username: "",
    phone: "",
    address: "",
    items: "",
    quantity: 0,
    totalAmount: 0,
    orderDate: new Date().toISOString().split('T')[0],
    paymentMethod: "COD",
    paymentId: "",
  });

  const [message, setMessage] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    const itemNames = cartItems
      .map(item => item.clothing?.name || "Unnamed Item")
      .join(", ");
    
    const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    setFormData(prev => ({
      ...prev,
      username: user.username,
      phone: user.mobile || "",
      address: user.address || "",
      items: itemNames,
      quantity: totalQuantity,
      totalAmount: totalAmount || 0,
    }));
  }, [cartItems, navigate, totalAmount]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const downloadReceipt = () => {
    const doc = new jspdf();
    
    // Title
    doc.setFontSize(18);
    doc.text("Order Receipt", 105, 20, { align: 'center' });
    
    // Order Details
    doc.setFontSize(12);
    doc.text(`Order ID: ${formData.orderId}`, 20, 40);
    doc.text(`Date: ${formData.orderDate}`, 20, 50);
    
    // Customer Details
    doc.text("Customer Details:", 20, 70);
    doc.text(`Name: ${formData.username}`, 20, 80);
    doc.text(`Phone: ${formData.phone}`, 20, 90);
    doc.text(`Address: ${formData.address}`, 20, 100);
    
    // Order Items
    doc.text("Order Items:", 20, 120);
    doc.text(`Items: ${formData.items}`, 20, 130);
    doc.text(`Quantity: ${formData.quantity}`, 20, 140);
    
    // Payment Details
    doc.text("Payment Details:", 20, 160);
    doc.text(`Payment Method: ${formData.paymentMethod}`, 20, 170);
    doc.text(`Total Amount: ₹${formData.totalAmount.toFixed(2)}`, 20, 180);
    
    // Save the PDF
    doc.save(`Order_${formData.orderId}_Receipt.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.paymentMethod === "Online" && !formData.paymentId.trim()) {
      setMessage("❌ Transaction ID is required for Online Payment.");
      return;
    }

    try {
      // Generate a new unique order ID at submission
      const submissionData = {
        ...formData,
        orderId: generateUniqueOrderId(),
        items: cartItems, 
      };

      // Create order
      const orderResponse = await axios.post("http://localhost:5000/api/orders/create", submissionData);
      
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Clear cart if user exists
      if (user && user._id) {
        try {
          await axios.delete(`http://localhost:5000/api/cart/clear`, {
            data: { userId: user._id }
          });
        } catch (cartError) {
          console.error("Error clearing cart:", cartError);
          // Continue with order process even if cart clearing fails
        }
      }
      
      setMessage("🎉 Order placed successfully!");
      
      // Show confirmation dialog for PDF download
      setTimeout(() => {
        const confirmDownload = window.confirm("Do you want to download the receipt?");
        if (confirmDownload) {
          downloadReceipt();
        }
        navigate("/checkout");
      }, 2000);
    } catch (err) {
      console.error("Error placing order:", err.response?.data || err.message);
      setMessage("❌ Error placing order. Please try again.");
    }
  };

  return (
    <>
      {showQR && (
        <QRModal 
          qrImage={payment} 
          onClose={() => setShowQR(false)} 
        />
      )}
      
      <div className="checkout-container">
        <h2>Checkout 🧾</h2>
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label className="label">Username:</label>
                <span className="form-value">{formData.username}</span>
              </div>

              <div className="form-group">
                <label className="label">Phone Number:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Date of Order:</label>
                <input
                  type="date"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label className="label">Items:</label>
                <span className="form-value">{formData.items}</span>
              </div>

              <div className="form-group">
                <label className="label">Quantity:</label>
                <span className="form-value">{formData.quantity}</span>
              </div>

              <div className="form-group">
                <label className="label">Total Amount:</label>
                <span className="form-value">₹{formData.totalAmount.toFixed(2)}</span>
              </div>

              <div className="form-group">
                <label className="label">Payment Method:</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Online">Online Payment</option>
                </select>
              </div>
            </div>
          </div>

          {formData.paymentMethod === "Online" && (
            <div className="payment-section">
              <div className="transaction-container">
                <div className="form-group">
                  <label className="label">Transaction ID:</label>
                  <input
                    type="text"
                    name="paymentId"
                    value={formData.paymentId}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="buttons-container">
            {formData.paymentMethod === "Online" && (
              <button
                type="button"
                onClick={() => setShowQR(true)}
                className="qr-toggle-button"
              >
                Show QR
              </button>
            )}
            <button type="submit" className="btn btn-success btn-lg float-right">Place Order</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Checkout;