import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Pages.css";
import { motion } from "framer-motion";
import logo from "../assets/Vidya1.png";

// Custom premium illustrations
const EducateIllustration = () => (
  <svg viewBox="0 0 240 240" className="mission-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-edu" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
      </linearGradient>
      <linearGradient id="grad-edu-icon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <filter id="glow-edu" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#grad-edu)" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 6" className="floating-blob-slow" />
    <circle cx="120" cy="120" r="70" fill="rgba(255, 255, 255, 0.4)" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />
    <g filter="url(#glow-edu)">
      <path d="M70 145 C 90 135, 110 135, 120 142 C 130 135, 150 135, 170 145 V 95 C 150 85, 130 85, 120 92 C 110 85, 90 85, 70 95 Z" fill="url(#grad-edu-icon)" opacity="0.9" />
      <path d="M120 92 V 142" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <path d="M120 92 C 120 62, 140 52, 155 42" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
      <path d="M120 72 C 120 52, 95 48, 85 38" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
      <path d="M155 42 C 160 48, 150 52, 145 48 Z" fill="#10b981" />
      <path d="M85 38 C 80 44, 90 48, 95 44 Z" fill="#10b981" />
      <path d="M120 55 C 123 50, 132 50, 130 58 Z" fill="#34d399" />
    </g>
  </svg>
);

const HealIllustration = () => (
  <svg viewBox="0 0 240 240" className="mission-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-heal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.02" />
      </linearGradient>
      <linearGradient id="grad-heal-icon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
      <filter id="glow-heal" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#grad-heal)" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 6" className="floating-blob" />
    <circle cx="120" cy="120" r="70" fill="rgba(255, 255, 255, 0.4)" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1" />
    <g filter="url(#glow-heal)">
      <path d="M120 155 C 115 150, 75 110, 75 88 C 75 70, 88 58, 104 58 C 113 58, 117 62, 120 66 C 123 62, 127 58, 136 58 C 152 58, 165 70, 165 88 C 165 110, 125 150, 120 155 Z" fill="url(#grad-heal-icon)" opacity="0.9" />
      <path d="M90 92 H 105 L 112 72 L 122 112 L 129 82 L 134 92 H 150" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

const EmpowerIllustration = () => (
  <svg viewBox="0 0 240 240" className="mission-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-emp" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.02" />
      </linearGradient>
      <linearGradient id="grad-emp-icon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#312e81" />
      </linearGradient>
      <filter id="glow-emp" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="120" cy="120" r="90" fill="url(#grad-emp)" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="6 6" className="floating-blob-fast" />
    <circle cx="120" cy="120" r="70" fill="rgba(255, 255, 255, 0.4)" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" />
    <g filter="url(#glow-emp)">
      <path d="M75 145 H 165 C 160 115, 140 100, 120 100 C 100 100, 80 115, 75 145 Z" fill="url(#grad-emp-icon)" opacity="0.9" />
      <circle cx="120" cy="80" r="10" fill="#ffffff" />
      <path d="M110 98 C 110 88, 130 88, 130 98 V 115 H 110 Z" fill="#ffffff" />
      <circle cx="95" cy="92" r="8" fill="#818cf8" />
      <path d="M87 108 C 87 100, 103 100, 103 108 V 125 H 87 Z" fill="#818cf8" />
      <circle cx="145" cy="92" r="8" fill="#818cf8" />
      <path d="M137 108 C 137 100, 153 100, 153 108 V 125 H 137 Z" fill="#818cf8" />
      <polygon points="120,38 123,46 132,46 125,51 127,59 120,54 113,59 115,51 108,46 117,46" fill="#fbbf24" />
    </g>
  </svg>
);

// Animated Counter component
function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      setCount(value);
      return;
    }
    const endValue = parseInt(match[1], 10);
    
    let startTimestamp = null;
    let animFrame = null;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };
    
    animFrame = requestAnimationFrame(step);
    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [value, duration]);
  
  const suffix = value.replace(/^\d+/, '');
  return <span>{count}{suffix}</span>;
}

