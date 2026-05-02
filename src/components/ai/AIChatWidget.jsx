import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { FiMessageCircle, FiX, FiSend, FiShoppingCart } from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import './AIChatWidget.css';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! 🙏 I\'m your Ayurvedic wellness assistant. Tell me your symptoms and I\'ll recommend the best natural remedies for you.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/ai/recommend', { symptoms: text });
      
      if (data.recommendations?.length > 0) {
        setRecommendations(data.recommendations);
        setMessages(prev => [...prev, {
          role: 'bot',
          text: `Based on your symptoms, I recommend these Ayurvedic products:`,
          products: data.recommendations
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: data.message || 'I couldn\'t find specific products for those symptoms. Try describing your concerns differently, or browse our full product catalog.'
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Sorry, I\'m having trouble connecting. Please try again or browse our products directly.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const discountedPrice = product.discount > 0
      ? Math.round(product.price - (product.price * product.discount / 100))
      : product.price;

    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: discountedPrice,
      image: product.images?.[0] || '',
      stock: product.stock,
      quantity: 1
    }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button className={`ai-chat-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}
        aria-label="AI Assistant" style={{ bottom: isOpen ? '520px' : '96px' }}>
        {isOpen ? <FiX /> : <FiMessageCircle />}
        {!isOpen && <span className="ai-toggle-label">AI Help</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window animate-fadeInUp">
          <div className="ai-chat-header">
            <GiHerbsBundle className="ai-header-icon" />
            <div>
              <h4>Ayurvedic AI Assistant</h4>
              <span className="ai-status">● Online</span>
            </div>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-chat-msg ${msg.role}`}>
                {msg.role === 'bot' && <div className="ai-avatar"><GiHerbsBundle /></div>}
                <div className="ai-msg-content">
                  <p>{msg.text}</p>
                  {msg.products && (
                    <div className="ai-product-list">
                      {msg.products.map(p => (
                        <div key={p._id} className="ai-product-card">
                          <div className="ai-product-info">
                            <strong>{p.name}</strong>
                            <span className="ai-product-category">{p.category?.replace('-', ' ')}</span>
                            <span className="ai-product-price">₹{p.discount > 0 ? Math.round(p.price - (p.price * p.discount / 100)) : p.price}</span>
                          </div>
                          <button className="ai-add-btn" onClick={() => handleAddToCart(p)} title="Add to Cart">
                            <FiShoppingCart />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-chat-msg bot">
                <div className="ai-avatar"><GiHerbsBundle /></div>
                <div className="ai-msg-content">
                  <div className="ai-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-input">
            <input type="text" placeholder="Describe your symptoms..." value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} />
            <button className="ai-send-btn" onClick={handleSend} disabled={!input.trim() || loading}>
              <FiSend />
            </button>
          </div>

          <div className="ai-chat-suggestions">
            {['headache', 'hair fall', 'low immunity', 'acne'].map(s => (
              <button key={s} className="ai-suggestion" onClick={() => { setInput(s); }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
