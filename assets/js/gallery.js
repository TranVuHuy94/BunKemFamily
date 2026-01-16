document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal');
                }, index % 3 * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => observer.observe(item));

    // Advanced Lightbox with Bi-directional Shared Element Transition
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    let activeItem = null;

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            activeItem = item;
            const originalImg = item.querySelector('img');
            const rect = originalImg.getBoundingClientRect();

            // Lock scroll immediately to prevent layout shift
            document.body.style.overflow = 'hidden';

            // 1. Prepare Lightbox (hidden but positioned)
            lightboxImg.src = originalImg.src;
            lightboxImg.style.opacity = '0';
            lightbox.classList.add('active');

            // Wait for lightbox to be display:flex to get final target rect
            requestAnimationFrame(() => {
                const targetRect = lightboxImg.getBoundingClientRect();

                // 2. Create Transition Clone
                const clone = originalImg.cloneNode();
                clone.classList.add('transition-clone');
                clone.style.top = `${rect.top}px`;
                clone.style.left = `${rect.left}px`;
                clone.style.width = `${rect.width}px`;
                clone.style.height = `${rect.height}px`;
                clone.style.margin = '0';
                clone.style.objectFit = 'cover';
                document.body.appendChild(clone);

                // Hide original thumb
                originalImg.style.visibility = 'hidden';

                // 3. Animate to target
                requestAnimationFrame(() => {
                    clone.style.top = `${targetRect.top}px`;
                    clone.style.left = `${targetRect.left}px`;
                    clone.style.width = `${targetRect.width}px`;
                    clone.style.height = `${targetRect.height}px`;

                    // Wait for animation to complete, then swap
                    setTimeout(() => {
                        // Position lightbox img exactly where clone is
                        lightboxImg.style.opacity = '1';
                        lightboxImg.style.transition = 'none'; // Disable transition momentarily

                        // Force a reflow to ensure no transition
                        void lightboxImg.offsetWidth;

                        // Remove clone immediately after lightbox img is visible
                        clone.remove();

                        // Re-enable transitions for future interactions
                        setTimeout(() => {
                            lightboxImg.style.transition = '';
                        }, 50);
                    }, 600); // Full animation duration
                });
            });
        });
    });

    const closeLightbox = () => {
        if (!activeItem) return;

        const originalImg = activeItem.querySelector('img');
        const currentRect = lightboxImg.getBoundingClientRect();
        const targetRect = originalImg.getBoundingClientRect();

        // 1. Create Closing Clone
        const clone = lightboxImg.cloneNode();
        clone.classList.add('transition-clone');
        clone.style.top = `${currentRect.top}px`;
        clone.style.left = `${currentRect.left}px`;
        clone.style.width = `${currentRect.width}px`;
        clone.style.height = `${currentRect.height}px`;
        clone.style.margin = '0';
        clone.style.boxShadow = '0 40px 100px -20px rgba(0, 0, 0, 0.6)';
        document.body.appendChild(clone);

        // 2. Hide Lightbox immediately
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // 3. Animate back to thumb
        requestAnimationFrame(() => {
            clone.style.top = `${targetRect.top}px`;
            clone.style.left = `${targetRect.left}px`;
            clone.style.width = `${targetRect.width}px`;
            clone.style.height = `${targetRect.height}px`;
            clone.style.borderRadius = '1rem';

            setTimeout(() => {
                originalImg.style.visibility = 'visible';
                clone.style.opacity = '0';
                setTimeout(() => {
                    clone.remove();
                    activeItem = null;
                }, 200);
            }, 600);
        });
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
