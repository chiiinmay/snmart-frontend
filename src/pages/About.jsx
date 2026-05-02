import { FiHeart, FiTarget, FiAward, FiUsers } from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import './About.css';

const TIMELINE = [
  { year: '2020', title: 'The Seed Was Planted', desc: 'Inspired by family recipes and ancient texts, the idea for authentic Ayurvedic products was born.' },
  { year: '2021', title: 'First Formulations', desc: 'Developed initial product line with guidance from experienced Ayurvedic practitioners.' },
  { year: '2022', title: 'Online Launch', desc: 'Launched our e-commerce platform, bringing Ayurvedic wellness to doorsteps across India.' },
  { year: '2023', title: 'Growing Family', desc: 'Reached 5,000+ happy customers and expanded product range to 100+ items.' },
  { year: '2024', title: 'AI Innovation', desc: 'Introduced AI-powered symptom-based product recommendations for personalized wellness.' },
];

export default function About() {
  return (
    <div className="page about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container about-hero-content">
          <span className="hero-badge">🌿 Our Story</span>
          <h1>Rooted in <span className="gradient-text">Ancient Wisdom</span>,<br />Built for Modern Wellness</h1>
          <p>Sri Nanjundeshwara Mart brings you authentic Ayurvedic products crafted with centuries-old recipes, ensuring natural healing for a healthier tomorrow.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: 40 }}>
            <div className="mission-card card" style={{ padding: 40 }}>
              <FiTarget className="mission-icon" />
              <h2>Our Mission</h2>
              <p>To make authentic, high-quality Ayurvedic products accessible to everyone, promoting natural wellness and holistic health through time-tested remedies.</p>
            </div>
            <div className="mission-card card" style={{ padding: 40 }}>
              <FiHeart className="mission-icon" />
              <h2>Our Vision</h2>
              <p>To become India's most trusted Ayurvedic brand, blending ancient wisdom with modern science to create products that truly transform lives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><span className="stat-num">100+</span><span>Products</span></div>
            <div className="stat-item"><span className="stat-num">5000+</span><span>Happy Customers</span></div>
            <div className="stat-item"><span className="stat-num">50+</span><span>Formulations</span></div>
            <div className="stat-item"><span className="stat-num">4.8★</span><span>Average Rating</span></div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our <span className="gradient-text">Journey</span></h2>
          <p className="section-subtitle">From a small dream to a growing Ayurvedic family</p>
          <div className="timeline">
            {TIMELINE.map((item, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-content card" style={{ padding: 24 }}>
                  <span className="timeline-year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="container">
          <h2 className="section-title">What We <span className="gradient-text">Stand For</span></h2>
          <div className="grid-3" style={{ marginTop: 40 }}>
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <GiHerbsBundle style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: 16 }} />
              <h3 style={{ marginBottom: 8 }}>100% Natural</h3>
              <p style={{ color: 'var(--dark-500)', fontSize: '0.9rem' }}>All products made with pure, natural ingredients sourced ethically.</p>
            </div>
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <FiAward style={{ fontSize: '2.5rem', color: 'var(--secondary)', marginBottom: 16 }} />
              <h3 style={{ marginBottom: 8 }}>Quality Tested</h3>
              <p style={{ color: 'var(--dark-500)', fontSize: '0.9rem' }}>Every batch is tested for purity and potency before reaching you.</p>
            </div>
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <FiUsers style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: 16 }} />
              <h3 style={{ marginBottom: 8 }}>Community First</h3>
              <p style={{ color: 'var(--dark-500)', fontSize: '0.9rem' }}>Supporting local farmers and practitioners across Karnataka.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
