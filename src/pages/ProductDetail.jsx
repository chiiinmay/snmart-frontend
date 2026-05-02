import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import API from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/products/ProductCard';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiMinus, FiPlus, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data.product);
        API.post(`/products/${id}/view`).catch(() => {});
        return API.get(`/products/category/${res.data.product.category}?limit=4`);
      })
      .then(res => setRelated((res.data.products || []).filter(p => p._id !== id).slice(0, 4)))
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!product) return <div className="page empty-state"><h2>Product not found</h2><Link to="/products" className="btn btn-primary">Browse Products</Link></div>;

  const discountedPrice = product.discount > 0
    ? Math.round(product.price - (product.price * product.discount / 100)) : product.price;
  const placeholderImg = `https://placehold.co/500x500/ECFDF5/10B981?text=${encodeURIComponent(product.name?.substring(0, 15))}`;
  const images = product.images?.length > 0 ? product.images : [placeholderImg];

  const handleAdd = () => {
    dispatch(addToCart({ _id: product._id, name: product.name, price: discountedPrice, image: images[0], stock: product.stock, quantity }));
    toast.success('Added to cart!');
  };

  return (
    <div className="page product-detail-page">
      <div className="container">
        <Link to="/products" className="back-link"><FiArrowLeft /> Back to Products</Link>
        <div className="pd-grid">
          <div className="pd-images">
            <div className="pd-main-img">
              <img src={images[activeImg] || placeholderImg} alt={product.name} onError={e => { e.target.src = placeholderImg; }} />
              {product.discount > 0 && <span className="product-discount-badge">-{product.discount}%</span>}
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, i) => (
                  <button key={i} className={`pd-thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt="" onError={e => { e.target.src = placeholderImg; }} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="pd-info">
            <span className="product-category">{product.category?.replace('-', ' ')}</span>
            <h1>{product.name}</h1>
            <div className="pd-price">
              <span className="price-current">₹{discountedPrice}</span>
              {product.discount > 0 && <span className="price-original">₹{product.price}</span>}
              {product.discount > 0 && <span className="badge badge-success">Save ₹{product.price - discountedPrice}</span>}
            </div>
            <p className="pd-desc">{product.description}</p>
            {product.dosage && <p className="pd-dosage"><strong>Dosage:</strong> {product.dosage}</p>}
            <div className="pd-qty">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><FiPlus /></button>
            </div>
            <div className="pd-actions">
              <button className="btn btn-primary btn-lg" onClick={handleAdd} disabled={product.stock <= 0}>
                <FiShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            <div className="pd-features">
              <div><FiTruck /> Free shipping above ₹500</div>
              <div><FiShield /> 100% Authentic & Natural</div>
            </div>
            {product.benefits?.length > 0 && (
              <div className="pd-section"><h3>Benefits</h3><ul>{product.benefits.map((b, i) => <li key={i}>✅ {b}</li>)}</ul></div>
            )}
            {product.ingredients?.length > 0 && (
              <div className="pd-section"><h3>Ingredients</h3><div className="pd-tags">{product.ingredients.map((ing, i) => <span key={i} className="badge badge-accent">{ing}</span>)}</div></div>
            )}
          </div>
        </div>
        {related.length > 0 && (
          <div className="pd-related section">
            <h2 className="section-title">Related Products</h2>
            <div className="grid-4">{related.map(p => <ProductCard key={p._id} product={p} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
