import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Eye, EyeOff, Search, Filter, Reply, Send } from 'lucide-react';
import { supabase, GuestbookMessage } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface GuestbookManagerProps {
  celebrationId: string;
}

interface MessageWithReply extends GuestbookMessage {
  admin_reply?: string;
  reply_timestamp?: string;
}

export default function GuestbookManager({ celebrationId }: GuestbookManagerProps) {
  const [messages, setMessages] = useState<MessageWithReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time updates - using shared channel name
    const subscription = supabase
      .channel(`guestbook_${celebrationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'guestbook_messages',
        filter: `celebration_id=eq.${celebrationId}`
      }, (payload) => {
        console.log('Admin received new message:', payload);
        const newMessage = payload.new as MessageWithReply;
        setMessages(prev => [newMessage, ...prev]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'guestbook_messages',
        filter: `celebration_id=eq.${celebrationId}`
      }, (payload) => {
        console.log('Admin received message update:', payload);
        const updatedMessage = payload.new as MessageWithReply;
        setMessages(prev => prev.map(msg => 
          msg.id === updatedMessage.id ? updatedMessage : msg
        ));
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'guestbook_messages',
        filter: `celebration_id=eq.${celebrationId}`
      }, (payload) => {
        console.log('Admin received message deletion:', payload);
        const deletedMessage = payload.old as MessageWithReply;
        setMessages(prev => prev.filter(msg => msg.id !== deletedMessage.id));
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

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      console.log('Fetched messages:', data);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    console.log('Attempting to delete message:', messageId);
    setDeleting(messageId);

    try {
      // Delete from database - this will trigger real-time event for all subscribers
      const { error: deleteError } = await supabase
        .from('guestbook_messages')
        .delete()
        .eq('id', messageId);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      console.log('Message deleted successfully from database');
      toast.success('Message deleted successfully!');
      
      // The real-time subscription will handle removing it from the UI
      
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(`Failed to delete message: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const saveReply = async (messageId: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      console.log('Saving reply for message:', messageId);
      
      const { error } = await supabase
        .from('guestbook_messages')
        .update({
          admin_reply: replyText.trim(),
          reply_timestamp: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) {
        console.error('Reply error:', error);
        throw error;
      }
      
      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply saved successfully!');
      
    } catch (error) {
      console.error('Error saving reply:', error);
      toast.error('Failed to save reply');
    }
  };

  const deleteReply = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    try {
      const { error } = await supabase
        .from('guestbook_messages')
        .update({
          admin_reply: null,
          reply_timestamp: null
        })
        .eq('id', messageId);

      if (error) throw error;
      
      toast.success('Reply deleted');
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast.error('Failed to delete reply');
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
            <Reply className="text-green-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">
                {messages.filter(m => m.admin_reply).length}
              </h3>
              <p className="text-white/60">Replied Messages</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <Eye className="text-purple-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">{new Set(messages.map(m => m.author_name)).size}</h3>
              <p className="text-white/60">Unique Visitors</p>
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
        <h2 className="text-xl font-semibold text-white mb-6">Guestbook Messages ({filteredMessages.length})</h2>
        
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReplyingTo(replyingTo === message.id ? null : message.id)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all duration-200"
                      title="Reply to message"
                    >
                      <Reply size={18} />
                    </button>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      disabled={deleting === message.id}
                      className={`p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200 ${
                        deleting === message.id ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
                      }`}
                      title="Delete message"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <p className="text-white/90 leading-relaxed mb-4">{message.message}</p>

                {/* Admin Reply */}
                {message.admin_reply && (
                  <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-yellow-400 font-medium text-sm">Admin Reply</h5>
                      <button
                        onClick={() => deleteReply(message.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                        title="Delete reply"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">{message.admin_reply}</p>
                    {message.reply_timestamp && (
                      <p className="text-white/50 text-xs mt-2">
                        {new Date(message.reply_timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === message.id && (
                  <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveReply(message.id)}
                        className="btn-primary text-sm"
                      >
                        <Send size={16} />
                        Send Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}