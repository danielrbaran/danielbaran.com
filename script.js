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
    const scrollThreshold = 250; // Pixels to scroll before full shrink
    const maxScroll = scrollThreshold;
    const stickyThreshold = 0.1; // Make sticky almost immediately so it never scrolls away
    
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
        // The flexbox with align-items: center handles vertical centering automatically
        const maxLeftMovement = 300; // Distance to move left (from center to left edge)
        const translateX = scrollProgress * -maxLeftMovement; // Move left only
        
        // No vertical translation needed - flexbox handles centering
        // Scale text down to fit smaller header
        const scale = 1 - (scrollProgress * 0.35); // Shrink text slightly
        
        heroContent.style.transform = `translateX(${translateX}px) scale(${scale})`;
        const textAlign = scrollProgress > 0.5 ? 'left' : 'center';
        heroContent.style.textAlign = textAlign;
        
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
        
        // Update debug overlay
        updateDebugOverlay(scrollY, scrollProgress, newHeight, heroHeader.style.position, translateX, 0, scale, textAlign);
        
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
    
    // Debug overlay update function
    function updateDebugOverlay(scrollY, progress, heroHeight, heroPosition, translateX, translateY, scale, textAlign) {
        const overlay = document.getElementById('debug-overlay');
        if (!overlay) return;
        
        const contentRect = heroContent.getBoundingClientRect();
        
        document.getElementById('debug-scroll').textContent = Math.round(scrollY);
        document.getElementById('debug-progress').textContent = Math.round(progress * 100);
        document.getElementById('debug-hero-height').textContent = Math.round(heroHeight);
        document.getElementById('debug-hero-position').textContent = heroPosition || 'relative';
        document.getElementById('debug-content-x').textContent = Math.round(contentRect.left);
        document.getElementById('debug-content-y').textContent = Math.round(contentRect.top);
        document.getElementById('debug-translate-x').textContent = Math.round(translateX);
        document.getElementById('debug-translate-y').textContent = Math.round(translateY);
        document.getElementById('debug-scale').textContent = scale.toFixed(2);
        document.getElementById('debug-align').textContent = textAlign;
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial call
    updateHeader();
})();
