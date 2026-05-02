import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPackage, FiUsers, FiDollarSign, FiBox, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category: 'immunity', price: '', stock: '', discount: 0,
    ingredients: '', benefits: '', symptoms: '', dosage: ''
  });

  useEffect(() => {
    Promise.all([
      API.get('/analytics/admin/dashboard').catch(() => ({ data: { data: {} } })),
      API.get('/products?limit=50').catch(() => ({ data: { products: [] } })),
    ]).then(([statsRes, prodsRes]) => {
      setStats(statsRes.data.data);
      setProducts(prodsRes.data.products || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        discount: Number(newProduct.discount),
        ingredients: newProduct.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        benefits: newProduct.benefits.split(',').map(s => s.trim()).filter(Boolean),
        symptoms: newProduct.symptoms.split(',').map(s => s.trim()).filter(Boolean),
      };
      const { data } = await API.post('/products', productData);
      setProducts([data.product, ...products]);
      setShowAddProduct(false);
      setNewProduct({ name: '', description: '', category: 'immunity', price: '', stock: '', discount: 0, ingredients: '', benefits: '', symptoms: '', dosage: '' });
      toast.success('Product added!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add product'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (err) { toast.error('Failed to delete'); }
  };

  if (user?.role !== 'admin') return <div className="page empty-state"><h2>Access Denied</h2><p>Admin privileges required</p></div>;
  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="page">
      <div className="page-header"><div className="container"><h1>Admin Dashboard</h1></div></div>
      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {['overview', 'products', 'orders'].map(t => (
            <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            <div className="grid-4">
              <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                <FiDollarSign style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: 8 }} />
                <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{stats?.totalRevenue || 0}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>Total Revenue</p>
              </div>
              <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                <FiPackage style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: 8 }} />
                <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats?.totalOrders || 0}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>Total Orders</p>
              </div>
              <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                <FiUsers style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: 8 }} />
                <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats?.totalUsers || 0}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>Customers</p>
              </div>
              <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                <FiBox style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: 8 }} />
                <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats?.totalProducts || 0}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>Products</p>
              </div>
            </div>
            {stats?.topProducts?.length > 0 && (
              <div className="card" style={{ padding: 24, marginTop: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Top Products</h3>
                {stats.topProducts.map(p => (
                  <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-200)', fontSize: '0.9rem' }}>
                    <span>{p.name}</span>
                    <span style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>{p.purchaseCount} sold</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'products' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3>{products.length} Products</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddProduct(!showAddProduct)}>
                <FiPlus /> Add Product
              </button>
            </div>
            {showAddProduct && (
              <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group"><label>Name *</label><input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required /></div>
                    <div className="form-group"><label>Category *</label>
                      <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                        {['immunity','digestion','hair-care','skin-care','joint-care','respiratory','general-wellness'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group"><label>Price (₹) *</label><input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required /></div>
                    <div className="form-group"><label>Stock *</label><input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required /></div>
                    <div className="form-group"><label>Discount (%)</label><input type="number" value={newProduct.discount} onChange={e => setNewProduct({...newProduct, discount: e.target.value})} /></div>
                    <div className="form-group"><label>Dosage</label><input value={newProduct.dosage} onChange={e => setNewProduct({...newProduct, dosage: e.target.value})} /></div>
                  </div>
                  <div className="form-group"><label>Description *</label><textarea rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required /></div>
                  <div className="form-group"><label>Ingredients (comma separated)</label><input value={newProduct.ingredients} onChange={e => setNewProduct({...newProduct, ingredients: e.target.value})} placeholder="Ashwagandha, Turmeric, Tulsi" /></div>
                  <div className="form-group"><label>Benefits (comma separated)</label><input value={newProduct.benefits} onChange={e => setNewProduct({...newProduct, benefits: e.target.value})} placeholder="Boosts immunity, Reduces stress" /></div>
                  <div className="form-group"><label>Symptoms (comma separated)</label><input value={newProduct.symptoms} onChange={e => setNewProduct({...newProduct, symptoms: e.target.value})} placeholder="fatigue, headache, cold" /></div>
                  <button type="submit" className="btn btn-primary">Save Product</button>
                </form>
              </div>
            )}
            <div className="card" style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--gray-100)', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Name</th><th style={{ padding: 12 }}>Category</th>
                    <th style={{ padding: 12 }}>Price</th><th style={{ padding: 12 }}>Stock</th><th style={{ padding: 12 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: 12, fontWeight: 500 }}>{p.name}</td>
                      <td style={{ padding: 12 }}><span className="badge badge-info">{p.category}</span></td>
                      <td style={{ padding: 12 }}>₹{p.price}</td>
                      <td style={{ padding: 12 }}>{p.stock}</td>
                      <td style={{ padding: 12 }}>
                        <button onClick={() => handleDelete(p._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '1.1rem' }}><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'orders' && (
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Recent Orders</h3>
            {stats?.recentOrders?.length > 0 ? stats.recentOrders.map(o => (
              <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--gray-200)', fontSize: '0.9rem', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontWeight: 600 }}>#{o.orderNumber}</span>
                <span>{o.userId?.name || 'Guest'}</span>
                <span className={`badge ${o.orderStatus === 'delivered' ? 'badge-success' : 'badge-warning'}`}>{o.orderStatus}</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>₹{o.totalAmount}</span>
              </div>
            )) : <p style={{ color: 'var(--dark-500)' }}>No orders yet</p>}
          </div>
        )}
      </div>
    </div>
  );
}
