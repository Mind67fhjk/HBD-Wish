import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Image, 
  Brain, 
  Calendar,
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';
import { supabase, Celebration } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AdminOverviewProps {
  celebration: Celebration;
}

interface Stats {
  totalMessages: number;
  totalPhotos: number;
  totalQuizResponses: number;
  recentActivity: any[];
}

export default function AdminOverview({ celebration }: AdminOverviewProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    totalPhotos: 0,
    totalQuizResponses: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [celebration.id]);

  const fetchStats = async () => {
    try {
      const [messagesResult, photosResult, quizResult] = await Promise.all([
        supabase.from('guestbook_messages').select('*', { count: 'exact' }).eq('celebration_id', celebration.id),
        supabase.from('photos').select('*', { count: 'exact' }).eq('celebration_id', celebration.id),
        supabase.from('quiz_responses').select('*', { count: 'exact' }).eq('celebration_id', celebration.id)
      ]);

      // Get recent activity
      const recentMessages = await supabase
        .from('guestbook_messages')
        .select('*')
        .eq('celebration_id', celebration.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalMessages: messagesResult.count || 0,
        totalPhotos: photosResult.count || 0,
        totalQuizResponses: quizResult.count || 0,
        recentActivity: recentMessages.data || []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Photos Uploaded',
      value: stats.totalPhotos,
      icon: Image,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Quiz Responses',
      value: stats.totalQuizResponses,
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      change: '+15%'
    },
    {
      title: 'Days Until Birthday',
      value: Math.max(0, Math.ceil((new Date(celebration.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      change: 'countdown'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon size={24} className="text-white" />
              </div>
              {stat.change !== 'countdown' && (
                <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                  <TrendingUp size={16} />
                  {stat.change}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-white/60">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Activity size={24} />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/admin/guestbook')}
            className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-all duration-200"
          >
            <MessageSquare size={24} className="mb-2" />
            <div className="font-medium">Moderate Messages</div>
            <div className="text-sm opacity-70">Review recent guestbook entries</div>
          </button>
          <button 
            onClick={() => navigate('/admin/photos')}
            className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl text-green-300 hover:bg-green-500/30 transition-all duration-200"
          >
            <Image size={24} className="mb-2" />
            <div className="font-medium">Manage Photos</div>
            <div className="text-sm opacity-70">Organize photo gallery</div>
          </button>
          <button 
            onClick={() => navigate('/admin/quiz')}
            className="p-4 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300 hover:bg-purple-500/30 transition-all duration-200"
          >
            <Brain size={24} className="mb-2" />
            <div className="font-medium">Update Quiz</div>
            <div className="text-sm opacity-70">Add or edit quiz questions</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Clock size={24} />
          Recent Activity
        </h2>
        <div className="space-y-4">
          {stats.recentActivity.length === 0 ? (
            <p className="text-white/60 text-center py-8">No recent activity</p>
          ) : (
            stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <MessageSquare size={16} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.author_name}</p>
                  <p className="text-white/60 text-sm">{activity.message.substring(0, 100)}...</p>
                  <p className="text-white/40 text-xs mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}