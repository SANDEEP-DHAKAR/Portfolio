/**
 * Stat Counter Animation for Sandeep Dhakar Portfolio
 * Smoothly animates numbers from 0 to their target value when in viewport
 */

document.addEventListener('DOMContentLoaded', () => {
    const counterElements = document.querySelectorAll('.counter-value');
    
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // Animation duration in ms
        const startTime = performance.now();
        
        const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function (easeOutQuad)
            const easeProgress = progress * (2 - progress);
            
            const currentValue = Math.floor(easeProgress * target);
            el.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = target + suffix;
            }
        };
        
        requestAnimationFrame(updateCount);
    };
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                animateCounter(el);
                observer.unobserve(el); // Only animate once
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    counterElements.forEach(el => counterObserver.observe(el));
});
