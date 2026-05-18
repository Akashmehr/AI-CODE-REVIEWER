import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getHistoryAPI, deleteReviewAPI } from '../services/api';
import type { Review } from '../types';

const HistoryPage = () => {
  // ── STATE ────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>([]); // All reviews
  const [loading, setLoading] = useState(true);          // Initial load
  const [selected, setSelected] = useState<Review | null>(null); // Expanded review
  const [deleting, setDeleting] = useState<string | null>(null); // ID being deleted

  // ── FETCH HISTORY ON PAGE LOAD ───────────────────────────────
  // useEffect with [] runs ONCE when component first mounts
  // "mounts" = when component appears on screen for first time
  useEffect(() => {
    fetchHistory();
  }, []); // [] = empty dependency array = run once only

  const fetchHistory = async () => {
    try {
      const res = await getHistoryAPI();
      setReviews(res.data); // Array of Review objects

    } catch {
      toast.error('Failed to load history');

    } finally {
      setLoading(false);
    }
  };

  // ── DELETE REVIEW ────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeleting(id); // Track which item is being deleted

    try {
      await deleteReviewAPI(id);

      // Remove deleted review from state WITHOUT re-fetching
      // filter() keeps all reviews EXCEPT the deleted one
      setReviews(reviews.filter((r) => r._id !== id));

      // If user was viewing this review, close it
      if (selected?._id === id) setSelected(null);

      toast.success('Review deleted!');

    } catch {
      toast.error('Failed to delete review');

    } finally {
      setDeleting(null);
    }
  };

  // ── TOGGLE REVIEW DETAILS ────────────────────────────────────
  const toggleReview = (review: Review) => {
    // If already selected, close it. Otherwise open it.
    setSelected(selected?._id === review._id ? null : review);
  };

  // ── LOADING STATE ────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Loading history...
        </p>
      </div>
    );
  }

  // ── MAIN RENDER ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* ── HEADER ─────────────────────────────────────────── */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '2rem', marginBottom: '0.5rem' }}>
            📁 Review History
          </h1>
          <p style={{ color: '#64748b' }}>
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} saved
          </p>
        </div>

        {/* ── EMPTY STATE ────────────────────────────────────── */}
        {reviews.length === 0 && (
          <div style={{
            background: '#1e293b',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            border: '1px solid #334155',
          }}>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              No reviews yet!
            </p>
            <p style={{ color: '#475569', marginTop: '0.5rem' }}>
              Go to Dashboard and review some code first.
            </p>
          </div>
        )}

        {/* ── REVIEW LIST ────────────────────────────────────── */}
        {reviews.map((review) => (
          <div
            key={review._id}  // Unique key for React list rendering
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1rem',
              border: selected?._id === review._id
                ? '1px solid #38bdf8'  // Blue border when selected
                : '1px solid #334155', // Default border
              transition: 'border 0.2s',
            }}
          >
            {/* ── REVIEW HEADER ───────────────────────────── */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}>
              {/* Language badge */}
              <span style={{
                background: '#0f172a',
                color: '#38bdf8',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}>
                {review.language}
              </span>

              {/* Date */}
              <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                {/* toLocaleDateString formats: "15 Jan 2026" */}
              </span>
            </div>

            {/* ── CODE PREVIEW ────────────────────────────── */}
            <pre style={{
              color: '#94a3b8',
              fontSize: '0.8rem',
              background: '#0f172a',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              overflow: 'hidden',
              maxHeight: '80px',     // Show only first few lines
              marginBottom: '1rem',
              fontFamily: 'monospace',
              lineHeight: '1.5',
            }}>
              {review.code.slice(0, 200)}
              {review.code.length > 200 ? '...' : ''}
              {/* slice(0,200) = show first 200 chars only */}
            </pre>

            {/* ── ACTION BUTTONS ──────────────────────────── */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {/* View/Hide Feedback Button */}
              <button
                onClick={() => toggleReview(review)}
                style={{
                  background: selected?._id === review._id ? '#1d4ed8' : '#1e3a5f',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                {selected?._id === review._id ? '🔼 Hide Feedback' : '🔽 View Feedback'}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(review._id)}
                disabled={deleting === review._id}
                style={{
                  background: deleting === review._id ? '#7f1d1d' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: deleting === review._id ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                {deleting === review._id ? 'Deleting...' : '🗑️ Delete'}
              </button>
            </div>

            {/* ── EXPANDED FEEDBACK ───────────────────────── */}
            {/* Shows when this review is selected */}
            {selected?._id === review._id && (
              <div style={{
                marginTop: '1.25rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #334155',
              }}>
                <pre style={{
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  fontFamily: "'Segoe UI', sans-serif",
                  lineHeight: '1.8',
                  fontSize: '0.95rem',
                }}>
                  {review.feedback}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;