import { Link } from 'react-router-dom';
import { GiHerbsBundle } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C360,100 720,0 1440,50 L1440,100 L0,100 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <GiHerbsBundle />
            <div>
              <span className="footer-logo-name">Sri Nanjundeshwara</span>
              <span className="footer-logo-sub">Ayurveda Mart</span>
            </div>
          </div>
          <p className="footer-desc">
            Bringing authentic Ayurvedic wellness to your doorstep. 
            Natural remedies rooted in ancient wisdom for modern living.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About Us</Link>
        </div>

        <div className="footer-links">
          <h4>Categories</h4>
          <Link to="/products?category=immunity">Immunity</Link>
          <Link to="/products?category=digestion">Digestion</Link>
          <Link to="/products?category=hair-care">Hair Care</Link>
          <Link to="/products?category=skin-care">Skin Care</Link>
          <Link to="/products?category=general-wellness">General Wellness</Link>
        </div>

        <div className="footer-links">
          <h4>Contact Us</h4>
          <a href="tel:+919876543210" className="footer-contact">
            <FiPhone /> +91 98765 43210
          </a>
          <a href="mailto:info@snmart.com" className="footer-contact">
            <FiMail /> info@snmart.com
          </a>
          <span className="footer-contact">
            <FiMapPin /> Karnataka, India
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Sri Nanjundeshwara Mart. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/shipping">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
