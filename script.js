document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scrolled State
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger icon between bars and times
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 3. Scroll Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Smooth Scrolling for Anchor Links (Browsers that don't support smooth scroll css)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Load CMS Content Dynamically
    fetch('content/data.json')
        .then(response => response.json())
        .then(data => {
            // Update Hero Section
            if (data.heroName) document.getElementById('hero-name').innerHTML = `${data.heroName}<span class="dot">.</span>`;
            if (data.heroTitle) document.getElementById('hero-title').textContent = data.heroTitle;
            if (data.heroDesc) document.getElementById('hero-desc').textContent = data.heroDesc;
            if (data.resumeLink) document.getElementById('hero-resume-link').href = data.resumeLink;
            
            // Update About Section
            if (data.aboutText) document.getElementById('about-text').textContent = data.aboutText;
            
            // Update Experience Timeline
            if (data.experience && Array.isArray(data.experience)) {
                const timeline = document.getElementById('experience-timeline');
                timeline.innerHTML = ''; // Clear default hardcoded content
                
                data.experience.forEach((exp) => {
                    const item = document.createElement('div');
                    item.className = 'timeline-item reveal active';
                    
                    let bulletsHtml = '';
                    if (exp.bullets && Array.isArray(exp.bullets)) {
                        bulletsHtml = exp.bullets.map(b => {
                           let text = typeof b === 'string' ? b : (b.point || ''); 
                           return `<li>${text}</li>`;
                        }).join('');
                    }

                    item.innerHTML = `
                        <div class="timeline-dot"></div>
                        <div class="timeline-content glass-card">
                            <div class="timeline-header">
                                <div>
                                    <h3>${exp.role || ''}</h3>
                                    <h4>${exp.company || ''}</h4>
                                </div>
                                <span class="timeline-date">${exp.duration || ''}</span>
                            </div>
                            <ul class="timeline-details">
                                ${bulletsHtml}
                            </ul>
                        </div>
                    `;
                    timeline.appendChild(item);
                });
            }
        })
        .catch(err => console.log('CMS data not loaded, using fallback HTML content', err));
});
