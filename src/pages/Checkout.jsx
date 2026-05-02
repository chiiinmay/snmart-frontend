import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/slices/cartSlice';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiArrowRight, FiTruck } from 'react-icons/fi';

export default function Checkout() {
  const { items } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '',
    phone: user?.phone || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = total >= 500 ? 0 : 49;
  const grandTotal = total + shipping;

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const placeOrder = async (paymentMethodUsed, paymentId = null) => {
    const orderData = {
      items: items.map(i => ({ productId: i._id, quantity: i.quantity })),
      shippingAddress: address,
      paymentMethod: paymentMethodUsed,
      ...(paymentId && { paymentId })
    };
    const { data } = await API.post('/orders', orderData);
    dispatch(clearCart());
    toast.success('Order placed successfully! ✅');
    navigate(`/order-success?order=${data.order?.orderNumber || 'confirmed'}`);
  };

  const handleCOD = async () => {
    setLoading(true);
    try {
      await placeOrder('COD');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = async () => {
    setLoading(true);
    try {
      // Step 1: Create Razorpay order on backend
      const { data: order } = await API.post('/payment/create-order', { amount: grandTotal });

      if (!window.Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh and try again.');
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_SkbjuRYQrrkUdG',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Sri Nanjundeshwara Mart',
        description: 'Ayurvedic Products Order',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // Step 4: Place the order
            await placeOrder('ONLINE', response.razorpay_payment_id);
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: address.phone
        },
        theme: { color: '#10B981' },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.addressLine1 || !address.city || !address.state || !address.pincode || !address.phone) {
      return toast.error('Please fill all required address fields');
    }
    if (paymentMethod === 'COD') {
      handleCOD();
    } else {
      handleRazorpay();
    }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="page">
      <div className="page-header"><div className="container"><h1>Checkout</h1></div></div>
      <div className="container" style={{ maxWidth: 900, paddingTop: 32, paddingBottom: 60 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
            <div>
              {/* Address */}
              <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}><FiMapPin /> Shipping Address</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="form-group"><label>Address Line 1 *</label>
                    <input name="addressLine1" value={address.addressLine1} onChange={handleChange} placeholder="House/Flat No., Street" required /></div>
                  <div className="form-group"><label>Address Line 2</label>
                    <input name="addressLine2" value={address.addressLine2} onChange={handleChange} placeholder="Landmark, Area" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group"><label>City *</label>
                      <input name="city" value={address.city} onChange={handleChange} required /></div>
                    <div className="form-group"><label>State *</label>
                      <input name="state" value={address.state} onChange={handleChange} required /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group"><label>Pincode *</label>
                      <input name="pincode" value={address.pincode} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Phone *</label>
                      <input name="phone" value={address.phone} onChange={handleChange} required /></div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}><FiCreditCard /> Payment Method</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { id: 'COD', label: 'Cash on Delivery', icon: <FiTruck />, desc: 'Pay when you receive' },
                    { id: 'ONLINE', label: 'Pay Online (UPI/Card)', icon: <FiCreditCard />, desc: 'Secure Razorpay payment' }
                  ].map(m => (
                    <label key={m.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                      border: `2px solid ${paymentMethod === m.id ? 'var(--primary)' : 'var(--gray-200)'}`,
                      borderRadius: 'var(--radius-md)', cursor: 'pointer',
                      background: paymentMethod === m.id ? 'var(--primary-50)' : 'var(--white)'
                    }}>
                      <input type="radio" value={m.id} checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)} style={{ accentColor: 'var(--primary)' }} />
                      <span style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>{m.icon}</span>
                      <div>
                        <strong style={{ display: 'block' }}>{m.label}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--dark-500)' }}>{m.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="card" style={{ padding: 28, alignSelf: 'start', position: 'sticky', top: 100 }}>
              <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
              {items.map(i => (
                <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-200)', fontSize: '0.9rem' }}>
                  <span>{i.name} × {i.quantity}</span>
                  <span style={{ fontWeight: 600 }}>₹{i.price * i.quantity}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem' }}>
                <span>Subtotal</span><span>₹{total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem', color: shipping === 0 ? 'var(--success)' : 'var(--dark-500)' }}>
                <span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', marginTop: 8, borderTop: '2px solid var(--dark)', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total</span><span style={{ color: 'var(--primary-dark)' }}>₹{grandTotal}</span>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }} disabled={loading}>
                {loading ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order (COD)' : `Pay ₹${grandTotal}`} <FiArrowRight />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