export default function OurMission() {
  const [hoveredPillar, setHoveredPillar] = React.useState(null);

  const hoverProps = (pillar) => ({
    onMouseEnter: () => setHoveredPillar(pillar),
    onMouseLeave: () => setHoveredPillar(null),
  });

  return (
    <div className="page-wrapper mission-wrapper">
      {/* Premium Clean White Navbar */}
      <Navbar />

      {/* Premium Gradient Hero Section */}
      <section className="mission-hero">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-inner">
          <span className="gradient-tag">Our Mission</span>
          <h1 className="mission-hero-heading">
            Transforming Lives Through Education, Healthcare & Empowerment
          </h1>
          <p className="mission-hero-subtitle">
            Empowering communities through education, healthcare, and opportunity.
          </p>
          
          {/* Step Tags indicator: EDUCATE -> HEAL -> EMPOWER */}
          <div className="mission-hero-steps">
            <span className="step-tag">EDUCATE</span>
            <span className="step-arrow">→</span>
            <span className="step-tag">HEAL</span>
            <span className="step-arrow">→</span>
            <span className="step-tag">EMPOWER</span>
          </div>
        </div>
      </section>

      {/* Connected Mission Section */}
      <section className="mission-connected-section">
        {/* Ambient background particle glows & subtle decorative wave grids */}
        <div className="mission-bg-waves" />
        <div className="mission-particle p1" />
        <div className="mission-particle p2" />
        <div className="mission-particle p3" />

        <div className="mission-grid-container">
          {/* Visuals row with a single unified SVG */}
          <div className="mission-svg-row">
            <svg viewBox="0 0 1000 420" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Glow Filters */}
                <filter id="glow-green" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="14" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="14" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="14" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-hub" x="-35%" y="-35%" width="170%" height="170%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-star" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Hexagon Gradients */}
                <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>

                {/* Icon Gradients */}
                <linearGradient id="icon-grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="icon-grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="icon-grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#5b21b6" />
                </linearGradient>

                {/* Line Gradients */}
                <linearGradient id="line-grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="line-grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id="line-grad-purple" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>

                <linearGradient id="hub-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {/* Connecting Wave Dotted Line: Green Side */}
              <path 
                d="M 256 110 C 290 160, 390 160, 440 110" 
                stroke="url(#line-grad-green)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeDasharray="2 10" 
                className="mission-connecting-line"
              />

              {/* Connecting Wave Dotted Line: Blue Side */}
              <path 
                d="M 560 110 C 610 160, 710 160, 744 110" 
                stroke="url(#line-grad-blue)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeDasharray="2 10" 
                className="mission-connecting-line"
              />

              {/* Connecting Vertical Dotted Line: Purple Bottom Side */}
              <path 
                d="M 500 168 L 500 232" 
                stroke="url(#line-grad-purple)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeDasharray="2 10" 
                className="mission-connecting-line"
              />

              {/* Animated Glowing Node: Green Side (Fixed) */}
              <circle cx="348" cy="135" r="6" fill="#10b981" className="glowing-node-green" />

              {/* Animated Glowing Node: Blue Side (Fixed) */}
              <circle cx="652" cy="135" r="6" fill="#3b82f6" className="glowing-node-blue" />

              {/* Animated Glowing Node: Purple Side (Fixed) */}
              <circle cx="500" cy="200" r="6" fill="#a855f7" className="glowing-node-purple" />

              {/* Connection Static End Points */}
              <circle cx="256" cy="110" r="7" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" className="connector-node green-node" />
              <circle cx="440" cy="110" r="4.5" fill="#10b981" className="connector-node-center green-center" />

              <circle cx="560" cy="110" r="4.5" fill="#3b82f6" className="connector-node-center blue-center" />
              <circle cx="744" cy="110" r="7" fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" className="connector-node blue-node" />

              <circle cx="500" cy="168" r="4.5" fill="#a855f7" className="connector-node-center purple-center" />
              <circle cx="500" cy="232" r="7" fill="#ffffff" stroke="#a855f7" strokeWidth="2.5" className="connector-node purple-node" />

              {/* Left Hexagon Card Group (Education) */}
              <g id="svg-edu-group" className={`hex-group green${hoveredPillar === 'educate' ? ' is-hovered' : ''}`} {...hoverProps('educate')}>
                {/* Soft glow circle behind */}
                <circle cx="166" cy="110" r="68" fill="rgba(16, 185, 129, 0.12)" filter="url(#glow-green)" className="inner-circle-glow" />

                {/* Outer Hexagon outline with double-layer outline effect */}
                <polygon 
                  points="76,110 121,32 211,32 256,110 211,188 121,188" 
                  fill="none" 
                  stroke="url(#grad-green)" 
                  strokeWidth="2.5" 
                  className="hex-polygon-outer"
                />
                {/* Inner Hexagon outline */}
                <polygon 
                  points="86,110 126,41 206,41 246,110 206,179 126,179" 
                  fill="none" 
                  stroke="rgba(16, 185, 129, 0.25)" 
                  strokeWidth="1.5" 
                  className="hex-polygon-inner"
                />

                {/* Floating dots around outer border */}
                <circle cx="121" cy="32" r="3" fill="#10b981" className="floating-dot" />
                <circle cx="211" cy="32" r="3" fill="#10b981" className="floating-dot" />
                <circle cx="211" cy="188" r="3" fill="#10b981" className="floating-dot" />
                <circle cx="121" cy="188" r="3" fill="#10b981" className="floating-dot" />

                {/* Circular soft-glow inner circle */}
                <circle cx="166" cy="110" r="48" fill="#ffffff" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1.5" className="hex-inner-circle" />

                {/* Icon Container: Green Book Icon */}
                <g transform="translate(166, 110)">
                  <g className="hex-icon-g" transform="translate(-24, -24)">
                    {/* Left book half */}
                    <path d="M 6 10 C 12 8, 21 8, 24 11 V 37 C 21 34, 12 34, 6 36 V 10 Z" fill="url(#icon-grad-green)" />
                    {/* Right book half */}
                    <path d="M 42 10 C 36 8, 27 8, 24 11 V 37 C 27 34, 36 34, 42 36 V 10 Z" fill="url(#icon-grad-green)" opacity="0.95" />
                    {/* Pages lines */}
                    <path d="M 24 11 V 37" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
                    {/* Floating sparkly dots */}
                    <circle cx="8" cy="18" r="1.5" fill="#34d399" opacity="0.8" className="floating-particle-1" />
                    <circle cx="40" cy="22" r="1" fill="#34d399" opacity="0.6" className="floating-particle-2" />
                    <circle cx="28" cy="14" r="1.2" fill="#a7f3d0" opacity="0.9" className="floating-particle-3" />
                  </g>
                </g>
              </g>

              {/* Center Circular Connector Hub */}
              <g id="svg-center-hub" className="center-hub-group">
                {/* Concentric glowing rings */}
                <circle cx="500" cy="110" r="72" fill="none" stroke="rgba(15, 118, 110, 0.08)" strokeWidth="1" strokeDasharray="8 8" className="hub-dash-ring-outer" />
                <circle cx="500" cy="110" r="58" fill="none" stroke="url(#hub-ring-grad)" strokeWidth="1.5" strokeDasharray="4 6" className="hub-dash-ring" />

                {/* Circular Hub */}
                <circle cx="500" cy="110" r="44" fill="#ffffff" stroke="rgba(226, 232, 240, 0.8)" strokeWidth="1.5" filter="url(#glow-hub)" className="hub-inner-circle" />

                {/* Logo Image in the center */}
                <image href={logo} x="473" y="83" width="54" height="54" className="hub-logo-img" />
              </g>

              {/* Right Hexagon Card Group (Healthcare) */}
              <g id="svg-heal-group" className={`hex-group blue${hoveredPillar === 'heal' ? ' is-hovered' : ''}`} {...hoverProps('heal')}>
                {/* Soft glow circle behind */}
                <circle cx="834" cy="110" r="68" fill="rgba(59, 130, 246, 0.12)" filter="url(#glow-blue)" className="inner-circle-glow" />

                {/* Outer Hexagon outline with double-layer outline effect */}
                <polygon 
                  points="744,110 789,32 879,32 924,110 879,188 789,188" 
                  fill="none" 
                  stroke="url(#grad-blue)" 
                  strokeWidth="2.5" 
                  className="hex-polygon-outer"
                />
                {/* Inner Hexagon outline */}
                <polygon 
                  points="754,110 794,41 874,41 914,110 874,179 794,179" 
                  fill="none" 
                  stroke="rgba(59, 130, 246, 0.25)" 
                  strokeWidth="1.5" 
                  className="hex-polygon-inner"
                />

                {/* Floating dots around outer border */}
                <circle cx="789" cy="32" r="3" fill="#3b82f6" className="floating-dot" />
                <circle cx="879" cy="32" r="3" fill="#3b82f6" className="floating-dot" />
                <circle cx="879" cy="188" r="3" fill="#3b82f6" className="floating-dot" />
                <circle cx="789" cy="188" r="3" fill="#3b82f6" className="floating-dot" />

                {/* Circular soft-glow inner circle */}
                <circle cx="834" cy="110" r="48" fill="#ffffff" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1.5" className="hex-inner-circle" />

                {/* Icon Container: Blue Heartbeat Icon */}
                <g transform="translate(834, 110)">
                  <g className="hex-icon-g" transform="translate(-24, -24)">
                    {/* Shiny 3D Heart */}
                    <path d="M 24 40 C 24 40, 6 26, 6 15 C 6 8.5, 11 4, 17 4 C 21 4, 23 6, 24 7.5 C 25 6, 27 4, 31 4 C 37 4, 42 8.5, 42 15 C 42 26, 24 40, 24 40 Z" fill="url(#icon-grad-blue)" />
                    {/* Heartbeat Line */}
                    <path d="M 12 16 H 18 L 21 9 L 25 23 L 28 12 L 30 16 H 36" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Floating particles */}
                    <circle cx="10" cy="12" r="1.2" fill="#60a5fa" opacity="0.8" />
                    <circle cx="38" cy="24" r="1" fill="#93c5fd" opacity="0.6" />
                  </g>
                </g>
              </g>

              {/* Bottom Center Hexagon Card Group (Empower) */}
              <g id="svg-emp-group" className={`hex-group purple${hoveredPillar === 'empower' ? ' is-hovered' : ''}`} {...hoverProps('empower')}>
                {/* Soft glow circle behind */}
                <circle cx="500" cy="310" r="68" fill="rgba(168, 85, 247, 0.12)" filter="url(#glow-purple)" className="inner-circle-glow" />

                {/* Outer Hexagon outline with double-layer outline effect */}
                <polygon 
                  points="410,310 455,232 545,232 590,310 545,388 455,388" 
                  fill="none" 
                  stroke="url(#grad-purple)" 
                  strokeWidth="2.5" 
                  className="hex-polygon-outer"
                />
                {/* Inner Hexagon outline */}
                <polygon 
                  points="420,310 460,241 540,241 580,310 540,379 460,379" 
                  fill="none" 
                  stroke="rgba(168, 85, 247, 0.25)" 
                  strokeWidth="1.5" 
                  className="hex-polygon-inner"
                />

                {/* Floating dots around outer border */}
                <circle cx="455" cy="232" r="3" fill="#a855f7" className="floating-dot" />
                <circle cx="545" cy="232" r="3" fill="#a855f7" className="floating-dot" />
                <circle cx="545" cy="388" r="3" fill="#a855f7" className="floating-dot" />
                <circle cx="455" cy="388" r="3" fill="#a855f7" className="floating-dot" />

                {/* Circular soft-glow inner circle */}
                <circle cx="500" cy="310" r="48" fill="#ffffff" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1.5" className="hex-inner-circle" />

                {/* Icon Container: Purple Team + Gold Star Icon */}
                <g transform="translate(500, 310)">
                  <g className="hex-icon-g" transform="translate(-24, -24)">
                    {/* Glowing Golden Star on top */}
                    <g filter="url(#glow-star)">
                      <polygon points="24,1 27,7 34,7 29,11 31,17 24,13 17,17 19,11 14,7 21,7" fill="#fbbf24" />
                    </g>
                    {/* Group of 3 Figures */}
                    {/* Center front figure */}
                    <circle cx="24" cy="23" r="5" fill="#ffffff" />
                    <path d="M 18 37 C 18 31, 30 31, 30 37 Z" fill="#ffffff" />
                    {/* Left figure */}
                    <circle cx="16" cy="26" r="4" fill="url(#icon-grad-purple)" opacity="0.9" />
                    <path d="M 11 37 C 11 33, 21 33, 21 37 Z" fill="url(#icon-grad-purple)" opacity="0.9" />
                    {/* Right figure */}
                    <circle cx="32" cy="26" r="4" fill="url(#icon-grad-purple)" opacity="0.9" />
                    <path d="M 27 37 C 27 33, 37 33, 37 37 Z" fill="url(#icon-grad-purple)" opacity="0.9" />
                  </g>
                </g>
              </g>
            </svg>
          </div>

          {/* Text/Content Row aligning perfectly with columns */}
          <div className="mission-grid-text">
            {/* Education Card */}
            <div className="mission-text-col left-text" {...hoverProps('educate')}>
              <div className={`mission-card-glass${hoveredPillar === 'educate' ? ' is-hovered' : ''}`}>
                <span className="mission-badge badge-green">01 EDUCATE</span>
                <h3 className="mission-card-title">Empowering Minds, Building Futures</h3>
                <p className="mission-card-desc">
                  Providing quality education and resources to underprivileged children to help them build a foundation for a brighter future.
                </p>
                <div className="mission-card-line line-green" />
              </div>
            </div>

            {/* Bottom-Center: EMPOWER Card */}
            <div className="mission-text-col center-text" {...hoverProps('empower')}>
              <div className={`mission-card-glass empower-card-shift${hoveredPillar === 'empower' ? ' is-hovered' : ''}`}>
                <span className="mission-badge badge-purple">03 EMPOWER</span>
                <h3 className="mission-card-title">Building Livelihoods, Fostering Independence</h3>
                <p className="mission-card-desc">
                  Conducting skill development and vocational training programs to promote independence and inclusive communities.
                </p>
                <div className="mission-card-line line-purple" />
              </div>
            </div>

            {/* Healthcare Card */}
            <div className="mission-text-col right-text" {...hoverProps('heal')}>
              <div className={`mission-card-glass${hoveredPillar === 'heal' ? ' is-hovered' : ''}`}>
                <span className="mission-badge badge-blue">02 HEAL</span>
                <h3 className="mission-card-title">Providing Compassionate Care, Restoring Hope</h3>
                <p className="mission-card-desc">
                  Delivering essential healthcare services, organizing free medical camps, and providing critical treatments to those in need.
                </p>
                <div className="mission-card-line line-blue" />
              </div>
            </div>
          </div>

          {/* Mobile Connected Timeline View */}
          <div className="mission-mobile-view">
            {/* Education Card */}
            <div className="mobile-mission-card green">
              <div className="mobile-hex-wrapper">
                <svg viewBox="0 0 200 200" width="120" height="120" style={{ overflow: "visible" }}>
                  <polygon points="10 100, 55 22, 145 22, 190 100, 145 178, 55 178" fill="none" stroke="#10b981" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="48" fill="rgba(16, 185, 129, 0.03)" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.5" />
                  <g className="mobile-hex-icon-g" transform="translate(76, 76)">
                    <path d="M 6 10 C 12 8, 21 8, 24 11 V 37 C 21 34, 12 34, 6 36 V 10 Z" fill="#10b981" />
                    <path d="M 42 10 C 36 8, 27 8, 24 11 V 37 C 27 34, 36 34, 42 36 V 10 Z" fill="#10b981" opacity="0.9" />
                    <path d="M 24 11 V 37" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                  </g>
                </svg>
              </div>
              <span className="mission-badge badge-green">01 EDUCATE</span>
              <h3 className="mission-card-title">Empowering Minds, Building Futures</h3>
              <p className="mobile-card-desc">
                Providing quality education and resources to underprivileged children to help them build a foundation for a brighter future.
              </p>
              <div className="mission-card-line line-green" />
            </div>

            {/* Vertical Connector Line 1 with Center Logo */}
            <div className="mobile-mission-connector">
              <div className="mobile-connector-line green" />
              <div className="mobile-center-hub">
                <img src={logo} alt="VidyaVaidya" className="mobile-hub-logo" />
              </div>
              <div className="mobile-connector-line blue" />
            </div>

            {/* Healthcare Card */}
            <div className="mobile-mission-card blue">
              <div className="mobile-hex-wrapper">
                <svg viewBox="0 0 200 200" width="120" height="120" style={{ overflow: "visible" }}>
                  <polygon points="10 100, 55 22, 145 22, 190 100, 145 178, 55 178" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="48" fill="rgba(59, 130, 246, 0.03)" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1.5" />
                  <g className="mobile-hex-icon-g" transform="translate(76, 76)">
                    <path d="M 24 40 C 24 40, 6 26, 6 15 C 6 8.5, 11 4, 17 4 C 21 4, 23 6, 24 7.5 C 25 6, 27 4, 31 4 C 37 4, 42 8.5, 42 15 C 42 26, 24 40, 24 40 Z" fill="#3b82f6" />
                    <path d="M 12 16 H 18 L 21 9 L 25 23 L 28 12 L 30 16 H 36" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>
              <span className="mission-badge badge-blue">02 HEAL</span>
              <h3 className="mission-card-title">Providing Compassionate Care, Restoring Hope</h3>
              <p className="mobile-card-desc">
                Delivering essential healthcare services, organizing free medical camps, and providing critical treatments to those in need.
              </p>
              <div className="mission-card-line line-blue" />
            </div>

            {/* Vertical Connector Line 2 */}
            <div className="mobile-mission-connector">
              <div className="mobile-connector-line blue" />
              <div className="mobile-center-hub purple-hub">
                <div className="purple-hub-ring" />
              </div>
              <div className="mobile-connector-line purple" />
            </div>

            {/* Empower Card */}
            <div className="mobile-mission-card purple">
              <div className="mobile-hex-wrapper">
                <svg viewBox="0 0 200 200" width="120" height="120" style={{ overflow: "visible" }}>
                  <polygon points="10 100, 55 22, 145 22, 190 100, 145 178, 55 178" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="48" fill="rgba(168, 85, 247, 0.03)" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1.5" />
                  <g className="mobile-hex-icon-g" transform="translate(76, 76)">
                    <polygon points="24,1 27,7 34,7 29,11 31,17 24,13 17,17 19,11 14,7 21,7" fill="#fbbf24" />
                    <circle cx="24" cy="23" r="5" fill="#ffffff" />
                    <path d="M 18 37 C 18 31, 30 31, 30 37 Z" fill="#ffffff" />
                    <circle cx="16" cy="26" r="4" fill="#a855f7" opacity="0.9" />
                    <path d="M 11 37 C 11 33, 21 33, 21 37 Z" fill="#a855f7" opacity="0.9" />
                    <circle cx="32" cy="26" r="4" fill="#a855f7" opacity="0.9" />
                    <path d="M 27 37 C 27 33, 37 33, 37 37 Z" fill="#a855f7" opacity="0.9" />
                  </g>
                </svg>
              </div>
              <span className="mission-badge badge-purple">03 EMPOWER</span>
              <h3 className="mission-card-title">Building Livelihoods, Fostering Independence</h3>
              <p className="mobile-card-desc">
                Conducting skill development and vocational training programs to promote independence and inclusive communities.
              </p>
              <div className="mission-card-line line-purple" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
