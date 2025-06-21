import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ElaJa's exclusive admin password - Only you can access!
  const ELAJA_ADMIN_PASSWORD = 'ElaJa2025BirthdayAdmin!';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (password === ELAJA_ADMIN_PASSWORD) {
        localStorage.setItem('elaja_admin_token', 'elaja_authenticated');
        toast.success('Welcome ElaJa! Admin access granted.');
        onLogin();
      } else {
        toast.error('Access denied. This admin panel is exclusively for ElaJa.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Shield size={64} className="mx-auto mb-4 text-yellow-400" />
          <h1 className="font-playfair text-3xl text-yellow-400 mb-2">ElaJa's Admin Panel</h1>
          <p className="text-white/70">Exclusive access for ElaJa only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your exclusive admin password"
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-md focus:border-yellow-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            <Shield size={20} />
            {loading ? 'Verifying Access...' : 'Access ElaJa\'s Dashboard'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-xl">
          <p className="text-yellow-400 text-sm font-medium mb-2">🔒 Exclusive Access</p>
          <p className="text-white/70 text-sm">This admin panel is designed exclusively for ElaJa. Only the correct password will grant access to manage the birthday celebration.</p>
        </div>

        <div className="mt-4 p-4 bg-blue-400/10 border border-blue-400/20 rounded-xl">
          <p className="text-blue-400 text-sm font-medium mb-2">✨ Admin Features</p>
          <ul className="text-white/60 text-xs space-y-1">
            <li>• Manage birthday countdown timer</li>
            <li>• Delete and reply to messages</li>
            <li>• Download photos (admin-only)</li>
            <li>• Control music and themes</li>
            <li>• Full celebration customization</li>
          </ul>
        </div>
      </div>
    </div>
  );
}