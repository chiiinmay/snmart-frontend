import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import API from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPackage, FiUsers, FiDollarSign, FiBox, FiPlus, FiTrash2, FiImage, FiX, FiUpload, FiEdit2, FiCheck, FiXCircle, FiStar, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  // Product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category: 'immunity', price: '', stock: '', discount: 0,
    ingredients: '', benefits: '', symptoms: '', dosage: ''
  });

  // Blog form
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '', content: '', category: 'ayurveda', tags: '', isPublished: true
  });

  useEffect(() => {
    Promise.all([
      API.get('/analytics/admin/dashboard').catch(() => ({ data: { data: {} } })),
      API.get('/products?limit=50').catch(() => ({ data: { products: [] } })),
      API.get('/blogs').catch(() => ({ data: { blogs: [] } })),
      API.get('/reviews/admin/all').catch(() => ({ data: { reviews: [] } })),
    ]).then(([statsRes, prodsRes, blogsRes, reviewsRes]) => {
      setStats(statsRes.data.data);
      setProducts(prodsRes.data.products || []);
      setBlogs(blogsRes.data.blogs || []);
      setReviews(reviewsRes.data.reviews || []);
    }).finally(() => setLoading(false));
  }, []);

  // === IMAGE HANDLING ===
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) return toast.error('Max 5 images');
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };
  const removeImage = (i) => { setImageFiles(p => p.filter((_, idx) => idx !== i)); setImagePreviews(p => p.filter((_, idx) => idx !== i)); };

  // === PRODUCT CRUD ===
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrls = [];
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach(f => formData.append('images', f));
        const { data } = await API.post('/upload/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrls = data.urls;
      }
      const productData = {
        ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock), discount: Number(newProduct.discount),
        ingredients: newProduct.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        benefits: newProduct.benefits.split(',').map(s => s.trim()).filter(Boolean),
        symptoms: newProduct.symptoms.split(',').map(s => s.trim()).filter(Boolean),
        images: imageUrls
      };
      const { data } = await API.post('/products', productData);
      setProducts([data.product, ...products]);
      setShowAddProduct(false);
      setNewProduct({ name: '', description: '', category: 'immunity', price: '', stock: '', discount: 0, ingredients: '', benefits: '', symptoms: '', dosage: '' });
      setImageFiles([]); setImagePreviews([]);
      toast.success('Product added!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setUploading(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await API.delete(`/products/${id}`); setProducts(products.filter(p => p._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  // === BLOG CRUD ===
  const openBlogForm = (blog = null) => {
    if (blog) {
      setEditingBlog(blog._id);
      setBlogForm({ title: blog.title, content: blog.content || '', category: blog.category || 'ayurveda', tags: blog.tags?.join(', ') || '', isPublished: blog.isPublished });
    } else {
      setEditingBlog(null);
      setBlogForm({ title: '', content: '', category: 'ayurveda', tags: '', isPublished: true });
    }
    setShowBlogForm(true);
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(s => s.trim()).filter(Boolean),
        publishedAt: blogForm.isPublished ? new Date() : null
      };
      if (editingBlog) {
        const { data } = await API.put(`/blogs/${editingBlog}`, payload);
        setBlogs(blogs.map(b => b._id === editingBlog ? { ...b, ...data.blog } : b));
        toast.success('Blog updated!');
      } else {
        const { data } = await API.post('/blogs', payload);
        setBlogs([data.blog, ...blogs]);
        toast.success('Blog created!');
      }
      setShowBlogForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try { await API.delete(`/blogs/${id}`); setBlogs(blogs.filter(b => b._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  // === REVIEW MANAGEMENT ===
  const handleApproveReview = async (id, approve) => {
    try {
      await API.put(`/reviews/${id}`, { isApproved: approve });
      setReviews(reviews.map(r => r._id === id ? { ...r, isApproved: approve } : r));
      toast.success(approve ? 'Review approved!' : 'Review hidden');
    } catch { toast.error('Failed'); }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await API.delete(`/reviews/${id}`); setReviews(reviews.filter(r => r._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  if (user?.role !== 'admin') return <div className="page empty-state"><h2>Access Denied</h2><p>Admin privileges required</p></div>;
  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="page">
      <div className="page-header"><div className="container"><h1>Admin Dashboard</h1></div></div>
      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {['overview', 'products', 'blogs', 'reviews', 'orders'].map(t => (
            <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
              {t} {t === 'reviews' && reviews.filter(r => !r.isApproved).length > 0 && (
                <span style={{ background: 'var(--error)', color: 'white', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', marginLeft: 4 }}>
                  {reviews.filter(r => !r.isApproved).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <>
            <div className="grid-4">
              {[
                { icon: <FiDollarSign />, value: `₹${stats?.totalRevenue || 0}`, label: 'Revenue', color: 'var(--primary)' },
                { icon: <FiPackage />, value: stats?.totalOrders || 0, label: 'Orders', color: 'var(--secondary)' },
                { icon: <FiUsers />, value: stats?.totalUsers || 0, label: 'Customers', color: 'var(--accent)' },
                { icon: <FiBox />, value: products.length, label: 'Products', color: 'var(--success)' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', color: s.color, marginBottom: 8 }}>{s.icon}</div>
                  <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{s.value}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3>{products.length} Products</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddProduct(!showAddProduct)}><FiPlus /> Add Product</button>
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
                      </select></div>
                    <div className="form-group"><label>Price (₹) *</label><input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required /></div>
                    <div className="form-group"><label>Stock *</label><input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required /></div>
                    <div className="form-group"><label>Discount (%)</label><input type="number" value={newProduct.discount} onChange={e => setNewProduct({...newProduct, discount: e.target.value})} /></div>
                    <div className="form-group"><label>Dosage</label><input value={newProduct.dosage} onChange={e => setNewProduct({...newProduct, dosage: e.target.value})} /></div>
                  </div>
                  <div className="form-group"><label>Description *</label><textarea rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required /></div>
                  <div className="form-group">
                    <label><FiImage /> Product Images (up to 5)</label>
                    <div style={{ border: '2px dashed var(--gray-300)', borderRadius: 'var(--radius-md)', padding: 24, textAlign: 'center', cursor: 'pointer', background: 'var(--gray-100)' }}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--primary)'; }}
                      onDragLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-300)'; }}
                      onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--gray-300)'; handleImageSelect({ target: { files: e.dataTransfer.files } }); }}>
                      <FiUpload style={{ fontSize: '2rem', color: 'var(--dark-500)', marginBottom: 8 }} />
                      <p style={{ color: 'var(--dark-500)', fontSize: '0.9rem' }}>Click or drag & drop photos</p>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />
                    </div>
                    {imagePreviews.length > 0 && (
                      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                        {imagePreviews.map((src, i) => (
                          <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                            <img src={src} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius)', border: '2px solid var(--gray-200)' }} />
                            <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--error)', color: 'white', border: 'none', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiX /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group"><label>Ingredients (comma separated)</label><input value={newProduct.ingredients} onChange={e => setNewProduct({...newProduct, ingredients: e.target.value})} /></div>
                  <div className="form-group"><label>Benefits (comma separated)</label><input value={newProduct.benefits} onChange={e => setNewProduct({...newProduct, benefits: e.target.value})} /></div>
                  <div className="form-group"><label>Symptoms (comma separated)</label><input value={newProduct.symptoms} onChange={e => setNewProduct({...newProduct, symptoms: e.target.value})} /></div>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Save Product'}</button>
                </form>
              </div>
            )}
            <div className="card" style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead><tr style={{ background: 'var(--gray-100)', textAlign: 'left' }}>
                  <th style={{ padding: 12 }}>Image</th><th style={{ padding: 12 }}>Name</th><th style={{ padding: 12 }}>Category</th>
                  <th style={{ padding: 12 }}>Price</th><th style={{ padding: 12 }}>Stock</th><th style={{ padding: 12 }}>Actions</th>
                </tr></thead>
                <tbody>{products.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: 12 }}><img src={p.images?.[0] || 'https://placehold.co/40x40/ECFDF5/10B981?text=📦'} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius)' }} /></td>
                    <td style={{ padding: 12, fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: 12 }}><span className="badge badge-info">{p.category}</span></td>
                    <td style={{ padding: 12 }}>₹{p.price}</td>
                    <td style={{ padding: 12 }}>{p.stock}</td>
                    <td style={{ padding: 12 }}><button onClick={() => handleDeleteProduct(p._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '1.1rem' }}><FiTrash2 /></button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}

        {/* BLOGS */}
        {tab === 'blogs' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3>{blogs.length} Blog Posts</h3>
              <button className="btn btn-primary btn-sm" onClick={() => openBlogForm()}><FiPlus /> New Blog Post</button>
            </div>
            {showBlogForm && (
              <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3>{editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}</h3>
                  <button onClick={() => setShowBlogForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FiX /></button>
                </div>
                <form onSubmit={handleBlogSubmit}>
                  <div className="form-group"><label>Title *</label>
                    <input value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="Blog post title" required /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group"><label>Category</label>
                      <select value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})}>
                        {['ayurveda', 'herbs', 'lifestyle', 'recipes', 'wellness', 'skincare', 'haircare'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select></div>
                    <div className="form-group"><label>Tags (comma separated)</label>
                      <input value={blogForm.tags} onChange={e => setBlogForm({...blogForm, tags: e.target.value})} placeholder="immunity, health, tips" /></div>
                  </div>
                  <div className="form-group"><label>Content * (HTML supported)</label>
                    <textarea rows={10} value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})}
                      placeholder="<p>Write your blog content here...</p><h2>Subheading</h2><ul><li>Point 1</li></ul>" required
                      style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} /></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input type="checkbox" checked={blogForm.isPublished} onChange={e => setBlogForm({...blogForm, isPublished: e.target.checked})} style={{ accentColor: 'var(--primary)' }} />
                      Publish immediately
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary">{editingBlog ? 'Update Blog' : 'Create Blog'}</button>
                </form>
              </div>
            )}
            <div className="card" style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead><tr style={{ background: 'var(--gray-100)', textAlign: 'left' }}>
                  <th style={{ padding: 12 }}>Title</th><th style={{ padding: 12 }}>Category</th>
                  <th style={{ padding: 12 }}>Status</th><th style={{ padding: 12 }}>Views</th><th style={{ padding: 12 }}>Actions</th>
                </tr></thead>
                <tbody>{blogs.map(b => (
                  <tr key={b._id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: 12, fontWeight: 500, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</td>
                    <td style={{ padding: 12 }}><span className="badge badge-info">{b.category}</span></td>
                    <td style={{ padding: 12 }}><span className={`badge ${b.isPublished ? 'badge-success' : 'badge-warning'}`}>{b.isPublished ? 'Published' : 'Draft'}</span></td>
                    <td style={{ padding: 12 }}>{b.viewCount || 0}</td>
                    <td style={{ padding: 12, display: 'flex', gap: 8 }}>
                      <button onClick={() => openBlogForm(b)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '1.1rem' }}><FiEdit2 /></button>
                      <button onClick={() => handleDeleteBlog(b._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '1.1rem' }}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}

        {/* REVIEWS */}
        {tab === 'reviews' && (
          <>
            <h3 style={{ marginBottom: 20 }}>{reviews.length} Reviews ({reviews.filter(r => !r.isApproved).length} pending approval)</h3>
            {reviews.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                <FiStar style={{ fontSize: '2.5rem', color: 'var(--gray-400)', marginBottom: 12 }} />
                <p style={{ color: 'var(--dark-500)' }}>No reviews yet. Reviews will appear here when customers submit them.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reviews.map(r => (
                  <div key={r._id} className="card" style={{ padding: 20, borderLeft: `4px solid ${r.isApproved ? 'var(--success)' : 'var(--warning)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <strong>{r.name}</strong>
                          <span style={{ color: '#F59E0B' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                          <span className={`badge ${r.isApproved ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                            {r.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--dark-500)', marginBottom: 4 }}>
                          Product: <strong>{r.productId?.name || 'Unknown'}</strong>
                        </p>
                        {r.title && <p style={{ fontWeight: 600, marginBottom: 4 }}>{r.title}</p>}
                        <p style={{ fontSize: '0.9rem', color: 'var(--dark-600)' }}>{r.comment}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 4 }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!r.isApproved && (
                          <button onClick={() => handleApproveReview(r._id, true)} className="btn btn-sm" style={{ background: 'var(--success)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiCheck /> Approve
                          </button>
                        )}
                        {r.isApproved && (
                          <button onClick={() => handleApproveReview(r._id, false)} className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiXCircle /> Hide
                          </button>
                        )}
                        <button onClick={() => handleDeleteReview(r._id)} className="btn btn-sm" style={{ background: 'var(--error)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ORDERS */}
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
