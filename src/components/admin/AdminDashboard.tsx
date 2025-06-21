import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  MessageSquare, 
  Image, 
  Brain, 
  Users, 
  Calendar,
  LogOut,
  Bell,
  BarChart3,
  Palette,
  Music,
  Share2
} from 'lucide-react';
import { Celebration } from '../../lib/supabase';
import AdminOverview from './AdminOverview';
import CelebrationSettings from './CelebrationSettings';
import GuestbookManager from './GuestbookManager';
import PhotoManager from './PhotoManager';
import QuizManager from './QuizManager';
import NotificationManager from './NotificationManager';
import AnalyticsPanel from './AnalyticsPanel';
import ThemeCustomizer from './ThemeCustomizer';
import MusicManager from './MusicManager';
import SharingManager from './SharingManager';

interface AdminDashboardProps {
  celebration: Celebration;
  onRefresh: () => void;
}

export default function AdminDashboard({ celebration, onRefresh }: AdminDashboardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('elaja_admin_token');
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
    { path: '/admin/settings', icon: Settings, label: 'Celebration Settings' },
    { path: '/admin/guestbook', icon: MessageSquare, label: 'Guestbook' },
    { path: '/admin/photos', icon: Image, label: 'Photo Gallery' },
    { path: '/admin/quiz', icon: Brain, label: 'Quiz Manager' },
    { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/theme', icon: Palette, label: 'Theme & Design' },
    { path: '/admin/music', icon: Music, label: 'Music & Audio' },
    { path: '/admin/sharing', icon: Share2, label: 'Social Sharing' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-black/20 backdrop-blur-xl border-r border-white/10 min-h-screen`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-lg">E</span>
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-white font-bold text-xl">ElaJa Admin</h1>
                  <p className="text-white/60 text-sm">Birthday Control Panel</p>
                </div>
              )}
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = item.exact 
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon size={20} />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all duration-200 w-full"
              >
                <LogOut size={20} />
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <LayoutDashboard size={20} />
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {menuItems.find(item => 
                    item.exact 
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path)
                  )?.label || 'Admin Dashboard'}
                </h1>
                <p className="text-white/60">Manage your birthday celebration</p>
              </div>
              
              <Link
                to="/"
                target="_blank"
                className="btn-primary"
              >
                View Live Site
              </Link>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<AdminOverview celebration={celebration} />} />
            <Route path="/settings" element={<CelebrationSettings celebration={celebration} onRefresh={onRefresh} />} />
            <Route path="/guestbook" element={<GuestbookManager celebrationId={celebration.id} />} />
            <Route path="/photos" element={<PhotoManager celebrationId={celebration.id} />} />
            <Route path="/quiz" element={<QuizManager celebrationId={celebration.id} />} />
            <Route path="/notifications" element={<NotificationManager celebrationId={celebration.id} />} />
            <Route path="/analytics" element={<AnalyticsPanel celebrationId={celebration.id} />} />
            <Route path="/theme" element={<ThemeCustomizer />} />
            <Route path="/music" element={<MusicManager />} />
            <Route path="/sharing" element={<SharingManager celebration={celebration} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}