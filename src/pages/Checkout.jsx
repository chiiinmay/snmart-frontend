import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/slices/cartSlice';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiArrowRight } from 'react-icons/fi';

export default function Checkout() {
  const { items } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', phone: user?.phone || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = total >= 500 ? 0 : 49;
  const grandTotal = total + shipping;

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.addressLine1 || !address.city || !address.state || !address.pincode) {
      return toast.error('Please fill all required address fields');
    }
    setLoading(true);
    try {
      const orderData = {
        items: items.map(i => ({ productId: i._id, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod,
      };
      const { data } = await API.post('/orders', orderData);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/order-success?order=${data.order.orderNumber}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="page">
      <div className="page-header"><div className="container"><h1>Checkout</h1></div></div>
      <div className="container" style={{ maxWidth: 900, paddingTop: 32, paddingBottom: 60 }}>
        <form onSubmit={handleOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
            <div>
              <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}><FiMapPin /> Shipping Address</h3>
                <div className="form-group"><label>Address Line 1 *</label><input name="addressLine1" value={address.addressLine1} onChange={handleChange} required /></div>
                <div className="form-group"><label>Address Line 2</label><input name="addressLine2" value={address.addressLine2} onChange={handleChange} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group"><label>City *</label><input name="city" value={address.city} onChange={handleChange} required /></div>
                  <div className="form-group"><label>State *</label><input name="state" value={address.state} onChange={handleChange} required /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group"><label>Pincode *</label><input name="pincode" value={address.pincode} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Phone *</label><input name="phone" value={address.phone} onChange={handleChange} required /></div>
                </div>
              </div>
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}><FiCreditCard /> Payment Method</h3>
                {['COD', 'UPI', 'Card'].map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', cursor: 'pointer', borderBottom: '1px solid var(--gray-200)' }}>
                    <input type="radio" name="payment" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                    <span style={{ fontWeight: 500 }}>{m === 'COD' ? 'Cash on Delivery' : m === 'UPI' ? 'UPI Payment' : 'Card Payment'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 28, height: 'fit-content', position: 'sticky', top: 100 }}>
              <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
              {items.map(i => (
                <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem', color: 'var(--dark-600)' }}>
                  <span>{i.name} × {i.quantity}</span><span>₹{i.price * i.quantity}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: 12, paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem' }}><span>Subtotal</span><span>₹{total}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem' }}><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 700, fontSize: '1.1rem', borderTop: '2px solid var(--gray-200)', marginTop: 8 }}><span>Total</span><span>₹{grandTotal}</span></div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'} <FiArrowRight />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
