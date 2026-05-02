import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: 40 }}>
      <div className="animate-fadeInUp">
        <FiCheckCircle style={{ fontSize: '5rem', color: 'var(--success)', marginBottom: 24 }} />
        <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>Order Placed Successfully! 🎉</h1>
        {orderNumber && <p style={{ fontSize: '1.1rem', color: 'var(--dark-500)', marginBottom: 8 }}>Order Number: <strong style={{ color: 'var(--primary)' }}>{orderNumber}</strong></p>}
        <p style={{ color: 'var(--dark-500)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Thank you for your purchase! We'll send you a confirmation email shortly. Your Ayurvedic wellness products are on their way.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-primary"><FiPackage /> Track Orders</Link>
          <Link to="/" className="btn btn-secondary"><FiHome /> Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
