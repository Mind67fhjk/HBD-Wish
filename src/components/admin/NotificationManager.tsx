import React, { useState, useEffect } from 'react';
import { Bell, Settings, Volume2, VolumeX, Smartphone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationManagerProps {
  celebrationId: string;
}

export default function NotificationManager({ celebrationId }: NotificationManagerProps) {
  const [settings, setSettings] = useState({
    enableSound: true,
    enablePush: true,
    enableEmail: false,
    soundVolume: 50,
    notificationTypes: {
      guestbook: true,
      photos: true,
      quiz: true,
      general: true
    }
  });

  const [testNotification, setTestNotification] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('elaja_notification_settings');
    if (saved) {
      setSettings({ ...settings, ...JSON.parse(saved) });
    }
  };

  const saveSettings = () => {
    localStorage.setItem('elaja_notification_settings', JSON.stringify(settings));
    toast.success('Notification settings saved!');
  };

  const sendTestNotification = () => {
    if (!testNotification.trim()) {
      toast.error('Please enter a test message');
      return;
    }

    // Create a test notification
    toast.success(testNotification, {
      icon: '🔔',
      duration: 4000,
    });

    // Play sound if enabled
    if (settings.enableSound) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eci0FJHfH8N2QQAoUXrTp66hVFAp');
      audio.volume = settings.soundVolume / 100;
      audio.play().catch(() => {});
    }

    setTestNotification('');
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Settings size={24} />
          Notification Settings
        </h2>

        <div className="space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">General Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.enableSound ? <Volume2 className="text-green-400" size={20} /> : <VolumeX className="text-red-400" size={20} />}
                  <div>
                    <p className="text-white font-medium">Sound Notifications</p>
                    <p className="text-white/60 text-sm">Play sound when notifications arrive</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableSound}
                    onChange={(e) => setSettings({ ...settings, enableSound: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>

              {settings.enableSound && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Sound Volume: {settings.soundVolume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.soundVolume}
                    onChange={(e) => setSettings({ ...settings, soundVolume: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="text-blue-400" size={20} />
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-white/60 text-sm">Show browser notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enablePush}
                    onChange={(e) => setSettings({ ...settings, enablePush: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="text-purple-400" size={20} />
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-white/60 text-sm">Send email alerts (coming soon)</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableEmail}
                    onChange={(e) => setSettings({ ...settings, enableEmail: e.target.checked })}
                    className="sr-only peer"
                    disabled
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/50 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400/50 opacity-50"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Notification Types</h3>
            <div className="space-y-4">
              {Object.entries(settings.notificationTypes).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="text-yellow-400" size={20} />
                    <div>
                      <p className="text-white font-medium capitalize">{type} Notifications</p>
                      <p className="text-white/60 text-sm">
                        {type === 'guestbook' && 'New birthday messages'}
                        {type === 'photos' && 'New photo uploads'}
                        {type === 'quiz' && 'New quiz responses'}
                        {type === 'general' && 'General system notifications'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        notificationTypes: {
                          ...settings.notificationTypes,
                          [type]: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button onClick={saveSettings} className="btn-primary">
            <Settings size={20} />
            Save Settings
          </button>
        </div>
      </div>

      {/* Test Notifications */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Test Notifications</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Test Message
            </label>
            <input
              type="text"
              value={testNotification}
              onChange={(e) => setTestNotification(e.target.value)}
              placeholder="Enter a test notification message"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
            />
          </div>
          
          <button onClick={sendTestNotification} className="btn-primary">
            <Bell size={20} />
            Send Test Notification
          </button>
        </div>
      </div>
    </div>
  );
}