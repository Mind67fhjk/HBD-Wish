import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import { supabase, GuestbookMessage } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface GuestbookManagerProps {
  celebrationId: string;
}

export default function GuestbookManager({ celebrationId }: GuestbookManagerProps) {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('admin_guestbook')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'guestbook_messages',
        filter: `celebration_id=eq.${celebrationId}`
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [celebrationId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook_messages')
        .select('*')
        .eq('celebration_id', celebrationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('guestbook_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      toast.success('Message deleted successfully');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages
    .filter(message => 
      message.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.author_name.localeCompare(b.author_name);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-blue-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">{messages.length}</h3>
              <p className="text-white/60">Total Messages</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <Eye className="text-green-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">{new Set(messages.map(m => m.author_name)).size}</h3>
              <p className="text-white/60">Unique Visitors</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <Filter className="text-purple-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">{filteredMessages.length}</h3>
              <p className="text-white/60">Filtered Results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search messages or names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">By Name</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Guestbook Messages</h2>
        
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={64} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/60">No messages found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-yellow-400 font-semibold text-lg">{message.author_name}</h4>
                    <p className="text-white/60 text-sm">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                    title="Delete message"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-white/90 leading-relaxed">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}