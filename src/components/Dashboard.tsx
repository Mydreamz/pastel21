import React, { useState, useEffect, useCallback } from 'react';
import DashboardStats from './dashboard/DashboardStats';
import DashboardActiveUsers from './dashboard/DashboardActiveUsers';
import UseCaseCarousel from './UseCaseCarousel';

const Dashboard = () => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [movement, setMovement] = useState({
    x: 0,
    y: 0
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);
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
  
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (prefersReducedMotion) return;
    let clientX, clientY;
    if ('touches' in e) {
      clientX = (e as TouchEvent).touches[0].clientX;
      clientY = (e as TouchEvent).touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }
    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;
    setMousePosition({
      x,
      y
    });
  }, [prefersReducedMotion]);
  
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
    window.addEventListener('touchmove', handleMouseMoveRAF, {
      passive: true
    });
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveRAF);
      window.removeEventListener('touchmove', handleMouseMoveRAF);
    };
  }, [handleMouseMove, prefersReducedMotion, isMobile]);
  
  useEffect(() => {
    if (prefersReducedMotion) {
      setMovement({
        x: 0,
        y: 0
      });
      return;
    }
    const baseIntensity = Math.min(window.innerWidth, 1200) / 1200;
    const newX = (mousePosition.x - 0.5) * -15 * baseIntensity;
    const newY = (mousePosition.y - 0.5) * -10 * baseIntensity;
    const animateMovement = () => {
      setMovement(prev => ({
        x: prev.x + (newX - prev.x) * 0.1,
        y: prev.y + (newY - prev.y) * 0.1
      }));
    };
    const animationId = requestAnimationFrame(animateMovement);
    return () => cancelAnimationFrame(animationId);
  }, [mousePosition, prefersReducedMotion]);
  
  const parallaxStyle = {
    transform: `translate3d(${movement.x}px, ${movement.y}px, 0)`,
    transition: prefersReducedMotion ? 'none' : 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)',
    willChange: prefersReducedMotion ? 'auto' : 'transform'
  };
  
  return (
    <div 
      style={parallaxStyle} 
      className="glass-card p-6 rounded-2xl w-full max-w-[560px] mx-auto lg:mx-0 animate-float-slow backdrop-blur-xl border border-pastel-200/60 shadow-neumorphic relative overflow-hidden"
    >
      {/* Decorative elements for visual interest */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pastel-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-pastel-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-black">Dashboard</h3>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#7FB069]"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-pastel-500"></div>
          </div>
        </div>
        
        <UseCaseCarousel />
        <DashboardStats />
        <DashboardActiveUsers />
      </div>
    </div>
  );
};

export default Dashboard;
