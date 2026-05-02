import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../store/slices/cartSlice';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const discountedPrice = product.discount > 0
    ? Math.round(product.price - (product.price * product.discount / 100))
    : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const placeholderImg = `https://placehold.co/300x300/ECFDF5/10B981?text=${encodeURIComponent(product.name?.substring(0, 12) || 'Product')}`;

  return (
    <Link to={`/products/${product._id}`} className="product-card card">
      <div className="product-card-img">
        <img src={product.images?.[0] || placeholderImg} alt={product.name}
          onError={e => { e.target.src = placeholderImg; }} />
        {product.discount > 0 && (
          <span className="product-discount-badge">-{product.discount}%</span>
        )}
        {product.stock <= 0 && <span className="product-oos-badge">Out of Stock</span>}
        <div className="product-card-actions">
          <button className="product-action-btn" onClick={handleAddToCart} title="Add to Cart"
            disabled={product.stock <= 0}>
            <FiShoppingCart />
          </button>
          <span className="product-action-btn"><FiEye /></span>
        </div>
      </div>
      <div className="product-card-body">
        <span className="product-category">{product.category?.replace('-', ' ')}</span>
        <h3 className="product-card-title">{product.name}</h3>
        <div className="product-card-price">
          <span className="price-current">₹{discountedPrice}</span>
          {product.discount > 0 && (
            <span className="price-original">₹{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
