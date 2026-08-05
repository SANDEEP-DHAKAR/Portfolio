/**
 * Advanced Animations for Sandeep Dhakar Portfolio
 * Implements GSAP, Canvas Particles, Custom Cursor, Preloader, and Card Tilt
 */

document.addEventListener('DOMContentLoaded', () => {
    // ================= PAGE PRELOADER =================
    const preloader = document.getElementById('preloader');
    const percentEl = document.querySelector('.preloader-percent');
    
    if (preloader) {
        let width = 0;
        const interval = setInterval(() => {
            width += Math.floor(Math.random() * 15) + 5;
            if (width >= 100) {
                width = 100;
                clearInterval(interval);
                
                // Fade out animation
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    document.body.classList.add('loaded');
                    // Trigger GSAP hero animation
                    triggerHeroAnimations();
                }, 400);
            }
            if (percentEl) {
                percentEl.textContent = width + '%';
            }
        }, 80);
    } else {
        document.body.classList.add('loaded');
        triggerHeroAnimations();
    }

    // ================= CUSTOM CURSOR =================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline && window.innerWidth > 768) {
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });
        
        // Smooth cursor outline following (lerp)
        const animateOutline = () => {
            const ease = 0.15; // Speed of outline following
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;
            
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;
            requestAnimationFrame(animateOutline);
        };
        requestAnimationFrame(animateOutline);
        
        // Hover effects on interactive items
        const hoverables = document.querySelectorAll('a, button, .project-card, .skill-card, .service-card, .filter-btn, .theme-toggle');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hover');
                cursorDot.classList.add('cursor-hover-dot');
            });
            item.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hover');
                cursorDot.classList.remove('cursor-hover-dot');
            });
        });
    }

    // ================= CANVAS PARTICLES BACKGROUND =================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 120 };
        
        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        };
        
        window.addEventListener('resize', resizeCanvas);
        
        // Track mouse inside hero
        
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            
            update() {
                // Check borders
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                
                // Mouse interactive effect (gentle push)
                
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }
        
        function getThemeColors() {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            return {
                particle: isLight ? 'rgba(37, 99, 235, 0.15)' : 'rgba(59, 130, 246, 0.2)',
                line: isLight ? 'rgba(37, 99, 235, 0.05)' : 'rgba(59, 130, 246, 0.08)'
            };
        }
        
        let colors = getThemeColors();
        document.addEventListener('themeChanged', () => {
            colors = getThemeColors();
            particles.forEach(p => p.color = colors.particle);
        });
        
        function initParticles() {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = Math.random() * (canvas.width - size * 2);
                let y = Math.random() * (canvas.height - size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                particles.push(new Particle(x, y, directionX, directionY, size, colors.particle));
            }
        }
        
        function connect() {
            let opacityValue = 1;
            const maxDistance = 100;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        opacityValue = 1 - (distance / maxDistance);
                        ctx.strokeStyle = colors.line.replace('0.08', (opacityValue * 0.08).toString()).replace('0.05', (opacityValue * 0.05).toString());
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
            requestAnimationFrame(animate);
        }
        
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        initParticles();
        animate();
    }

    // ================= HERO TYPING EFFECT =================
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".typing-cursor");
    
    if (typedTextSpan) {
        const textArray = ["Software Developer", "MERN Developer", "Backend Engineer", "Problem Solver"];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000;
        let textArrayIndex = 0;
        let charIndex = 0;
        
        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }
        
        function erase() {
            if (charIndex > 0) {
                if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                textArrayIndex++;
                if(textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 1100);
            }
        }
        
        setTimeout(type, newTextDelay + 250);
    }

    // ================= GSAP HERO ANIMATIONS =================
    function triggerHeroAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            const tl = gsap.timeline();
            
            // Hero animations
            tl.fromTo('.hero-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
              .fromTo('.hero-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4')
              .fromTo('.hero-description', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
              .fromTo('.hero-buttons', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
              .fromTo('.hero-socials', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3')
              .fromTo('.hero-image-wrapper', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
              .fromTo('.scroll-indicator-wrapper', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');
              
            // Scroll trigger reveals for sections
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const header = section.querySelector('.section-title');
                if (header) {
                    gsap.fromTo(header, 
                        { y: 50, opacity: 0 }, 
                        { 
                            y: 0, 
                            opacity: 1, 
                            duration: 0.6, 
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 80%',
                                toggleActions: 'play none none none'
                            }
                        }
                    );
                }
            });
            
            // Experience Timeline reveal
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, i) => {
                gsap.fromTo(item, 
                    { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.7,
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 85%'
                        }
                    }
                );
            });
            
            // Skill cards stagger reveal
            gsap.fromTo('.skill-card', 
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: '.skills-grid',
                        start: 'top 85%'
                    }
                }
            );
            
            // Project cards stagger reveal
            gsap.fromTo('.project-card', 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: '.project-grid',
                        start: 'top 85%'
                    }
                }
            );
            
            // Service cards reveal
            gsap.fromTo('.service-card', 
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: '.services-grid',
                        start: 'top 85%'
                    }
                }
            );
        }
    }

    // ================= MOUSE PARALLAX =================
    const parallaxContainer = document.querySelector('.hero');
    const parallaxLayers = document.querySelectorAll('.parallax-bg-element');
    
    if (parallaxContainer && parallaxLayers.length > 0 && window.innerWidth > 768) {
        parallaxContainer.addEventListener('mousemove', (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mouseX = e.clientX - width / 2;
            const mouseY = e.clientY - height / 2;
            
            parallaxLayers.forEach(layer => {
                const speed = parseFloat(layer.getAttribute('data-speed')) || 0.05;
                const x = mouseX * speed;
                const y = mouseY * speed;
                layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
        });
    }

    // ================= BUTTON RIPPLE EFFECT =================
    const buttons = document.querySelectorAll('.btn-ripple, .btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Check if element has class
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ================= TILT CARD EFFECT =================
    const tiltCards = document.querySelectorAll('.project-card, .service-card, .about-card');
    if (window.innerWidth > 768) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within element
                const y = e.clientY - rect.top;  // y position within element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Tilt amount calculation
                const tiltX = (y - centerY) / centerY * -8; // Max tilt 8 deg
                const tiltY = (x - centerX) / centerX * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
                
                // Dynamic reflection effect
                const shadowX = (x - centerX) / centerX * 15;
                const shadowY = (y - centerY) / centerY * 15;
                card.style.boxShadow = `${-shadowY}px ${shadowX}px 30px rgba(59, 130, 246, 0.15), 0 10px 20px rgba(0, 0, 0, 0.3)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                card.style.boxShadow = '';
                card.style.transition = 'all 0.5s ease';
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }
});
