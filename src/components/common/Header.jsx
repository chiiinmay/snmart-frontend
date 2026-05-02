import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const { items } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenu(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-inner">
          <span>🌿 Free shipping on orders above ₹500</span>
          <span>📞 Call: +91 98765 43210</span>
        </div>
      </div>
      <nav className="header-main">
        <div className="container header-main-inner">
          <Link to="/" className="logo">
            <GiHerbsBundle className="logo-icon" />
            <div>
              <span className="logo-name">Sri Nanjundeshwara</span>
              <span className="logo-sub">Ayurveda Mart</span>
            </div>
          </Link>

          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
            <li><Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            {user?.role === 'admin' && (
              <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>
            )}
          </ul>

          <div className="header-actions">
            <button className="action-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <FiSearch />
            </button>

            <Link to="/cart" className="action-btn cart-btn" aria-label="Cart">
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="user-dropdown">
                <button className="action-btn user-btn" onClick={() => setUserMenu(!userMenu)}>
                  <FiUser />
                </button>
                {userMenu && (
                  <div className="dropdown-menu" onClick={() => setUserMenu(false)}>
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user?.name}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                    <Link to="/orders" className="dropdown-item"><FiPackage /> My Orders</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item"><FiSettings /> Admin Panel</Link>
                    )}
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
            )}

            <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div className="search-bar-container animate-fadeIn">
          <div className="container">
            <form onSubmit={handleSearch} className="search-form">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search for Ayurvedic products..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} autoFocus />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
