document.addEventListener('DOMContentLoaded', function() {

    // --- Inicjalizacja biblioteki AOS (Animate On Scroll) ---
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
    });

    // --- Zmiana wyglądu nagłówka przy przewijaniu ---
    const header = document.getElementById('main-header');
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

    // --- Dynamiczna zmiana obrazu przy przewijaniu (Scrollytelling) ---
    const stickyImage = document.getElementById('sticky-image');
    const featurePoints = document.querySelectorAll('.feature-point');

    if (stickyImage && featurePoints.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const featurePoint = entry.target;
                    const newImageSrc = featurePoint.dataset.image;
                    featurePoints.forEach(fp => fp.classList.remove('active'));
                    featurePoint.classList.add('active');
                    if (stickyImage.src.includes(newImageSrc) === false) {
                        stickyImage.style.opacity = '0.5';
                        setTimeout(() => {
                            stickyImage.src = newImageSrc;
                            stickyImage.style.opacity = '1';
                        }, 250);
                    }
                }
            });
        }, { 
            threshold: 0.7,
            rootMargin: "-20% 0px -20% 0px"
        });
        featurePoints.forEach(point => observer.observe(point));
    }

    // --- Funkcjonalność Lightboxa dla Galerii ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('[data-gallery-item]');
    let currentIndex = 0;

    if (lightbox) {
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