// Shrinking header scroll effect
// Respects prefers-reduced-motion for accessibility

(function() {
    'use strict';
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        return; // Exit if user prefers reduced motion
    }
    
    const heroHeader = document.querySelector('.hero-header');
    const heroContent = document.querySelector('.hero-content');
    
    if (!heroHeader || !heroContent) {
        return; // Exit if elements don't exist
    }
    
    const initialHeight = 400; // Starting height
    const finalHeight = 100; // Final header height
    const scrollThreshold = 300; // Pixels to scroll before full shrink
    const maxScroll = scrollThreshold;
    
    // Throttle function for performance
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollProgress = Math.min(scrollY / maxScroll, 1); // 0 to 1
        
        // Calculate new height (clamp to finalHeight minimum)
        const newHeight = Math.max(
            initialHeight - (scrollProgress * (initialHeight - finalHeight)),
            finalHeight
        );
        heroHeader.style.height = newHeight + 'px';
        
        // Make header sticky once fully shrunk
        if (scrollProgress >= 1) {
            heroHeader.style.position = 'sticky';
            heroHeader.style.top = '0';
            heroHeader.style.zIndex = '100';
        } else {
            heroHeader.style.position = 'relative';
        }
        
        // Calculate text position and size
        // Move from center to top-left, but keep it within bounds
        const translateX = scrollProgress * -150; // Move left (reduced from -200)
        const translateY = scrollProgress * -100; // Move up (reduced from -150)
        const scale = 1 - (scrollProgress * 0.3); // Shrink text slightly (reduced from 0.4)
        
        heroContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        heroContent.style.textAlign = scrollProgress > 0.5 ? 'left' : 'center';
        
        // Adjust padding as it shrinks
        const padding = Math.max(2 - (scrollProgress * 1.5), 0.5);
        heroContent.style.padding = padding + 'rem';
        
        // Adjust font sizes for final state
        if (scrollProgress >= 1) {
            heroContent.querySelector('h1').style.fontSize = '1.5rem';
            heroContent.querySelector('.subtitle').style.fontSize = '0.9rem';
        } else {
            heroContent.querySelector('h1').style.fontSize = '';
            heroContent.querySelector('.subtitle').style.fontSize = '';
        }
        
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    // Add smooth transition
    heroHeader.style.transition = 'height 0.1s ease-out';
    heroContent.style.transition = 'transform 0.1s ease-out, text-align 0.2s ease-out, padding 0.1s ease-out';
    
    // Listen for scroll events
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial call
    updateHeader();
})();
