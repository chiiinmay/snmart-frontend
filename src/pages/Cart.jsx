import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import './Cart.css';

export default function Cart() {
  const { items } = useSelector(s => s.cart);
  const { isAuthenticated } = useSelector(s => s.auth);
  const dispatch = useDispatch();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = total >= 500 ? 0 : 49;

  if (items.length === 0) {
    return (
      <div className="page cart-empty">
        <FiShoppingBag className="cart-empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any Ayurvedic products yet.</p>
        <Link to="/products" className="btn btn-primary">Browse Products <FiArrowRight /></Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header"><div className="container"><h1>Shopping Cart</h1><p>{items.length} item{items.length > 1 ? 's' : ''} in cart</p></div></div>
      <div className="container cart-layout">
        <div className="cart-items">
          {items.map(item => {
            const placeholderImg = `https://placehold.co/100x100/ECFDF5/10B981?text=${encodeURIComponent(item.name?.substring(0,8))}`;
            return (
              <div key={item._id} className="cart-item card">
                <img src={item.image || placeholderImg} alt={item.name} onError={e => { e.target.src = placeholderImg; }} />
                <div className="cart-item-info">
                  <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <p className="cart-item-price">₹{item.price}</p>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}><FiMinus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}><FiPlus /></button>
                </div>
                <p className="cart-item-subtotal">₹{item.price * item.quantity}</p>
                <button className="cart-remove-btn" onClick={() => dispatch(removeFromCart(item._id))}><FiTrash2 /></button>
              </div>
            );
          })}
          <button className="btn btn-secondary btn-sm" onClick={() => dispatch(clearCart())}>Clear Cart</button>
        </div>
        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{total}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          {shipping > 0 && <p className="shipping-note">Add ₹{500 - total} more for free shipping</p>}
          <div className="summary-row summary-total"><span>Total</span><span>₹{total + shipping}</span></div>
          <Link to={isAuthenticated ? '/checkout' : '/login'} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'} <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
