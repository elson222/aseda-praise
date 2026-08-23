/* ============================================================
   ASEDA PRAISE — Production JavaScript Application Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initUrlHashCleaner();
    initNavbarScroll();
    initMobileMenu();
    initHeroParallax();
    initMinisterCarousel();
    initMediaTheater();
    initKeyboardAccessibility();
});

// 1. URL Hash Cleaner (Removes #home from address bar gracefully)
function initUrlHashCleaner() {
    function cleanHash() {
        if (window.location.hash === '#home' || window.location.hash === '#') {
            if (history.replaceState) {
                history.replaceState(null, null, window.location.pathname + window.location.search);
            }
        }
    }
    cleanHash();
    window.addEventListener('load', cleanHash);

    document.querySelectorAll('a[href="./"], a[href="#home"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (history.pushState) {
                history.pushState(null, null, window.location.pathname + window.location.search);
            }
        });
    });
}

// 2. Navbar Scroll Effect
function initNavbarScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }, { passive: true });
}

// 3. Accessible Mobile Menu Drawer
let lastFocusedElement = null;

function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburgerBtn || !mobileMenu) return;

    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            lastFocusedElement = document.activeElement;
            mobileMenu.classList.add('open');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            hamburgerBtn.innerHTML = '&times;';
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            const firstLink = mobileMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    }

    window.closeMobileMenu = function() {
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.innerHTML = '&#9776;';
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    };

    hamburgerBtn.addEventListener('click', toggleMobileMenu);
}

// 4. Hero Mouse Tilt & Parallax (Disabled on Mobile & Reduced Motion for Performance)
function initHeroParallax() {
    const heroSection = document.getElementById('home');
    const heroBg = document.getElementById('hero-bg');
    if (!heroSection || !heroBg) return;

    // Check user motion preferences & viewport width
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport = window.innerWidth <= 768;

    if (prefersReducedMotion || isMobileViewport) {
        heroBg.style.transform = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let ticking = false;

    function renderHeroParallax() {
        const scrollY = window.scrollY || window.pageYOffset;
        const heroHeight = heroSection.offsetHeight || 600;

        if (scrollY <= heroHeight + 150) {
            const scrollProgress = Math.min(scrollY / heroHeight, 1);
            const scaleVal = 1.0 + (scrollProgress * 0.15);
            const translateYVal = scrollY * 0.3;

            mouseX += (targetMouseX - mouseX) * 0.08;
            mouseY += (targetMouseY - mouseY) * 0.08;

            const totalX = mouseX;
            const totalY = translateYVal + mouseY;

            heroBg.style.transform = `translate3d(${totalX}px, ${totalY}px, 0px) scale(${scaleVal})`;
        }

        ticking = false;
    }

    function requestParallaxTick() {
        if (!ticking) {
            requestAnimationFrame(renderHeroParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestParallaxTick, { passive: true });

    if (matchMedia('(pointer: fine)').matches) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
            targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
            requestParallaxTick();
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
            targetMouseX = 0;
            targetMouseY = 0;
            requestParallaxTick();
        });
    }

    renderHeroParallax();
}

// 5. Gospel Ministers Auto-Swipe Carousel
function initMinisterCarousel() {
    const ministerCarousel = document.getElementById('minister-carousel');
    const dots = document.querySelectorAll('.c-dot');
    if (!ministerCarousel) return;

    let currentIndex = 0;
    let autoSwipeTimer = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function scrollToMinister(index) {
        const cards = ministerCarousel.querySelectorAll('.m-card');
        if (!cards.length) return;

        currentIndex = index % cards.length;
        const targetCard = cards[currentIndex];
        
        ministerCarousel.scrollTo({
            left: targetCard.offsetLeft - 16,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function startAutoSwipe() {
        // Respect reduced motion & only run on small screens if requested
        if (!autoSwipeTimer && window.innerWidth <= 768 && !prefersReducedMotion) {
            autoSwipeTimer = setInterval(() => {
                scrollToMinister(currentIndex + 1);
            }, 4500);
        }
    }

    function stopAutoSwipe() {
        if (autoSwipeTimer) {
            clearInterval(autoSwipeTimer);
            autoSwipeTimer = null;
        }
    }

    ministerCarousel.addEventListener('scroll', () => {
        const cards = ministerCarousel.querySelectorAll('.m-card');
        if (!cards.length) return;
        const scrollLeft = ministerCarousel.scrollLeft;
        
        let activeIdx = 0;
        cards.forEach((card, idx) => {
            if (scrollLeft >= card.offsetLeft - (card.offsetWidth / 2)) {
                activeIdx = idx;
            }
        });
        
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIdx);
        });
    }, { passive: true });

    ministerCarousel.addEventListener('touchstart', stopAutoSwipe, { passive: true });
    ministerCarousel.addEventListener('touchend', () => setTimeout(startAutoSwipe, 5000), { passive: true });
    
    startAutoSwipe();
    window.addEventListener('resize', () => {
        stopAutoSwipe();
        startAutoSwipe();
    });
}

// 6. Media Theater Lightbox Engine with Full Accessibility
const MEDIA_PLAYLIST = [
    { type: 'video', target: '8Lu8u8ZSbog', caption: 'Aseda Praise 2026 Official Full Program Broadcast' },
    { type: 'image', target: 'assets/images/aseda_gp_dancing.jpg', caption: 'Uniting Hearts in Praise & Worship · Tarkwa' },
    { type: 'image', target: 'assets/images/aseda_founders.jpg', caption: 'Visionaries & Co-Founders Evans Ghartey and Frederick Lomotey' },
    { type: 'image', target: 'assets/images/aseda_stage_obaapa_christy.jpg', caption: 'Obaapa Christy Performing Live at Aseda Praise in Tarkwa' },
    { type: 'image', target: 'assets/images/aseda_joe_mettle.jpg', caption: 'Minister Joe Mettle Leading Anointed Worship' },
    { type: 'image', target: 'assets/images/aseda_acp_kofi_sarpong.jpg', caption: 'ACP Kofi Sarpong Ministering in Praise' },
    { type: 'image', target: 'assets/images/aseda_gp_engagement.jpg', caption: 'Crowd of Thousands Worshipping Together in Tarkwa' },
    { type: 'image', target: 'assets/images/aseda_official_photo_1.jpg', caption: 'Altar of Praise & Thanksgiving · Aseda Praise 2026' },
    { type: 'image', target: 'assets/images/aseda_official_photo_2.jpg', caption: 'Hands Raised in Worship · Tarkwa Community' }
];

let currentMediaIdx = 0;
let lbLastFocusedElement = null;

function initMediaTheater() {
    window.openMediaTheater = function(type, target, caption, playlistIndex = null) {
        lbLastFocusedElement = document.activeElement;
        const lb = document.getElementById('lightbox');
        const stage = document.getElementById('lb-media-stage');
        const captionEl = document.getElementById('lb-caption-title');
        const counterEl = document.getElementById('lb-counter');

        if (!lb || !stage) return;

        if (playlistIndex !== null && playlistIndex >= 0 && playlistIndex < MEDIA_PLAYLIST.length) {
            currentMediaIdx = playlistIndex;
        } else {
            const foundIdx = MEDIA_PLAYLIST.findIndex(item => item.target === target);
            currentMediaIdx = foundIdx !== -1 ? foundIdx : 0;
        }

        renderMediaContent();
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const closeBtn = document.getElementById('lb-close-btn');
        if (closeBtn) closeBtn.focus();
    };

    window.closeLightbox = function() {
        const lb = document.getElementById('lightbox');
        const stage = document.getElementById('lb-media-stage');
        if (!lb || !stage) return;

        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        stage.innerHTML = ''; // Stop any playing video
        document.body.style.overflow = '';

        if (lbLastFocusedElement && typeof lbLastFocusedElement.focus === 'function') {
            lbLastFocusedElement.focus();
        }
    };

    window.stepMediaTheater = function(dir) {
        currentMediaIdx = (currentMediaIdx + dir + MEDIA_PLAYLIST.length) % MEDIA_PLAYLIST.length;
        renderMediaContent();
    };

    function renderMediaContent() {
        const stage = document.getElementById('lb-media-stage');
        const captionEl = document.getElementById('lb-caption-title');
        const counterEl = document.getElementById('lb-counter');
        const item = MEDIA_PLAYLIST[currentMediaIdx];

        if (!item || !stage) return;

        if (item.type === 'video') {
            // Privacy-enhanced YouTube embed
            stage.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${item.target}?autoplay=1&rel=0" title="${item.caption}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            stage.innerHTML = `<img src="${item.target}" alt="${item.caption}" loading="eager">`;
        }

        if (captionEl) captionEl.textContent = item.caption;
        if (counterEl) counterEl.textContent = `${currentMediaIdx + 1} / ${MEDIA_PLAYLIST.length}`;
    }

    document.addEventListener('keydown', e => { 
        const lb = document.getElementById('lightbox');
        if (lb && lb.classList.contains('open')) {
            if (e.key === 'Escape') closeLightbox(); 
            if (e.key === 'ArrowRight') stepMediaTheater(1);
            if (e.key === 'ArrowLeft') stepMediaTheater(-1);
        }
    });
}

// 7. Keyboard Accessibility Handler for Buttons & Interactive Cards
function initKeyboardAccessibility() {
    document.querySelectorAll('button, [role="button"]').forEach(btn => {
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
}
