import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner">
        <div className="leaf leaf-1">🌿</div>
        <div className="leaf leaf-2">🍃</div>
        <div className="leaf leaf-3">🌱</div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
