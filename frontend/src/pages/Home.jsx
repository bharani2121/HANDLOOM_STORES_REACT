import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const navigate = useNavigate();

  const navigateToClothes = () => {
    navigate('/clothes');
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        {/* Image Carousel Container */}
        <div className="carousel-container">
          <div className="carousel-slide"></div>
          <div className="carousel-slide"></div>
          <div className="carousel-slide"></div>
          <div className="carousel-slide"></div>
          <div className="carousel-slide"></div>
        </div>
        
        <div className="hero-content">
          <h1>🛍️ Welcome to Trendy Wardrobe 🧥</h1>
          <p className="tagline">Your Fashion Destination Starts Here</p>
          <button className="cta-button" onClick={navigateToClothes}>Explore Our Collection</button>
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2>👗 About Us</h2>
          <div className="underline"></div>
        </div>
        <div className="about-content">
          <div className="about-text">
            <p>
              At Trendy Wardrobe, we believe that fashion is a way to express who you are. We bring you a handpicked selection of stylish, comfortable, and affordable clothing for every occasion.
            </p>
            <p>
              From everyday essentials to runway-ready looks, we've got something for everyone.
            </p>
          </div>
        </div>
      </section>

      <section className="offer-section">
        <div className="section-header">
          <h2>🛒 What We Offer</h2>
          <div className="underline"></div>
        </div>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="card-icon">👕</div>
            <h3>Men's Wear</h3>
            <p>Trendy shirts, tees, trousers and more crafted for comfort and style.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">👗</div>
            <h3>Women's Wear</h3>
            <p>Elegant dresses, kurtis, tops, and more for every occasion.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">🧒</div>
            <h3>Kids' Collection</h3>
            <p>Fun and comfortable outfits for the little ones in your life.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">🎒</div>
            <h3>Accessories</h3>
            <p>Complete your look with stylish bags, scarves, belts, and more.</p>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="section-header">
          <h2>⭐ Why Shop With Us?</h2>
          <div className="underline"></div>
        </div>
        <div className="benefits-container">
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <div className="benefit-text">Wide Range of Stylish Options</div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <div className="benefit-text">Easy & Secure Online Ordering</div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <div className="benefit-text">Fast & Reliable Delivery</div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <div className="benefit-text">Exclusive Offers & Discounts</div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <div className="benefit-text">Customer-Friendly Return Policy</div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2>🔥 Featured Categories</h2>
          <div className="underline"></div>
        </div>
        <div className="category-tabs">
          <div className="category-tab">✨ Bestsellers</div>
          <div className="category-tab">🆕 New Arrivals</div>
          <div className="category-tab">💸 Budget Friendly</div>
          <div className="category-tab">🌞 Summer Collection</div>
        </div>
      </section>

      <section className="shop-now">
        <div className="shop-content">
          <h2>🛍️ Shop Now & Stay in Style</h2>
          <p>Browse our latest collection and find the perfect outfit today!</p>
          <p className="grow-text">Let fashion be your statement. 👗👔</p>
          <button className="shop-button" onClick={navigateToClothes}>Shop Collection</button>
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default Home;