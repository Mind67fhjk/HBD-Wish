import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase, Celebration } from './lib/supabase';
import PublicApp from './components/PublicApp';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import FloatingParticles from './components/FloatingParticles';

function App() {
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Set ElaJa's birthday date - Update this to your actual birthday!
  const ELAJA_BIRTHDAY = '2025-12-25T00:00:00'; // Change this to your birthday date

  useEffect(() => {
    fetchCelebration();
    checkAdminStatus();
  }, []);

  const fetchCelebration = async () => {
    try {
      // Get celebration ID from URL params or use default
      const urlParams = new URLSearchParams(window.location.search);
      const celebrationId = urlParams.get('celebration');
      
      let query = supabase
        .from('celebrations')
        .select('*')
        .eq('is_public', true);
        
      if (celebrationId) {
        query = query.eq('id', celebrationId);
      }
      
      const { data, error } = await query.single();

      if (error) {
        // If no specific celebration found, get the first public one
        const { data: defaultData, error: defaultError } = await supabase
          .from('celebrations')
          .select('*')
          .eq('is_public', true)
          .limit(1)
          .single();
          
        if (defaultError) throw defaultError;
        setCelebration(defaultData);
      } else {
        setCelebration(data);
      }
    } catch (error) {
      console.error('Error fetching celebration:', error);
      // Create a fallback celebration with ElaJa's birthday
      setCelebration({
        id: 'elaja-birthday',
        title: 'Happy Birthday',
        description: 'Join us in celebrating this special day with joy, laughter, and wonderful memories!',
        target_date: ELAJA_BIRTHDAY,
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = () => {
    const adminToken = localStorage.getItem('elaja_admin_token');
    // Only allow access if the token matches ElaJa's exclusive token
    setIsAdmin(adminToken === 'elaja_authenticated');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading celebration...</div>
      </div>
    );
  }

  if (!celebration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Celebration not found</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen relative z-10">
        <FloatingParticles />
        
        <Routes>
          <Route 
            path="/" 
            element={<PublicApp celebration={celebration} />} 
          />
          <Route 
            path="/admin/login" 
            element={
              isAdmin ? 
                <Navigate to="/admin" replace /> : 
                <AdminLogin onLogin={() => setIsAdmin(true)} />
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              isAdmin ? 
                <AdminDashboard celebration={celebration} onRefresh={fetchCelebration} /> : 
                <Navigate to="/admin/login" replace />
            } 
          />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;