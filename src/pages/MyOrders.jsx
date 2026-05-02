import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiPackage } from 'react-icons/fi';

const STATUS_COLORS = {
  pending: 'badge-warning', confirmed: 'badge-info', processing: 'badge-info',
  shipped: 'badge-accent', delivered: 'badge-success', cancelled: 'badge-error',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders').then(res => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="page">
      <div className="page-header"><div className="container"><h1>My Orders</h1></div></div>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 800 }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <FiPackage style={{ fontSize: '3rem', color: 'var(--gray-300)', marginBottom: 16 }} />
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here!</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Products</Link>
          </div>
        ) : orders.map(order => (
          <div key={order._id} className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <p style={{ fontWeight: 700 }}>#{order.orderNumber}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--dark-500)' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-info'}`}>{order.orderStatus}</span>
                <p style={{ fontWeight: 700, marginTop: 6, color: 'var(--primary-dark)' }}>₹{order.totalAmount}</p>
              </div>
            </div>
            <div>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', color: 'var(--dark-600)', borderTop: i === 0 ? '1px solid var(--gray-200)' : 'none' }}>
                  <span>{item.name} × {item.quantity}</span><span>₹{item.subtotal}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
