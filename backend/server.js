const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Resend } = require('resend');
const ContactFormEmail = require('./emails/ContactFormEmail');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Check required env variables
if (!process.env.RESEND_API_KEY || !process.env.MONGO_URI) {
  console.error('❌ Missing environment variables. Please check .env file.');
  process.exit(1);
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Import routes
const clothesRoutes = require('./routes/clothesRoutes'); // 🧥 Clothes CRUD
const userRoutes = require('./routes/userRoutes');       // 👤 User Auth
const cartRoutes = require('./routes/cartRoutes');       // 🛒 Cart
const orderRoutes = require('./routes/orderRoutes');       // 🛒 Cart

// Register routes
app.use('/api/clothes', clothesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('🟢 API is running...');
});

// Contact form route
app.post('/send', async (req, res) => {
  const { senderEmail, message } = req.body;

  if (!senderEmail || !message) {
    return res.status(400).json({ error: 'Sender email and message are required' });
  }

  try {
    await resend.emails.send({
      from: 'Your Name <onboarding@resend.dev>',
      to: 'bharanidharand.22it@kongu.edu', // Change this to your email
      subject: 'New Message from Contact Form',
      react: ContactFormEmail({ senderEmail, message }),
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
