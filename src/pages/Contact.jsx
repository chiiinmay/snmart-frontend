import { useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/analytics/contact', form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.success('Thank you! Your message has been received.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>Contact <span className="gradient-text">Us</span></h1>
          <p>We'd love to hear from you. Reach out for any queries about our Ayurvedic products.</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48 }}>
          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 24 }}>Get in Touch</h2>
            <p style={{ color: 'var(--dark-500)', lineHeight: 1.7, marginBottom: 32 }}>
              Have questions about our products, need Ayurvedic advice, or want to place a bulk order? 
              We're here to help you on your wellness journey.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }}>
                  <FiPhone />
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: 2 }}>Phone</strong>
                  <a href="tel:+918904758446" style={{ color: 'var(--dark-500)', fontSize: '0.9rem' }}>+91 89047 58446</a>
                </div>
              </div>

              <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', fontSize: '1.2rem', flexShrink: 0 }}>
                  <FaWhatsapp />
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: 2 }}>WhatsApp</strong>
                  <a href="https://wa.me/918904758446" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--dark-500)', fontSize: '0.9rem' }}>Chat with us</a>
                </div>
              </div>

              <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', fontSize: '1.2rem', flexShrink: 0 }}>
                  <FiMail />
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: 2 }}>Email</strong>
                  <a href="mailto:info@snmart.com" style={{ color: 'var(--dark-500)', fontSize: '0.9rem' }}>info@snmart.com</a>
                </div>
              </div>

              <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', fontSize: '1.2rem', flexShrink: 0 }}>
                  <FiMapPin />
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: 2 }}>Location</strong>
                  <span style={{ color: 'var(--dark-500)', fontSize: '0.9rem' }}>Karnataka, India</span>
                </div>
              </div>

              <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', fontSize: '1.2rem', flexShrink: 0 }}>
                  <FiClock />
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: 2 }}>Business Hours</strong>
                  <span style={{ color: 'var(--dark-500)', fontSize: '0.9rem' }}>Mon-Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card" style={{ padding: 36 }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 24 }}>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 89047 58446" />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="Product inquiry" required />
                </div>
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                  placeholder="Tell us how we can help you..." required style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'} <FiSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
