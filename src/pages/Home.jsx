import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiArrowRight, FiStar, FiShield, FiTruck, FiHeadphones } from 'react-icons/fi';
import { GiHerbsBundle, GiMedicines, GiHealing } from 'react-icons/gi';
import './Home.css';

const CATEGORIES = [
  { id: 'immunity', name: 'Immunity', icon: '🛡️', desc: 'Boost your natural defenses' },
  { id: 'digestion', name: 'Digestion', icon: '🌿', desc: 'Improve gut health naturally' },
  { id: 'hair-care', name: 'Hair Care', icon: '💆', desc: 'Nourish from root to tip' },
  { id: 'skin-care', name: 'Skin Care', icon: '✨', desc: 'Glow with natural radiance' },
  { id: 'joint-care', name: 'Joint Care', icon: '🦴', desc: 'Support mobility & strength' },
  { id: 'general-wellness', name: 'Wellness', icon: '🧘', desc: 'Complete mind-body balance' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', text: 'Amazing products! The immunity booster has been a game-changer for my family.', rating: 5 },
  { name: 'Rajesh K.', text: 'Authentic Ayurvedic products at great prices. Fast delivery and excellent quality.', rating: 5 },
  { name: 'Anita M.', text: 'The hair oil is incredible. My hair has never felt so healthy and strong!', rating: 5 },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products?limit=8&sort=popular')
      .then(res => setFeatured(res.data.products || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-pattern"></div>
        <div className="container hero-content">
          <div className="hero-text animate-fadeInUp">
            <span className="hero-badge">🌿 100% Natural & Authentic</span>
            <h1>Ancient Ayurvedic<br /><span className="gradient-text">Wisdom for Modern</span><br />Wellness</h1>
            <p>Discover authentic Ayurvedic remedies crafted with care. From immunity boosters to skin care, find natural solutions for a healthier life.</p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">Our Story</Link>
            </div>
          </div>
          <div className="hero-visual animate-fadeIn">
            <div className="hero-float-card card-1">
              <GiHerbsBundle /> 100+ Products
            </div>
            <div className="hero-float-card card-2">
              <GiMedicines /> Lab Tested
            </div>
            <div className="hero-float-card card-3">
              <GiHealing /> Traditional Recipes
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container trust-grid">
          <div className="trust-item"><FiTruck /><div><strong>Free Shipping</strong><span>Orders above ₹500</span></div></div>
          <div className="trust-item"><FiShield /><div><strong>100% Authentic</strong><span>Lab tested products</span></div></div>
          <div className="trust-item"><FiStar /><div><strong>Premium Quality</strong><span>Ancient formulations</span></div></div>
          <div className="trust-item"><FiHeadphones /><div><strong>24/7 Support</strong><span>WhatsApp & Email</span></div></div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by <span className="gradient-text">Category</span></h2>
          <p className="section-subtitle">Find the perfect Ayurvedic solution for your needs</p>
          <div className="category-grid">
            {CATEGORIES.map(cat => (
              <Link to={`/products?category=${cat.id}`} key={cat.id} className="category-card card">
                <span className="category-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <h2 className="section-title">Featured <span className="gradient-text">Products</span></h2>
          <p className="section-subtitle">Our most popular Ayurvedic solutions</p>
          {loading ? <LoadingSpinner /> : (
            featured.length > 0 ? (
              <div className="grid-4">
                {featured.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            ) : (
              <div className="empty-state">
                <p>No products available yet. Check back soon!</p>
              </div>
            )
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/products" className="btn btn-primary">View All Products <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* AI Feature */}
      <section className="ai-feature-section">
        <div className="container ai-feature-content">
          <div className="ai-text">
            <span className="hero-badge">🤖 AI-Powered</span>
            <h2>Tell Us Your <span className="gradient-text">Symptoms</span></h2>
            <p>Our intelligent Ayurvedic assistant analyzes your symptoms and recommends the most suitable natural remedies. Get personalized product suggestions in seconds.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Try AI Assistant <FiArrowRight /></Link>
          </div>
          <div className="ai-visual">
            <div className="ai-chat-preview">
              <div className="ai-msg user-msg">I have frequent headaches and fatigue</div>
              <div className="ai-msg bot-msg">Based on your symptoms, I recommend our <strong>Ashwagandha Capsules</strong> for stress relief and <strong>Brahmi Oil</strong> for headache relief. 🌿</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">What Our <span className="gradient-text">Customers</span> Say</h2>
          <p className="section-subtitle">Trusted by thousands of health-conscious families</p>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card card">
                <div className="testimonial-stars">
                  {Array(t.rating).fill(0).map((_, j) => <FiStar key={j} className="star-filled" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <p className="testimonial-name">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
