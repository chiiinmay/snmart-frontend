import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import AIChatWidget from './components/ai/AIChatWidget';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Contact from './pages/Contact';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { borderRadius: '8px', background: '#1F2937', color: '#fff', fontSize: '0.9rem' }
        }} />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <AIChatWidget />
        <WhatsAppButton />
      </Router>
    </Provider>
  );
}

export default App;
