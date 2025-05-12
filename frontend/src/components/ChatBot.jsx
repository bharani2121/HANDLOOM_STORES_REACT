// src/components/Chatbot.js
import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import axios from 'axios';


const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [greeted, setGreeted] = useState(false);
  const [clothes, setClothes] = useState([]);
  const [cart, setCart] = useState([]);
  const userId = '123'; // dummy user ID

  // Fetch clothes from backend
  const fetchClothes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clothes');
      setClothes(res.data);
    } catch (err) {
      console.error('Error fetching clothes:', err.message);
    }
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(res.data.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err.message);
    }
  };

  useEffect(() => {
    fetchClothes();
    fetchCart();
  }, []);

  const toggleChat = () => {
    setOpen(!open);
    if (!greeted && !open) {
      const introMessages = [
        { from: 'bot', text: '👋 Hello! I’m your shopping assistant bot.' },
        { from: 'bot', text: '🛍️ Use:\n/clothes - view items\n/cart - check cart\n/add [item name] - add item\n/contact - get contact info' }
      ];
      setMessages(prev => [...prev, ...introMessages]);
      setGreeted(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: 'user', text: input };
    const lowerInput = input.trim().toLowerCase();
    let botResponse = '';

    if (['hi', 'hello', 'hey', 'hii'].includes(lowerInput)) {
      botResponse = '👋 Hi there! Use /clothes, /cart, /add [item name], or /contact.';
    } else if (lowerInput === '/clothes') {
      if (!clothes || clothes.length === 0) {
        botResponse = '🔄 Loading clothes... Try again in a moment.';
      } else {
        botResponse = '🛍️ Available Clothes:\n' +
          clothes.map(item => `- ${item.name}: ₹${item.price}`).join('\n');
      }
    } else if (lowerInput === '/cart') {
      if (!cart || cart.length === 0) {
        botResponse = '🛒 Your cart is empty.';
      } else {
        let total = 0;
        botResponse = '🛒 Your Cart:\n' +
          cart.map(item => {
            const { clothing, quantity } = item;
            total += clothing.price * quantity;
            return `- ${clothing.name} x${quantity}: ₹${clothing.price * quantity}`;
          }).join('\n') + `\n\n💰 Total: ₹${total}`;
      }
    } else if (lowerInput.startsWith('/add')) {
      const itemName = input.slice(5).trim();
      const item = clothes.find(c => c.name.toLowerCase() === itemName.toLowerCase());
      if (item) {
        const itemAlreadyInCart = cart.some(ci => ci.clothing.name.toLowerCase() === item.name.toLowerCase());
        if (itemAlreadyInCart) {
          botResponse = `🛒 "${item.name}" is already in your cart.`;
        } else {
          try {
            await axios.post(`http://localhost:5000/api/cart`, {
              userId,
              clothesId: item._id,
            });
            await fetchCart();
            botResponse = `✅ "${item.name}" has been added to your cart.`;
          } catch (err) {
            botResponse = `❌ Error adding "${item.name}" to cart.`;
            console.error(err);
          }
        }
      } else {
        botResponse = `❌ Item "${itemName}" not found. Use /clothes to view available clothes.`;
      }
    } else if (lowerInput === '/contact') {
      botResponse =
        "📞 Contact Us:\n" +
        "🏪 FashionCart\n" +
        "📍 123 Style Street, Trendy Town\n" +
        "📱 +91 98765 43210\n" +
        "🕒 Open: 10 AM - 9 PM (Mon-Sun)";
    } else {
      botResponse = "❓ I didn't understand that. Try /clothes, /cart, /add [item name], or /contact.";
    }

    const botMsg = { from: 'bot', text: botResponse };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbox">
          <div className="chat-header">Chat with Us 🛍️</div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.from}`}>
                {msg.text.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
      <div className="chat-toggle" onClick={toggleChat}>
        💬
      </div>
    </div>
  );
};

export default Chatbot;
