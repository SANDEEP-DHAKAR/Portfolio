/**
 * Main Controller for Sandeep Dhakar Portfolio
 * Coordinates Navigation, Mobile Menu, Project Filters, Modals, Lightbox, and Sliders
 */

document.addEventListener('DOMContentLoaded', () => {
    // ================= DYNAMIC DATA =================
    const projectDetailsData = {
        'eduinnotech': {
            title: 'Eduinnotech Official Website',
            category: 'MERN Stack & Frontend',
            description: 'Developed the official corporate website for Eduinnotech IT Company. It represents their digital presence, services, tech stack, career opportunities, and portfolio. Designed with a luxury dark theme, subtle animations, and highly performant structure.',
            features: [
                'Fully responsive design supporting all screen dimensions.',
                'Configured interactive client contact form using EmailJS integration.',
                'Interactive careers page with job description expansions and document uploads.',
                'SEO optimized markup resulting in high visibility ranking.'
            ],
            tech: ['React.js', 'Node.js', 'ExpressJS', 'EmailJS', 'CSS3', 'Git'],
            live: 'https://eduinnotech.com/',
            github: 'https://github.com/SANDEEP-DHAKAR'
        },
        'stjp': {
            title: 'STJP School Website',
            category: 'Frontend & Backend',
            description: 'A comprehensive institutional website built for STJP School. Features a clean, accessible layout for parents, students, and administrators to view announcements, syllabus, galleries, and events.',
            features: [
                'Responsive events calendar tracking holidays and examinations.',
                'Dynamic online admission enquiry forms sending direct notifications to admins.',
                'Integrated media gallery with categorization filters.',
                'Optimized asset loading reducing paint delays on standard mobile devices.'
            ],
            tech: ['React.js', 'Node.js', 'Express.js', 'Custom CSS', 'REST API'],
            live: 'https://stjpschool.in/',
            github: 'https://github.com/SANDEEP-DHAKAR'
        },
        'pureveda': {
            title: 'Dhakad Pureveda',
            category: 'Frontend',
            description: 'An online business showcase and catalog application for Dhakad Pureveda. Allows customers to browse natural herbal products and submit purchase enquiries directly to the seller via WhatsApp API.',
            features: [
                'Dynamic product grid categorization with responsive animations.',
                'One-click WhatsApp quick enquiry sending product SKU and title details.',
                'Extreme performance optimizations returning 100 Lighthouse score.',
                'Luxurious nature-inspired modern styling without heavy framework overhead.'
            ],
            tech: ['HTML5', 'CSS3', 'JavaScript', 'WhatsApp API', 'SEO Tags'],
            live: 'https://dhakadpureveda.in/',
            github: 'https://github.com/SANDEEP-DHAKAR'
        },
        'luminark': {
            title: 'Luminark',
            category: 'Frontend',
            description: 'A premium product landing showcase for specialized lifestyle products, created as a sub-brand of Dhakad Pureveda. Uses high-end typography and layouts to drive user conversions.',
            features: [
                'High-contrast visual hierarchy targeting premium buyers.',
                'Fluid grid interfaces with glassmorphic cards.',
                'Dynamic FAQ Accordion and interactive support widgets.',
                'Ultra lightweight footprint for high-speed delivery.'
            ],
            tech: ['HTML5', 'CSS3', 'Vanilla JS', 'Mobile Responsiveness'],
            live: 'https://luminark.dhakadpureveda.in/',
            github: 'https://github.com/SANDEEP-DHAKAR'
        },
        'food': {
            title: 'MERN Food Delivery System',
            category: 'MERN Full Stack',
            description: 'A robust full-stack food delivery application including a user ordering client and an executive admin dashboard. Integrated Razorpay payment systems for secure transaction flows.',
            features: [
                'Complete shopping cart workflow with custom orders checkout.',
                'Secure JWT based authentication with password hashing encryption.',
                'Admin dashboard managing menu cards, food items, orders progress, and revenues.',
                'Razorpay payment gateway API integration.'
            ],
            tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay', 'JWT'],
            live: 'https://food-delivery-frontend-ljap.onrender.com/',
            github: 'https://github.com/SANDEEP-DHAKAR'
        },
        'weather': {
            title: 'Weather App',
            category: 'Frontend',
            description: 'A lightweight and responsive weather forecasting application that pulls real-time data from the OpenWeatherMap API. Provides immediate weather insights for cities globally.',
            features: [
                'Real-time queries returning wind speeds, humidity, and cloud states.',
                'Dynamic card styling adapting to weather conditions (sunny, rainy, snowy).',
                'Local Storage integrations caching the user\'s last query history.',
                'Interactive elements built using clean Vanilla JS.'
            ],
            tech: ['JavaScript', 'OpenWeather API', 'CSS3 Variables', 'HTML5 Semantic'],
            live: 'https://sandeep-dhakar.github.io/Weather-App/',
            github: 'https://github.com/SANDEEP-DHAKAR'
        }
    };

    // ================= SCROLL PROGRESS BAR =================
    const progressBar = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

    // ================= STICKY NAVBAR =================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // ================= ACTIVE NAV LINKS ON SCROLL =================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // offset for sticky nav
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ================= MOBILE NAVIGATION MENU =================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ================= PROJECTS GRID FILTERING =================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    // Retrigger animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ================= PROJECT MODAL DETAILS =================
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const viewDetailBtns = document.querySelectorAll('.view-details-btn');
    
    if (modal && modalClose) {
        viewDetailBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = btn.getAttribute('data-project');
                const data = projectDetailsData[projectId];
                
                if (data) {
                    // Populate modal contents
                    document.getElementById('modal-title').textContent = data.title;
                    document.getElementById('modal-category').textContent = data.category;
                    document.getElementById('modal-desc').textContent = data.description;
                    document.getElementById('modal-live').href = data.live;
                    document.getElementById('modal-github').href = data.github;
                    
                    // Features list
                    const featuresList = document.getElementById('modal-features');
                    featuresList.innerHTML = '';
                    data.features.forEach(feat => {
                        const li = document.createElement('li');
                        li.innerHTML = `<i class="fas fa-check-circle text-accent"></i> <span>${feat}</span>`;
                        featuresList.appendChild(li);
                    });
                    
                    // Tech chips
                    const techGrid = document.getElementById('modal-tech');
                    techGrid.innerHTML = '';
                    data.tech.forEach(t => {
                        const span = document.createElement('span');
                        span.className = 'tech-chip';
                        span.textContent = t;
                        techGrid.appendChild(span);
                    });
                    
                    // Display modal
                    modal.classList.add('active');
                    document.body.classList.add('no-scroll');
                }
            });
        });
        
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        };
        
        modalClose.addEventListener('click', closeModal);
        
        // Close modal when clicking outside contents
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ================= TESTIMONIAL SLIDER =================
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        if (slides.length === 0) return;
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    function startSlideShow() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }
    
    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }
    
    if (slides.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetSlideShow();
            });
        });
        
        startSlideShow();
    }

    // ================= LIGHTBOX GALLERY FOR CERTIFICATES =================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const certificateItems = document.querySelectorAll('.certificate-card img');
    
    if (lightbox && lightboxImg && lightboxClose) {
        certificateItems.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.classList.add('no-scroll');
            });
        });
        
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        };
        
        lightboxClose.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // ================= BACK TO TOP BUTTON =================
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
