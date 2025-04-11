
import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', earnings: 3400, messages: 2400 },
  { name: 'Feb', earnings: 4200, messages: 3800 },
  { name: 'Mar', earnings: 5000, messages: 4300 },
  { name: 'Apr', earnings: 6700, messages: 5100 },
  { name: 'May', earnings: 7500, messages: 5900 },
  { name: 'Jun', earnings: 9000, messages: 6800 },
  { name: 'Jul', earnings: 12582, messages: 8429 },
];

const Dashboard = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [movement, setMovement] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for reduced motion preference and device type
  useEffect(() => {
    // Check if user prefers reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    
    // Listen for changes in motion preference
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);
    
    // Check for mobile/touch devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Debounced mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    // Skip if user prefers reduced motion
    if (prefersReducedMotion) return;
    
    let clientX, clientY;
    
    // Handle both mouse and touch events
    if ('touches' in e) {
      clientX = (e as TouchEvent).touches[0].clientX;
      clientY = (e as TouchEvent).touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }
    
    // Calculate mouse position as percentage of window width/height
    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;
    
    setMousePosition({ x, y });
  }, [prefersReducedMotion]);
  
  // Throttled handle mouse move with requestAnimationFrame
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    
    let ticking = false;
    const handleMouseMoveRAF = (e: MouseEvent | TouchEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleMouseMove(e);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMoveRAF);
    window.addEventListener('touchmove', handleMouseMoveRAF, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveRAF);
      window.removeEventListener('touchmove', handleMouseMoveRAF);
    };
  }, [handleMouseMove, prefersReducedMotion, isMobile]);
  
  // Effect to calculate smooth movement - optimized with adjustable intensity based on screen size
  useEffect(() => {
    if (prefersReducedMotion) {
      // Reset movement if reduced motion is preferred
      setMovement({ x: 0, y: 0 });
      return;
    }
    
    // Calculate intensity based on screen size
    const baseIntensity = Math.min(window.innerWidth, 1200) / 1200;
    
    // Calculate movement values - adjust intensity based on screen size
    const newX = (mousePosition.x - 0.5) * -15 * baseIntensity;
    const newY = (mousePosition.y - 0.5) * -10 * baseIntensity;
    
    // Use spring physics for smoother movement
    const animateMovement = () => {
      setMovement(prev => ({
        x: prev.x + (newX - prev.x) * 0.1, // Spring effect with damping
        y: prev.y + (newY - prev.y) * 0.1,
      }));
    };
    
    const animationId = requestAnimationFrame(animateMovement);
    return () => cancelAnimationFrame(animationId);
  }, [mousePosition, prefersReducedMotion]);
  
  // Apply transform style with movement and hardware acceleration
  const parallaxStyle = {
    transform: `translate3d(${movement.x}px, ${movement.y}px, 0)`,
    transition: prefersReducedMotion ? 'none' : 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)',
    willChange: prefersReducedMotion ? 'auto' : 'transform',
  };
  
  return (
    <div 
      className="glass-card p-6 rounded-2xl w-full max-w-[560px] mx-auto lg:mx-0 animate-float-slow"
      style={parallaxStyle}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Dashboard</h3>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-white">$12,582</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <p className="text-xs text-emerald-500">+24% from last month</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Messages</p>
              <p className="text-2xl font-bold text-white">8,429</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <p className="text-xs text-emerald-500">+18% from last month</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-4 rounded-xl mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-300">Growth Overview</h4>
          <p className="text-xs text-emerald-500 font-medium">+32% this quarter</p>
        </div>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={5}
              />
              <YAxis 
                hide={true}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 17, 17, 0.8)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                }}
                itemStyle={{ color: '#e5e7eb' }}
                labelStyle={{ color: '#e5e7eb', fontWeight: 'bold', marginBottom: '4px' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Earnings']}
              />
              <Area 
                type="monotone" 
                dataKey="earnings" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEarnings)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Active Users</p>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </div>
          </div>
          <p className="text-lg font-bold text-white">3,892</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
