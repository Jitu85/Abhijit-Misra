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

    // 4. Dynamic Greeting
    const greetingElement = document.getElementById('greeting');
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

    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
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
    const bioText = "I am an enthusiastic computing lover. By education, I am a graduate in Economics, and I have completed various courses in Computer Science. My journey began in the early stages of my school days, at a time when computers were a brand-new concept in our society. Creating a simple PowerPoint presentation and sharing it with others brought us so much joy. Technology has evolved tremendously since then, and we have now entered the era of Artificial Intelligence. Today, all you need is your imagination, and AI will handle the hard work for you.";

    let isTyping = false;
    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            terminalText.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
            setTimeout(function() {
                typeWriter(text, i + 1, fnCallback)
            }, 30);
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
});
