document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // 0. PRELOADER & PAGE TRANSITION
    // ===============================
    const preloader = document.getElementById('preloader');
    const hasVisited = sessionStorage.getItem('visited');

    const loaderCounter = document.getElementById('loader-counter');
    const loaderBar = document.getElementById('loader-bar');
    const loaderText = document.getElementById('loader-text');

    if (preloader && !hasVisited) {
        sessionStorage.setItem('visited', 'true');

        let progress = 0;
        let speed = 25;

        const loadingInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 4) + 1;
            if (progress >= 100) progress = 100;

            if (loaderCounter) loaderCounter.textContent = progress + '%';
            if (loaderBar) loaderBar.style.width = progress + '%';
            if (loaderText) loaderText.style.width = progress + '%';

            if (progress === 100) {
                clearInterval(loadingInterval);

                setTimeout(() => {
                    preloader.classList.add('preloader-hidden');

                    setTimeout(() => {
                        initReveal();
                    }, 600);
                }, 500);
            }
        }, speed);

    } else if (preloader) {
        // INCOMING PAGE TRANSITION (Melingkar / Circular)
        preloader.innerHTML = '';
        preloader.className = 'fixed inset-0 z-[100] bg-[#0e0e0e] dark:bg-white pointer-events-none flex items-center justify-center';
        
        // Start fully covering the screen
        preloader.style.clipPath = 'circle(150% at 50% 50%)';
        preloader.style.transition = 'clip-path 0.9s cubic-bezier(0.77, 0, 0.175, 1)';

        void preloader.offsetWidth; // Trigger reflow

        // Animate shrinking into the center
        setTimeout(() => {
            preloader.style.clipPath = 'circle(0% at 50% 50%)';

            setTimeout(() => {
                preloader.style.display = 'none';
                initReveal();
            }, 900);
        }, 50);
    } else {
        initReveal();
    }


    // ===============================
    // 1. THEME TOGGLE
    // ===============================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const htmlElement = document.documentElement;

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    const toggleTheme = () => {
        htmlElement.classList.toggle('dark');
        localStorage.theme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);


    // ===============================
    // 2. NAVBAR SCROLL
    // ===============================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add('py-2', 'shadow-sm');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.add('py-4');
            navbar.classList.remove('py-2', 'shadow-sm');
        }
    });


    // ===============================
    // 3. MOBILE MENU
    // ===============================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = () => {
        if (!mobileMenu) return;

        mobileMenu.classList.toggle('translate-y-full');
        document.body.classList.toggle('overflow-hidden');
    };

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));


    // ===============================
    // 4. SCROLL REVEAL
    // ===============================
    function initReveal() {
        const reveals = document.querySelectorAll('.reveal');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        });

        reveals.forEach(el => revealObserver.observe(el));
    }


    // ===============================
    // 5. BACK TO TOP
    // ===============================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                backToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            }
        });
    }


    // ===============================
    // 6. COPY EMAIL
    // ===============================
    const copyEmailBtn = document.getElementById('copyEmailBtn');

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = "zaidanf504@gmail.com";
            const originalHTML = copyEmailBtn.innerHTML;

            try {
                await navigator.clipboard.writeText(email);
                copyEmailBtn.innerHTML = `<span class="flex items-center gap-2 text-emerald-500 font-bold"><i class='bx bx-check'></i> Disalin!</span>`;

                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalHTML;
                }, 2000);
            } catch (err) {
                alert("Gagal menyalin email!");
            }
        });
    }


    // ===============================
    // 7. YEAR FOOTER
    // ===============================
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ===============================
    // 8. PAGE TRANSITION (EXIT - Melingkar)
    // ===============================
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = link.getAttribute('target');
            
            if (!href || target === '_blank' || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
                return;
            }

            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            const linkPath = href.split('/').pop();
            
            if (href === currentPath || linkPath === currentPath) {
                return;
            }

            e.preventDefault();

            let loadingText = 'ZAIDAN.';
            if (href.includes('projects')) loadingText = 'PROYEK.';
            if (href.includes('about')) loadingText = 'PROFIL.';

            const exitOverlay = document.createElement('div');
            exitOverlay.className = 'exit-overlay fixed inset-0 z-[9999] bg-[#0e0e0e] dark:bg-white flex items-center justify-center pointer-events-none';
            
            // Start as a tiny dot in the center
            exitOverlay.style.clipPath = 'circle(0% at 50% 50%)';
            exitOverlay.style.transition = 'clip-path 0.9s cubic-bezier(0.77, 0, 0.175, 1)';
            
            exitOverlay.innerHTML = `
                <div class="relative text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white dark:text-black">
                    ${loadingText}
                </div>
            `;
            
            document.body.appendChild(exitOverlay);

            void exitOverlay.offsetWidth; // Trigger reflow

            // Animate expanding to cover the screen
            exitOverlay.style.clipPath = 'circle(150% at 50% 50%)';

            // Wait for animation to finish before navigating
            setTimeout(() => {
                window.location.href = href;
            }, 900);
        });
    });

    // Handle bfcache (back button navigation)
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            const curtains = document.querySelectorAll('.exit-overlay');
            curtains.forEach(c => c.remove());
        }
    });

});