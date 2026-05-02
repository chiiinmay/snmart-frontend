import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';
import './Products.css';

const CATEGORIES = [
  { id: '', name: 'All' }, { id: 'immunity', name: 'Immunity' },
  { id: 'digestion', name: 'Digestion' }, { id: 'hair-care', name: 'Hair Care' },
  { id: 'skin-care', name: 'Skin Care' }, { id: 'joint-care', name: 'Joint Care' },
  { id: 'general-wellness', name: 'Wellness' }, { id: 'respiratory', name: 'Respiratory' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Newest' }, { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' }, { value: 'popular', label: 'Most Popular' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector(s => s.products);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    dispatch(fetchProducts(params));
  }, [category, search, sort, page, dispatch]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="page products-page">
      <div className="page-header">
        <div className="container">
          <h1>Our <span className="gradient-text">Products</span></h1>
          <p>{search ? `Search results for "${search}"` : 'Authentic Ayurvedic remedies for a healthier life'}</p>
        </div>
      </div>

      <div className="container products-layout">
        <button className="filter-toggle-btn btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
          <FiFilter /> Filters
        </button>

        <aside className={`products-sidebar ${showFilters ? 'active' : ''}`}>
          <h3>Categories</h3>
          <ul className="filter-list">
            {CATEGORIES.map(c => (
              <li key={c.id}>
                <button className={`filter-btn ${category === c.id ? 'active' : ''}`}
                  onClick={() => updateFilter('category', c.id)}>
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
          <h3 style={{ marginTop: 24 }}>Sort By</h3>
          <select value={sort} onChange={e => updateFilter('sort', e.target.value)} className="sort-select">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </aside>

        <main className="products-main">
          {loading ? <LoadingSpinner size="lg" /> : items.length > 0 ? (
            <>
              <p className="results-count">{pagination?.total || items.length} products found</p>
              <div className="grid-4">{items.map(p => <ProductCard key={p._id} product={p} />)}</div>
              {pagination && pagination.pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pagination.pages }, (_, i) => (
                    <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                      onClick={() => updateFilter('page', String(i + 1))}>{i + 1}</button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
