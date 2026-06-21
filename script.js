document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // 2. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const scrollBar = document.getElementById('scroll-bar');

    window.addEventListener('scroll', () => {
        // Navbar background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        if (scrollBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollBar.style.width = scrolled + "%";
        }
    });

    // 3. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // 4. Dynamic Greeting & Clock
    const greetingElement = document.getElementById('greeting');
    const timeElement = document.getElementById('nav-time');

    function updateTime() {
        if (timeElement) {
            const now = new Date();
            const day = now.getDate();
            const months = ["January", "February", "March", "April", "May", "June",
                           "July", "August", "September", "October", "November", "December"];
            const month = months[now.getMonth()];
            const year = now.getFullYear();

            let hours = now.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const minutes = String(now.getMinutes()).padStart(2, '0');

            const timeString = `${day} ${month} ${year} | Time: ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
            timeElement.textContent = timeString;
        }
    }
    setInterval(updateTime, 1000);
    updateTime();

    if (greetingElement) {
        const hour = new Date().getHours();
        let greeting = "Hi";
        if (hour < 12) greeting = "Good Morning";
        else if (hour < 18) greeting = "Good Afternoon";
        else greeting = "Good Evening";
        greetingElement.textContent = greeting;
    }

    // 5. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
    }

    // Auto theme based on time: 6 AM to 6 PM is Light, otherwise Dark
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 18;
    const autoTheme = isDayTime ? 'light' : 'dark';

    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || autoTheme;

    applyTheme(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'light') {
                applyTheme('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                applyTheme('light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 6. Calendar Logic
    const monthName = document.getElementById('month-name');
    const calendarDays = document.getElementById('calendar-days');
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');

    if (monthName && calendarDays) {
        let currentDate = new Date();

        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            monthName.textContent = `${monthNames[month]} ${year}`;

            calendarDays.innerHTML = '';

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();

            for (let i = 0; i < firstDay; i++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.classList.add('calendar-day', 'empty');
                calendarDays.appendChild(emptyDiv);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('calendar-day');
                dayDiv.textContent = day;

                if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayDiv.classList.add('today');
                }
                calendarDays.appendChild(dayDiv);
            }
        }

        if (prevBtn) prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        renderCalendar();
    }

    // 6.5 MenuMitra Slide to Enter Logic
    const slideHandle = document.getElementById('slide-handle');
    const slideTrack = slideHandle ? slideHandle.parentElement : null;
    if (slideHandle && slideTrack) {
        let isDragging = false;
        let startX = 0;
        let maxSlide = 0;

        const startDrag = (e) => {
            isDragging = true;
            startX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
            maxSlide = slideTrack.clientWidth - slideHandle.clientWidth - 4; // account for track border/padding
            slideHandle.style.transition = 'none';
        };

        const drag = (e) => {
            if (!isDragging) return;
            const currentX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
            let deltaX = currentX - startX;
            if (deltaX < 0) deltaX = 0;
            if (deltaX > maxSlide) deltaX = maxSlide;

            slideHandle.style.transform = `translateX(${deltaX}px)`;

            // Fade the text out as the handle slides closer to the end
            const opacity = 1 - (deltaX / maxSlide);
            const textSpan = slideTrack.querySelector('.slide-text');
            if (textSpan) textSpan.style.opacity = opacity;
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;

            // Retrieve actual translated X from style
            const transformStyle = slideHandle.style.transform;
            const match = transformStyle.match(/translateX\(([^px]+)px\)/);
            const currentTransform = match ? parseFloat(match[1]) : 0;

            if (currentTransform >= maxSlide - 10) {
                // Slid successfully to the end
                slideHandle.style.transition = 'transform 0.2s ease';
                slideHandle.style.transform = `translateX(${maxSlide}px)`;
                setTimeout(() => {
                    window.open('http://menu-mitra.vercel.app', '_blank');
                    // Reset handle
                    slideHandle.style.transition = 'transform 0.3s ease';
                    slideHandle.style.transform = 'translateX(0)';
                    const textSpan = slideTrack.querySelector('.slide-text');
                    if (textSpan) {
                        textSpan.style.transition = 'opacity 0.3s ease';
                        textSpan.style.opacity = 1;
                    }
                }, 300);
            } else {
                // Snap back to start
                slideHandle.style.transition = 'transform 0.3s ease';
                slideHandle.style.transform = 'translateX(0)';
                const textSpan = slideTrack.querySelector('.slide-text');
                if (textSpan) {
                    textSpan.style.transition = 'opacity 0.3s ease';
                    textSpan.style.opacity = 1;
                }
            }
        };

        slideHandle.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', endDrag);

        slideHandle.addEventListener('touchstart', startDrag);
        window.addEventListener('touchmove', drag, { passive: true });
        window.addEventListener('touchend', endDrag);
    }

    // 6.6 Quiz Zone Switch Logic
    const quizSwitch = document.getElementById('quiz-enter-switch');
    if (quizSwitch) {
        quizSwitch.addEventListener('change', () => {
            if (quizSwitch.checked) {
                // Open KidQuiz in a new tab after toggle animation completes
                setTimeout(() => {
                    window.open('https://jitu-quiz.vercel.app/', '_blank');
                    // Reset the switch back to off
                    setTimeout(() => {
                        quizSwitch.checked = false;
                    }, 500);
                }, 350);
            }
        });
    }

    // 7. Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 8. Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 9. Terminal Typing Animation
    const terminalText = document.getElementById('terminal-text');
    const bioText = `> git init
Initialized empty Git repository in /home/jitu/creative-works/
> git add about_me.txt
> git commit -m "Initial commit: Economics graduate with a passion for computing."
[master (root-commit) a1b2c3d] Economics graduate with a passion for computing.
> git status
On branch master
Your career is up to date with 'origin/learning'.
nothing to commit, working tree clean (ready for the AI era).`;

    let isTyping = false;
    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            terminalText.textContent = text.substring(0, i + 1);
            setTimeout(function() {
                typeWriter(text, i + 1, fnCallback)
            }, 20);
        } else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 700);
        }
    }

    // Start typing when terminal is visible
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTyping) {
                isTyping = true;
                typeWriter(bioText, 0);
            }
        });
    }, { threshold: 0.5 });

    if (terminalText) {
        terminalObserver.observe(document.querySelector('.terminal-container'));
    }

    // 10. Mouse Spotlight Tracking
    const spotlight = document.getElementById('spotlight');
    window.addEventListener('mousemove', (e) => {
        if (spotlight) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            spotlight.style.setProperty('--x', x + '%');
            spotlight.style.setProperty('--y', y + '%');
        }
    });

    // 11. Contact Form Interactivity
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Success animation
            const submitBtn = contactForm.querySelector('.contact-submit');
            submitBtn.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
            submitBtn.style.backgroundColor = '#27c93f';
            submitBtn.style.boxShadow = '0 0 20px rgba(39, 201, 63, 0.4)';
        });
    }

    // 12. Resume Protection Logic
    const resumeOverlay = document.querySelector('.resume-protection-overlay');
    if (resumeOverlay) {
        // Disable right-click on the resume viewer
        resumeOverlay.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Prevent dragging or selecting content if possible via overlay
        resumeOverlay.addEventListener('mousedown', (e) => {
            if (e.detail > 1) e.preventDefault(); // Prevent double click selection
        }, false);
    }

    // 12.5 Load resume iframe src only on desktop to prevent automatic downloads on mobile devices
    const resumeIframe = document.getElementById('resume-iframe');
    function loadResumeIframe() {
        if (resumeIframe && window.innerWidth > 768 && !resumeIframe.getAttribute('src')) {
            const dataSrc = resumeIframe.getAttribute('data-src');
            if (dataSrc) {
                resumeIframe.setAttribute('src', dataSrc);
            }
        }
    }
    loadResumeIframe();
    window.addEventListener('resize', loadResumeIframe);

    // 13. UI/UX Enhancements: Back to Top & Active Link Tracking
    const backToTopBtn = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Show/Hide Back to Top button
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active Link Tracking (ScrollSpy)
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 14. Custom Cursor Tracking & Elastic Easing
    const cursor = document.getElementById('custom-cursor');
    const cursorGlow = document.getElementById('custom-cursor-glow');
    
    // Only initialize if the user is on a device that supports hover
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    if (supportsHover && cursor && cursorGlow) {
        let mouseX = -100;
        let mouseY = -100;
        let cursorX = -100;
        let cursorY = -100;
        let glowX = -100;
        let glowY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Spring/Elastic Easing formulas
            cursorX += (mouseX - cursorX) * 0.28;
            cursorY += (mouseY - cursorY) * 0.28;
            
            glowX += (mouseX - glowX) * 0.12;
            glowY += (mouseY - glowY) * 0.12;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Mouse enters/leaves interactive elements to scale up the cursor
        const hoverSelectors = 'a, button, input, textarea, select, .slide-handle, .toggle-slider, .theme-toggle, .calendar-nav button, .back-to-top';
        
        // Use event delegation on document body to capture dynamically rendered elements too
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverSelectors)) {
                cursor.classList.add('cursor-hover');
                cursorGlow.classList.add('glow-hover');
            }
        });

        document.body.addEventListener('mouseout', (e) => {
            const hoverTarget = e.target.closest(hoverSelectors);
            if (hoverTarget) {
                // Ensure we are actually leaving the element boundary
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || !relatedTarget.closest(hoverSelectors)) {
                    cursor.classList.remove('cursor-hover');
                    cursorGlow.classList.remove('glow-hover');
                }
            }
        });

        // Hide cursor when leaving screen boundaries
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorGlow.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorGlow.style.opacity = '1';
        });
    }

    // 15. 3D Tilt & Light Glare Effect for Cards
    const tiltCards = document.querySelectorAll('.project-card, .menu-mitra-box, .quiz-zone-box');
    if (supportsHover && tiltCards.length > 0) {
        tiltCards.forEach(card => {
            const isProjectCard = card.classList.contains('project-card');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Track mouse position within the card for the light reflection
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Max tilt rotation in degrees
                const maxRotationX = 8;
                const maxRotationY = 8;
                
                const rotateX = ((centerY - y) / centerY) * maxRotationX;
                const rotateY = ((x - centerX) / centerX) * maxRotationY;
                
                // Lift project cards (-15px translateY) + tilt; tilt widgets in-place
                if (isProjectCard) {
                    card.style.transform = `perspective(1000px) translateY(-15px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
                } else {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
                }
                card.style.transition = 'transform 0.1s ease-out';
            });
            
            card.style.transformStyle = 'preserve-3d';
            
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease, border-color 0.4s ease';
                card.style.transform = 'perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    // Session Views & Time Tracking
    let sessionViews = parseInt(sessionStorage.getItem('session_views') || '0');
    sessionViews++;
    sessionStorage.setItem('session_views', sessionViews);
    const sessionStartTime = Date.now();

    // 16. Visitor Counter Logic (api.counterapi.dev)
    let visitCount = 0;
    let uniqueCount = 0;
    
    // Silent increment on page load
    async function incrementCounter() {
        const isReturning = localStorage.getItem('returning_visitor') === 'true';
        try {
            // Increment total visits
            const responseTotal = await fetch('https://api.counterapi.dev/v1/abhijit-misra-portfolio/visits/up');
            let totalData = {};
            if (responseTotal.ok) {
                totalData = await responseTotal.json();
            }

            let uniqueData = {};
            if (!isReturning) {
                // First time visitor: increment unique count
                localStorage.setItem('returning_visitor', 'true');
                const responseUnique = await fetch('https://api.counterapi.dev/v1/abhijit-misra-portfolio/unique-visits/up');
                if (responseUnique.ok) {
                    uniqueData = await responseUnique.json();
                }
            } else {
                // Returning visitor: read unique count without incrementing
                const responseUnique = await fetch('https://api.counterapi.dev/v1/abhijit-misra-portfolio/unique-visits');
                if (responseUnique.ok) {
                    uniqueData = await responseUnique.json();
                }
            }

            if (totalData && totalData.count) {
                visitCount = totalData.count;
            }
            if (uniqueData && uniqueData.count) {
                uniqueCount = uniqueData.count;
            }
        } catch (err) {
            console.warn('Counter API blocked or offline. Using localStorage fallback.', err);
            // Fallback: simulate visits locally so it never breaks
            let localTotal = parseInt(localStorage.getItem('local_visits') || '184');
            let localUnique = parseInt(localStorage.getItem('local_unique_visits') || '112');

            localTotal++;
            localStorage.setItem('local_visits', localTotal);

            if (!isReturning) {
                localStorage.setItem('returning_visitor', 'true');
                localUnique++;
                localStorage.setItem('local_unique_visits', localUnique);
            }

            visitCount = localTotal;
            uniqueCount = localUnique;
        }
    }
    incrementCounter();

    // Modal elements
    const counterBtn = document.getElementById('counter-btn');
    const counterModal = document.getElementById('counter-modal');
    const counterModalClose = document.getElementById('counter-modal-close');
    const counterPasswordInput = document.getElementById('counter-password');
    const counterSubmitBtn = document.getElementById('counter-submit-btn');
    const counterLockBtn = document.getElementById('counter-lock-btn');
    const counterError = document.getElementById('counter-error');
    const counterAuthSection = document.getElementById('counter-auth-section');
    const counterStatsSection = document.getElementById('counter-stats-section');

    if (counterBtn && counterModal) {
        counterBtn.addEventListener('click', () => {
            // Check if already authenticated in this session
            if (sessionStorage.getItem('counter_auth') === 'true') {
                showStats();
            } else {
                showAuth();
            }
            counterModal.classList.add('active');
        });

        counterModalClose.addEventListener('click', () => {
            counterModal.classList.remove('active');
            counterPasswordInput.value = '';
            counterError.textContent = '';
            stopSessionTimer();
        });

        counterModal.addEventListener('click', (e) => {
            if (e.target === counterModal) {
                counterModal.classList.remove('active');
                counterPasswordInput.value = '';
                counterError.textContent = '';
                stopSessionTimer();
            }
        });

        counterSubmitBtn.addEventListener('click', verifyPassword);
        counterPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyPassword();
            }
        });

        if (counterLockBtn) {
            counterLockBtn.addEventListener('click', () => {
                sessionStorage.removeItem('counter_auth');
                showAuth();
                stopSessionTimer();
            });
        }
    }

    function showAuth() {
        if (counterAuthSection && counterStatsSection && counterPasswordInput) {
            counterAuthSection.style.display = 'block';
            counterStatsSection.style.display = 'none';
            counterPasswordInput.value = '';
            stopSessionTimer();
            setTimeout(() => counterPasswordInput.focus(), 100);
        }
    }

    function showStats() {
        if (counterAuthSection && counterStatsSection) {
            counterAuthSection.style.display = 'none';
            counterStatsSection.style.display = 'block';

            // Animate metrics rolling up dynamically
            const returningCount = Math.max(0, visitCount - uniqueCount);
            animateValue('stats-visit-count', 0, visitCount, 1200);
            animateValue('stats-unique-count', 0, uniqueCount, 1200);
            animateValue('stats-returning-count', 0, returningCount, 1200);

            // Load session information and system configurations
            updateSystemSpecs();
            startSessionTimer();
        }
    }

    function verifyPassword() {
        if (counterPasswordInput && counterError) {
            const password = counterPasswordInput.value;
            if (password === '9401071282') {
                sessionStorage.setItem('counter_auth', 'true');
                showStats();
            } else {
                counterError.textContent = 'Incorrect Password!';
                counterPasswordInput.select();
            }
        }
    }

    // Dynamic Count-Up Animation
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    // Session Timer interval controls
    let sessionTimerInterval = null;
    function startSessionTimer() {
        const timerEl = document.getElementById('session-time-spent');
        if (!timerEl) return;
        
        stopSessionTimer();

        const updateTimer = () => {
            const elapsedMs = Date.now() - sessionStartTime;
            const totalSeconds = Math.floor(elapsedMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            timerEl.textContent = `${minutes}m ${seconds}s`;
        };
        
        updateTimer();
        sessionTimerInterval = setInterval(updateTimer, 1000);
    }

    function stopSessionTimer() {
        if (sessionTimerInterval) {
            clearInterval(sessionTimerInterval);
            sessionTimerInterval = null;
        }
    }

    // Parse system details for display
    function updateSystemSpecs() {
        const ua = navigator.userAgent;
        let browserName = "Unknown Browser";
        if (ua.indexOf("Firefox") > -1) {
            browserName = "Mozilla Firefox";
        } else if (ua.indexOf("SamsungBrowser") > -1) {
            browserName = "Samsung Internet";
        } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
            browserName = "Opera";
        } else if (ua.indexOf("Trident") > -1) {
            browserName = "Internet Explorer";
        } else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) {
            browserName = "Microsoft Edge";
        } else if (ua.indexOf("Chrome") > -1) {
            browserName = "Google Chrome";
        } else if (ua.indexOf("Safari") > -1) {
            browserName = "Apple Safari";
        }

        let osName = "Unknown OS";
        if (ua.indexOf("Win") > -1) osName = "Windows";
        else if (ua.indexOf("Mac") > -1) osName = "macOS";
        else if (ua.indexOf("Linux") > -1) osName = "Linux";
        else if (ua.indexOf("Android") > -1) osName = "Android";
        else if (ua.indexOf("like Mac") > -1) osName = "iOS";

        const resolution = `${window.screen.width} x ${window.screen.height}`;

        const browserEl = document.getElementById('spec-browser');
        const osEl = document.getElementById('spec-os');
        const resolutionEl = document.getElementById('spec-resolution');
        const sessionPageViewsEl = document.getElementById('session-page-views');

        if (browserEl) browserEl.textContent = browserName;
        if (osEl) osEl.textContent = osName;
        if (resolutionEl) resolutionEl.textContent = resolution;
        if (sessionPageViewsEl) sessionPageViewsEl.textContent = sessionViews;
    }
});


