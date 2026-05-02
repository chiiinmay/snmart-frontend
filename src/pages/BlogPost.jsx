import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiCalendar, FiEye, FiArrowLeft, FiUser } from 'react-icons/fi';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/blogs/${slug}`)
      .then(res => { setBlog(res.data.blog); setRelated(res.data.relatedPosts || []); })
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!blog) return <div className="page empty-state"><h2>Blog post not found</h2><Link to="/blog" className="btn btn-primary">Back to Blog</Link></div>;

  return (
    <div className="page" style={{ paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--dark-500)', marginTop: 32, fontSize: '0.9rem' }}>
          <FiArrowLeft /> Back to Blog
        </Link>
        <article style={{ marginTop: 24 }} className="animate-fadeInUp">
          {blog.featuredImage && <img src={blog.featuredImage} alt={blog.title} style={{ width: '100%', borderRadius: 12, marginBottom: 24 }} />}
          <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: 'var(--dark-500)', marginBottom: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiUser /> {blog.author?.name || 'Admin'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiCalendar /> {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiEye /> {blog.viewCount} views</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: 24 }}>{blog.title}</h1>
          <div className="blog-content" style={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--dark-600)' }}
            dangerouslySetInnerHTML={{ __html: blog.content }} />
          {blog.tags?.length > 0 && (
            <div style={{ marginTop: 32, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {blog.tags.map((tag, i) => <span key={i} className="badge badge-info">{tag}</span>)}
            </div>
          )}
        </article>
        {related.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Related Posts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 24 }}>
              {related.map(r => (
                <Link to={`/blog/${r.slug}`} key={r._id} className="card" style={{ padding: 16 }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: 6 }}>{r.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--dark-500)' }}>{r.excerpt?.substring(0, 100)}...</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
