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
    initEventDelegation();
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

// 3. Accessible Mobile Menu Drawer with Focus Management
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

// 5. Gospel Ministers Carousel (100% User-Controlled Manual Swipe, Zero Auto-Swipe)
function initMinisterCarousel() {
    const ministerCarousel = document.getElementById('minister-carousel');
    const dots = document.querySelectorAll('.c-dot');
    if (!ministerCarousel) return;

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
}

// 6. Media Theater Lightbox Engine with Strict Focus Trap & Safe DOM Instantiation
const MEDIA_PLAYLIST = [
    { type: 'video', target: '8Lu8u8ZSbog', caption: 'Aseda Praise 2026 Official Full Broadcast' },
    { type: 'video', target: '1W4pLw93xqI', caption: 'Massive Crowd at Aseda Praise' },
    { type: 'video', target: 'fMbN4ejx-QA', caption: 'Arrival of Ministers for Aseda Praise' },
    { type: 'video', target: '2KjBHujXc70', caption: 'Ten Thousand Hearts, One Voice' },
    { type: 'video', target: 'WXVQr9k0ixU', caption: 'The Stage is Set for Aseda Praise' },
    { type: 'video', target: 'GGSFWt3NRoU', caption: "Dedication of Tarkwa Apinto Children's Ward" },
    { type: 'image', target: 'assets/images/aseda_gp_good_shot.jpg', caption: 'Obaapa Christy · Headline Minister' },
    { type: 'image', target: 'assets/images/aseda_joe_mettle.jpg', caption: 'Joe Mettle · Worship Leader' },
    { type: 'image', target: 'assets/images/aseda_acp_kofi_sarpong.jpg', caption: 'ACP Kofi Sarpong · Gospel Minister' },
    { type: 'image', target: 'assets/images/aseda_founders.jpg', caption: 'Mr. Evans Ghartey & Mr. Frederick Lomotey · Founders' },
    { type: 'image', target: 'assets/images/aseda_gp_dancing.jpg', caption: 'Uniting Hearts in Praise & Worship · Tarkwa' },
    { type: 'image', target: 'assets/images/aseda_gp_obaapa_crowd.jpg', caption: 'Worshippers Engaging with Obaapa Christy' },
    { type: 'image', target: 'assets/images/aseda_gp_engagement.jpg', caption: 'Crowd Engagement & Worship Moments' },
    { type: 'image', target: 'assets/images/aseda_gp_yvonne.jpg', caption: 'Gospel Minister Performing Live' },
    { type: 'image', target: 'assets/images/aseda_official_photo_1.jpg', caption: 'Aseda Praise Celebration Photography' },
    { type: 'image', target: 'assets/images/aseda_official_photo_2.jpg', caption: 'Stage Worship Atmosphere' },
    { type: 'image', target: 'assets/images/aseda_official_photo_3.jpg', caption: 'Annual Easter Thanksgiving Moments' },
    { type: 'image', target: 'assets/images/aseda_gp_extra_1.jpg', caption: 'Worshippers Gathering' },
    { type: 'image', target: 'assets/images/aseda_gp_extra_2.jpg', caption: 'Festival Praise' },
    { type: 'image', target: 'assets/images/aseda_gp_extra_3.jpg', caption: 'Community Praise Atmosphere' }
];

let currentMediaIdx = 0;
let lbLastFocusedElement = null;

function initMediaTheater() {
    window.openMediaTheater = function(type, target, caption, playlistIndex = null) {
        lbLastFocusedElement = document.activeElement;
        const lb = document.getElementById('lightbox');
        const stage = document.getElementById('lb-media-stage');

        if (!lb || !stage) return;

        if (playlistIndex !== null && playlistIndex !== undefined && playlistIndex >= 0 && playlistIndex < MEDIA_PLAYLIST.length) {
            currentMediaIdx = parseInt(playlistIndex, 10);
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
        stage.replaceChildren(); // Safe clean clearance without innerHTML
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

        // Clear stage safely using modern DOM replaceChildren
        stage.replaceChildren();

        if (item.type === 'video') {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${item.target}?autoplay=1&rel=0`;
            iframe.title = item.caption;
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            stage.appendChild(iframe);
        } else {
            const img = document.createElement('img');
            img.src = item.target;
            img.alt = item.caption;
            img.loading = "eager";
            stage.appendChild(img);
        }

        if (captionEl) captionEl.textContent = item.caption;
        if (counterEl) counterEl.textContent = `${currentMediaIdx + 1} / ${MEDIA_PLAYLIST.length}`;
    }

    // Keyboard Navigation & Strict Modal Focus Trap
    const lb = document.getElementById('lightbox');
    if (lb) {
        lb.addEventListener('keydown', e => { 
            if (!lb.classList.contains('open')) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
                return;
            } 
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                stepMediaTheater(1);
                return;
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                stepMediaTheater(-1);
                return;
            }

            // Strict Tab Focus Trap
            if (e.key === 'Tab') {
                const focusables = lb.querySelectorAll('button:not([disabled]), [tabindex="0"]');
                if (!focusables.length) return;

                const firstEl = focusables[0];
                const lastEl = focusables[focusables.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstEl) {
                        e.preventDefault();
                        lastEl.focus();
                    }
                } else {
                    if (document.activeElement === lastEl) {
                        e.preventDefault();
                        firstEl.focus();
                    }
                }
            }
        });
    }
}

// 7. Event Delegation Engine (Zero Inline onclick Event Handlers)
function initEventDelegation() {
    document.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (actionBtn) {
            const action = actionBtn.dataset.action;
            if (action === 'close-mobile-menu') {
                closeMobileMenu();
            } else if (action === 'close-lightbox') {
                closeLightbox();
            } else if (action === 'prev-media') {
                stepMediaTheater(-1);
            } else if (action === 'next-media') {
                stepMediaTheater(1);
            }
            return;
        }

        const mediaBtn = e.target.closest('[data-media-type]');
        if (mediaBtn) {
            const type = mediaBtn.dataset.mediaType;
            const target = mediaBtn.dataset.mediaTarget || mediaBtn.dataset.mediaId;
            const caption = mediaBtn.dataset.mediaCaption || '';
            const idx = mediaBtn.dataset.mediaIndex ? parseInt(mediaBtn.dataset.mediaIndex, 10) : null;
            openMediaTheater(type, target, caption, idx);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const targetBtn = e.target.closest('[data-action], [data-media-type]');
            if (targetBtn && targetBtn !== document.activeElement) {
                e.preventDefault();
                targetBtn.click();
            }
        }
    });
}
