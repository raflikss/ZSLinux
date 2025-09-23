document.addEventListener('DOMContentLoaded', function() {

    // --- KONFIGURACJA ODLICZANIA ---
    // Wpisz datę premiery tutaj. Format: "Miesiąc Dzień, Rok Godzina:Minuta:Sekunda"
    // Aby ukryć pasek, zostaw pusty cudzysłów: ""
    const countdownDate = "October 01, 2025 20:30:00";

    // --- LOGIKA INTELIGENTNEGO PASKA ODLICZANIA ---
    const countdownBanner = document.getElementById('countdown-banner');
    const header = document.getElementById('main-header');
    if (countdownDate && countdownBanner) {
        countdownBanner.style.display = 'block';
        header.classList.add('with-banner');
        
        const countdownTimerEl = document.getElementById('countdown-timer');
        const countdownTextEl = document.getElementById('countdown-text');
        const monthsEl = document.getElementById('months');
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        const targetDate = new Date(countdownDate).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                let lang = document.documentElement.lang;
                countdownTimerEl.innerHTML = lang === 'en' ? "Launch is Live!" : "Premiera już dostępna!";
                countdownTextEl.style.display = 'none';
                return;
            }
            
            const totalDays = Math.floor(distance / (1000 * 60 * 60 * 24));
            const months = Math.floor(totalDays / 30.4375);
            const days = Math.floor(totalDays % 30.4375);
            
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const format = (num) => num < 10 ? '0' + num : num;

            monthsEl.innerText = format(months);
            daysEl.innerText = format(days);
            hoursEl.innerText = format(hours);
            minutesEl.innerText = format(minutes);
            secondsEl.innerText = format(seconds);
        };

        const interval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // --- Inicjalizacja biblioteki AOS (Animate On Scroll) ---
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
    });

    // --- Zmiana wyglądu nagłówka przy przewijaniu ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Interaktywny efekt 3D w sekcji Hero ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = heroContent.getBoundingClientRect();
            const x = e.clientX - left - width / 2;
            const y = e.clientY - top - height / 2;
            const rotateY = (x / width) * 8;
            const rotateX = -(y / height) * 8;
            heroContent.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });
        heroContent.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }

    // --- ULEPSZONA ANIMACJA SCROLLYTELLING ---
    const stickyImage = document.getElementById('sticky-image');
    const featurePoints = document.querySelectorAll('.feature-point');
    let currentImageSrc = stickyImage ? stickyImage.src : '';

    function handleScrollAnimation() {
        if (!stickyImage || featurePoints.length === 0 || window.innerWidth <= 992) {
            featurePoints.forEach(point => {
                point.style.opacity = '1';
                point.style.transform = 'translateY(0px)';
            });
            return;
        }

        const triggerPoint = window.innerHeight * 0.5;
        let activeFeature = null;
        let minDistance = Infinity;

        featurePoints.forEach(point => {
            const rect = point.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const distanceFromCenter = Math.abs(elementCenter - triggerPoint);
            const proximity = Math.max(0, 1 - distanceFromCenter / (window.innerHeight * 0.5));
            point.style.opacity = Math.pow(proximity, 3).toFixed(2);
            point.style.transform = `translateY(${(1 - proximity) * 30}px)`;

            if (distanceFromCenter < minDistance) {
                minDistance = distanceFromCenter;
                activeFeature = point;
            }
        });
        
        if (activeFeature) {
            const newImageSrc = activeFeature.dataset.image;
            if (newImageSrc && currentImageSrc !== newImageSrc) {
                currentImageSrc = newImageSrc;
                stickyImage.style.opacity = '0.5';
                stickyImage.style.transform = 'translate(-50%, -50%) scale(0.95) rotateY(10deg)';
                setTimeout(() => {
                    stickyImage.src = newImageSrc;
                    stickyImage.style.opacity = '1';
                    stickyImage.style.transform = 'translate(-50%, -50%) scale(1) rotateY(0deg)';
                }, 300);
            }
        }
    }
    
    window.addEventListener('scroll', handleScrollAnimation);
    window.addEventListener('resize', handleScrollAnimation);
    handleScrollAnimation();

    // --- Funkcjonalność Lightboxa dla Galerii ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('[data-gallery-item]');
    let currentIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const openLightbox = (index) => {
            currentIndex = index;
            const imgSrc = galleryItems[currentIndex].querySelector('img').src;
            lightboxImg.src = imgSrc;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        const showNext = () => openLightbox((currentIndex + 1) % galleryItems.length);
        const showPrev = () => openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-next').addEventListener('click', showNext);
        document.querySelector('.lightbox-prev').addEventListener('click', showPrev);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        });
    }
});