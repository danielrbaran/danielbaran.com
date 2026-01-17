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
    const scrollThreshold = 250; // Pixels to scroll before full shrink (reduced for faster completion)
    const maxScroll = scrollThreshold;
    const stickyThreshold = 0.85; // Start making sticky at 85% progress
    
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
        
        // Make header sticky earlier so it doesn't scroll away
        if (scrollProgress >= stickyThreshold) {
            heroHeader.style.position = 'sticky';
            heroHeader.style.top = '0';
            heroHeader.style.zIndex = '100';
        } else {
            heroHeader.style.position = 'relative';
        }
        
        // Calculate text position and size
        // Move horizontally left only, stay vertically centered
        // Calculate left movement: from center to left edge (accounting for padding)
        const maxLeftMovement = 300; // Adjust based on container width and padding
        const translateX = scrollProgress * -maxLeftMovement; // Move left only
        
        // Minimal vertical adjustment to account for header shrinking and text scaling
        // The flexbox handles most centering, but we need slight adjustment for scale
        const scale = 1 - (scrollProgress * 0.35); // Shrink text slightly
        const verticalAdjustment = scrollProgress * -20; // Small upward adjustment for scale
        
        heroContent.style.transform = `translate(${translateX}px, ${verticalAdjustment}px) scale(${scale})`;
        heroContent.style.textAlign = scrollProgress > 0.5 ? 'left' : 'center';
        
        // Adjust padding as it shrinks - maintain left padding for alignment
        const verticalPadding = Math.max(2 - (scrollProgress * 1.5), 0.5);
        const horizontalPadding = scrollProgress > 0.5 ? '1.5rem' : '2rem'; // Consistent left padding when left-aligned
        heroContent.style.padding = `${verticalPadding}rem ${horizontalPadding}`;
        
        // Adjust font sizes for final state (start earlier)
        if (scrollProgress >= stickyThreshold) {
            const h1 = heroContent.querySelector('h1');
            const subtitle = heroContent.querySelector('.subtitle');
            if (h1) h1.style.fontSize = '1.5rem';
            if (subtitle) subtitle.style.fontSize = '0.9rem';
        } else {
            const h1 = heroContent.querySelector('h1');
            const subtitle = heroContent.querySelector('.subtitle');
            if (h1) h1.style.fontSize = '';
            if (subtitle) subtitle.style.fontSize = '';
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
