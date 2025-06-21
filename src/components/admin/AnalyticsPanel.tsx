import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Activity, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AnalyticsPanelProps {
  celebrationId: string;
}

export default function AnalyticsPanel({ celebrationId }: AnalyticsPanelProps) {
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    messagesOverTime: [],
    photosOverTime: [],
    quizCompletions: 0,
    averageQuizScore: 0,
    topContributors: [],
    activityByHour: Array(24).fill(0),
    activityByDay: Array(7).fill(0)
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [celebrationId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Get date range
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case 'all':
          startDate = new Date('2020-01-01');
          break;
      }

      // Fetch messages data
      const { data: messages } = await supabase
        .from('guestbook_messages')
        .select('*')
        .eq('celebration_id', celebrationId)
        .gte('created_at', startDate.toISOString());

      // Fetch photos data
      const { data: photos } = await supabase
        .from('photos')
        .select('*')
        .eq('celebration_id', celebrationId)
        .gte('created_at', startDate.toISOString());

      // Fetch quiz responses
      const { data: quizResponses } = await supabase
        .from('quiz_responses')
        .select('*')
        .eq('celebration_id', celebrationId)
        .gte('completed_at', startDate.toISOString());

      // Process data
      const uniqueVisitors = new Set([
        ...(messages || []).map(m => m.author_name),
        ...(photos || []).map(p => p.uploaded_by || 'anonymous'),
        ...(quizResponses || []).map(q => q.user_id || 'anonymous')
      ]).size;

      const averageScore = quizResponses && quizResponses.length > 0
        ? quizResponses.reduce((acc, q) => acc + (q.score || 0), 0) / quizResponses.length
        : 0;

      // Activity by hour
      const hourlyActivity = Array(24).fill(0);
      [...(messages || []), ...(photos || []), ...(quizResponses || [])].forEach(item => {
        const hour = new Date(item.created_at || item.completed_at).getHours();
        hourlyActivity[hour]++;
      });

      // Activity by day of week
      const dailyActivity = Array(7).fill(0);
      [...(messages || []), ...(photos || []), ...(quizResponses || [])].forEach(item => {
        const day = new Date(item.created_at || item.completed_at).getDay();
        dailyActivity[day]++;
      });

      // Top contributors
      const contributorCounts = {};
      (messages || []).forEach(m => {
        contributorCounts[m.author_name] = (contributorCounts[m.author_name] || 0) + 1;
      });
      
      const topContributors = Object.entries(contributorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      setAnalytics({
        totalVisitors: uniqueVisitors,
        messagesOverTime: messages || [],
        photosOverTime: photos || [],
        quizCompletions: (quizResponses || []).length,
        averageQuizScore: Math.round(averageScore * 100) / 100,
        topContributors,
        activityByHour: hourlyActivity,
        activityByDay: dailyActivity
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">Analytics Dashboard</h2>
          <div className="flex gap-2">
            {[
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: 'all', label: 'All Time' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as any)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  timeRange === option.value
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-blue-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">{analytics.totalVisitors}</h3>
              <p className="text-white/60">Unique Visitors</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-green-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">{analytics.messagesOverTime.length}</h3>
              <p className="text-white/60">Total Messages</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="text-purple-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">{analytics.photosOverTime.length}</h3>
              <p className="text-white/60">Photos Uploaded</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-yellow-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">{analytics.averageQuizScore}</h3>
              <p className="text-white/60">Avg Quiz Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity by Hour */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Activity by Hour</h3>
          <div className="space-y-2">
            {analytics.activityByHour.map((count, hour) => {
              const maxCount = Math.max(...analytics.activityByHour);
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={hour} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-8">{hour}:00</span>
                  <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-white/80 text-sm w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity by Day */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Activity by Day</h3>
          <div className="space-y-2">
            {analytics.activityByDay.map((count, day) => {
              const maxCount = Math.max(...analytics.activityByDay);
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-8">{dayNames[day]}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-white/80 text-sm w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Top Contributors</h3>
        {analytics.topContributors.length === 0 ? (
          <p className="text-white/60 text-center py-8">No contributors yet</p>
        ) : (
          <div className="space-y-4">
            {analytics.topContributors.map((contributor, index) => (
              <div key={contributor.name} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{contributor.name}</p>
                  <p className="text-white/60 text-sm">{contributor.count} messages</p>
                </div>
                <div className="text-yellow-400 font-bold">{contributor.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}