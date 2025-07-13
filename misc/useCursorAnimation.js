useCursorAnimation.ts
import { useEffect } from 'react';

export function useCursorAnimation() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;

    let isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) {
      cursorDot.style.display = 'none';
      cursorOutline.style.display = 'none';
      return;
    }

    window.addEventListener('mousemove', (e) => {
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      
      cursorOutline.animate(
        {
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
        },
        { duration: 500, fill: 'forwards' }
      );
    });

    // Interactive elements effect
    const interactiveElements = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      '[role="button"]',
    ].join(', ');

    const handleMouseEnter = () => {
      cursorDot.style.transform = 'scale(2)';
      cursorOutline.style.transform = 'scale(1.5)';
    };

    const handleMouseLeave = () => {
      cursorDot.style.transform = 'scale(1)';
      cursorOutline.style.transform = 'scale(1)';
    };

    document.querySelectorAll(interactiveElements).forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.querySelectorAll(interactiveElements).forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);
}