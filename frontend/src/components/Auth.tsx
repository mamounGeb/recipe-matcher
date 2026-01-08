import { useState } from 'react';
import { db, useAuth } from '../lib/instantdb';
import './Auth.css';

export default function Auth() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await db.auth.sendMagicCode({ email });
      setCodeSent(true);
    } catch (err: any) {
      setError(err?.body?.message || err?.message || 'Failed to send magic code');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await db.auth.signInWithMagicCode({ email, code });
      setCode('');
      setCodeSent(false);
    } catch (err: any) {
      setError(err?.body?.message || err?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          <span className="user-email">{user.email}</span>
          <button onClick={() => db.auth.signOut()} className="sign-out-button">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Sign In</h2>
        {!codeSent ? (
          <form onSubmit={handleSendCode} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Sending...' : 'Send Magic Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="code">Magic Code</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="Enter code from email"
                maxLength={6}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCodeSent(false);
                setCode('');
                setError(null);
              }}
              className="toggle-auth-button"
            >
              Use different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

