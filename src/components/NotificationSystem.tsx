import React, { useEffect, useState } from 'react';
import { Bell, X, MessageCircle, Brain } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'guestbook' | 'quiz';
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationSystemProps {
  celebrationId: string;
}

export default function NotificationSystem({ celebrationId }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to new guestbook messages
    const guestbookSubscription = supabase
      .channel('guestbook_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'guestbook_messages',
        filter: `celebration_id=eq.${celebrationId}`
      }, (payload) => {
        const newMessage = payload.new as any;
        addNotification({
          id: `guestbook_${newMessage.id}`,
          type: 'guestbook',
          message: `${newMessage.author_name} left a birthday wish: "${newMessage.message.substring(0, 50)}${newMessage.message.length > 50 ? '...' : ''}"`,
          timestamp: newMessage.created_at,
          read: false
        });
        
        // Show toast notification
        toast.success(`New birthday wish from ${newMessage.author_name}!`, {
          icon: '💌',
          duration: 4000,
        });
      })
      .subscribe();

    // Subscribe to new quiz responses
    const quizSubscription = supabase
      .channel('quiz_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'quiz_responses',
        filter: `celebration_id=eq.${celebrationId}`
      }, (payload) => {
        const newResponse = payload.new as any;
        addNotification({
          id: `quiz_${newResponse.id}`,
          type: 'quiz',
          message: `Someone completed your birthday quiz and scored ${newResponse.score} points!`,
          timestamp: newResponse.completed_at,
          read: false
        });
        
        // Show toast notification
        toast.success(`New quiz completion! Score: ${newResponse.score}`, {
          icon: '🧠',
          duration: 4000,
        });
      })
      .subscribe();

    return () => {
      guestbookSubscription.unsubscribe();
      quizSubscription.unsubscribe();
    };
  }, [celebrationId]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep only last 20
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const clearNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed top-20 right-8 w-12 h-12 rounded-full backdrop-blur-md border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-300 z-50 flex items-center justify-center text-white"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="fixed top-32 right-8 w-80 max-h-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-white/20 flex items-center justify-between">
            <h3 className="text-white font-semibold">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowPanel(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-white/60">
                <Bell size={32} className="mx-auto mb-2 opacity-40" />
                <p>No notifications yet</p>
                <p className="text-sm mt-1">You'll be notified when someone interacts with your celebration!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors ${
                    !notification.read ? 'bg-yellow-400/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.type === 'guestbook' ? (
                        <MessageCircle size={16} className="text-blue-400" />
                      ) : (
                        <Brain size={16} className="text-green-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="w-2 h-2 bg-yellow-400 rounded-full"
                          title="Mark as read"
                        />
                      )}
                      <button
                        onClick={() => clearNotification(notification.id)}
                        className="text-white/40 hover:text-white/60 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}