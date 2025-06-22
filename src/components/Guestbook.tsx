import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { supabase, GuestbookMessage } from '../lib/supabase';
import toast from 'react-hot-toast';

interface GuestbookProps {
  celebrationId: string;
}

interface MessageWithReply extends GuestbookMessage {
  admin_reply?: string;
  reply_timestamp?: string;
}

const emojis = ['🎉', '🎂', '🎈', '🎁', '❤️', '🌟'];

export default function Guestbook({ celebrationId }: GuestbookProps) {
  const [messages, setMessages] = useState<MessageWithReply[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time updates with a unique channel name for public view
    const subscription = supabase
      .channel(`public_guestbook_${celebrationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'guestbook_messages',
        filter: `celebration_id=eq.${celebrationId}`
      }, (payload) => {
        console.log('Public received new message:', payload);
        const newMessage = payload.new as MessageWithReply;
        setMessages(prev => [newMessage, ...prev]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'guestbook_messages',
        filter: `celebration_id=eq.${celebrationId}`
      }, (payload) => {
        console.log('Public received message update:', payload);
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
        console.log('Public received message deletion:', payload);
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

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const addMessage = async () => {
    if (!name.trim() || !message.trim()) {
      toast.error('Please fill in both name and message');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('guestbook_messages')
        .insert({
          celebration_id: celebrationId,
          author_name: name.trim(),
          message: message.trim(),
        });

      if (error) throw error;
      
      setName('');
      setMessage('');
      toast.success('Message added successfully!');
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to add message');
    } finally {
      setLoading(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className="font-playfair text-3xl text-yellow-400 text-center mb-8">Digital Guestbook</h2>
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-md focus:border-yellow-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 mb-4"
          />
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Leave a birthday message... (Press Enter to send, Shift+Enter for new line)"
            rows={4}
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-md focus:border-yellow-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 resize-none mb-4"
          />
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="text-2xl hover:scale-125 transition-transform duration-200 p-2 rounded-lg hover:bg-white/10"
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <button
              onClick={addMessage}
              disabled={loading}
              className="btn-primary"
            >
              <Send size={20} />
              {loading ? 'Posting...' : 'Post Message'}
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-white/60 py-12">
              <MessageCircle size={64} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Be the first to leave a birthday wish!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border-l-4 border-l-yellow-400"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-yellow-400">{msg.author_name}</h4>
                  <span className="text-white/60 text-sm">
                    {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-white/90 leading-relaxed mb-3">{msg.message}</p>
                
                {/* Show admin reply if exists */}
                {msg.admin_reply && (
                  <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 font-medium text-sm">💬 Admin Reply</span>
                      {msg.reply_timestamp && (
                        <span className="text-white/50 text-xs">
                          {new Date(msg.reply_timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">{msg.admin_reply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}