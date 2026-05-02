import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiCalendar, FiEye, FiArrowRight } from 'react-icons/fi';
import './Blog.css';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/blogs').then(res => setBlogs(res.data.blogs || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>Ayurveda <span className="gradient-text">Blog</span></h1>
          <p>Insights, remedies, and wellness tips from ancient Ayurvedic wisdom</p>
        </div>
      </div>
      <div className="container section">
        {loading ? <LoadingSpinner size="lg" /> : blogs.length > 0 ? (
          <div className="blog-grid">
            {blogs.map(blog => (
              <Link to={`/blog/${blog.slug}`} key={blog._id} className="blog-card card">
                <div className="blog-card-img">
                  <img src={blog.featuredImage || `https://placehold.co/400x240/ECFDF5/10B981?text=${encodeURIComponent(blog.title?.substring(0,20))}`}
                    alt={blog.title} onError={e => { e.target.src = `https://placehold.co/400x240/ECFDF5/10B981?text=Blog`; }} />
                  <span className="blog-category-badge">{blog.category}</span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-meta">
                    <span><FiCalendar /> {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span><FiEye /> {blog.viewCount} views</span>
                  </div>
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <span className="blog-read-more">Read More <FiArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No blog posts yet</h3>
            <p>We're working on amazing Ayurvedic content. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
