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
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = total >= 500 ? 0 : 49;
  const grandTotal = total + shipping;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    if (!address.addressLine1 || !address.city || !address.state || !address.pincode) {
      return toast.error('Please fill all required address fields');
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      // ✅ STEP 1: Create Razorpay order
      const res = await fetch(`${API_URL}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: grandTotal
        })
      });

      if (!res.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const order = await res.json();

      // ❌ Safety check
      if (!window.Razorpay) {
        return toast.error("Razorpay not loaded ❌");
      }

      // ✅ STEP 2: Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "SN Mart",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            // ✅ STEP 3: Verify payment
            const verifyRes = await fetch(`${API_URL}/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(response)
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            // ✅ STEP 4: Create order AFTER payment
            const orderData = {
              items: items.map(i => ({
                productId: i._id,
                quantity: i.quantity
              })),
              shippingAddress: address,
              paymentMethod: "ONLINE",
            };

            const { data } = await API.post('/orders', orderData);

            dispatch(clearCart());
            toast.success("Payment Successful & Order Placed ✅");

            navigate(`/order-success?order=${data.order.orderNumber}`);

          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed ❌");
          }
        }
      };

      // ✅ STEP 5: Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 900, paddingTop: 32, paddingBottom: 60 }}>
        <form onSubmit={handleOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>

            {/* LEFT */}
            <div>

              {/* Address */}
              <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                <h3><FiMapPin /> Shipping Address</h3>

                <input name="addressLine1" placeholder="Address Line 1" value={address.addressLine1} onChange={handleChange} required />
                <input name="addressLine2" placeholder="Address Line 2" value={address.addressLine2} onChange={handleChange} />

                <input name="city" placeholder="City" value={address.city} onChange={handleChange} required />
                <input name="state" placeholder="State" value={address.state} onChange={handleChange} required />

                <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange} required />
                <input name="phone" placeholder="Phone" value={address.phone} onChange={handleChange} required />
              </div>

              {/* Payment Method */}
              <div className="card" style={{ padding: 28 }}>
                <h3><FiCreditCard /> Payment Method</h3>

                {['COD', 'UPI', 'Card'].map(m => (
                  <label key={m}>
                    <input
                      type="radio"
                      value={m}
                      checked={paymentMethod === m}
                      onChange={() => setPaymentMethod(m)}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="card" style={{ padding: 28 }}>
              <h3>Order Summary</h3>

              {items.map(i => (
                <div key={i._id}>
                  {i.name} × {i.quantity} = ₹{i.price * i.quantity}
                </div>
              ))}

              <hr />
              <p>Total: ₹{grandTotal}</p>

              <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Place Order'} <FiArrowRight />
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
