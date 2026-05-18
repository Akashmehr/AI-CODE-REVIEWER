import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  // Get auth data from context
  const { user, logout, isLoggedIn } = useAuth();

  // useNavigate = programmatically go to another page
  // Like clicking a link but from JavaScript code
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                         // Clear auth state + localStorage
    toast.success('Logged out!');     // Show notification
    navigate('/login');               // Redirect to login page
  };

  return (
    <nav style={{
      background: '#0f172a',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #1e293b',
      position: 'sticky',  // Stays at top when scrolling
      top: 0,
      zIndex: 100,         // Stays above other content
    }}>

      {/* ── LOGO ─────────────────────────────────────────── */}
      {/* Link = React Router's version of <a> tag */}
      {/* Use Link instead of <a> for internal pages */}
      {/* <a> causes full page reload, Link does not */}
      <Link to="/" style={{
        color: '#38bdf8',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textDecoration: 'none',
      }}>
        🤖 AI Code Reviewer
      </Link>

      {/* ── NAV LINKS ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>

        {/* Show different links based on login status */}
        {isLoggedIn ? (
          // ── LOGGED IN: Show app links ──
          <>
            <Link to="/dashboard" style={{
              color: '#94a3b8',
              textDecoration: 'none',
            }}>
              Dashboard
            </Link>

            <Link to="/history" style={{
              color: '#94a3b8',
              textDecoration: 'none',
            }}>
              History
            </Link>

            {/* Show username */}
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              👋 {user?.name}
            </span>

            {/* Logout Button */}
            <button onClick={handleLogout} style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}>
              Logout
            </button>
          </>
        ) : (
          // ── NOT LOGGED IN: Show auth links ──
          <>
            <Link to="/login" style={{
              color: '#94a3b8',
              textDecoration: 'none',
            }}>
              Login
            </Link>

            <Link to="/signup" style={{
              background: '#38bdf8',
              color: '#0f172a',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;