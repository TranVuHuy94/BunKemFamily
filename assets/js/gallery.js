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
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    let activeItem = null;
    let isVideo = false;

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            activeItem = item;
            const originalImg = item.querySelector('img');
            const originalVideo = item.querySelector('video');
            isVideo = !!originalVideo;

            const originalMedia = isVideo ? originalVideo : originalImg;
            const rect = originalMedia.getBoundingClientRect();

            // Lock scroll immediately to prevent layout shift
            document.body.style.overflow = 'hidden';

            if (isVideo) {
                // Handle video
                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'block';
                lightboxVideo.src = originalVideo.src;
                lightboxVideo.style.opacity = '0';
                lightbox.classList.add('active');

                requestAnimationFrame(() => {
                    const targetRect = lightboxVideo.getBoundingClientRect();

                    const clone = originalVideo.cloneNode();
                    clone.classList.add('transition-clone');
                    clone.style.top = `${rect.top}px`;
                    clone.style.left = `${rect.left}px`;
                    clone.style.width = `${rect.width}px`;
                    clone.style.height = `${rect.height}px`;
                    clone.style.margin = '0';
                    clone.style.objectFit = 'contain';
                    clone.muted = true;
                    document.body.appendChild(clone);

                    originalVideo.style.visibility = 'hidden';

                    requestAnimationFrame(() => {
                        clone.style.top = `${targetRect.top}px`;
                        clone.style.left = `${targetRect.left}px`;
                        clone.style.width = `${targetRect.width}px`;
                        clone.style.height = `${targetRect.height}px`;

                        setTimeout(() => {
                            lightboxVideo.style.opacity = '1';
                            lightboxVideo.style.transition = 'none';
                            void lightboxVideo.offsetWidth;
                            clone.remove();
                            lightboxVideo.play();

                            setTimeout(() => {
                                lightboxVideo.style.transition = '';
                            }, 50);
                        }, 600);
                    });
                });
            } else {
                // Handle image
                lightboxVideo.style.display = 'none';
                lightboxImg.style.display = 'block';
                lightboxImg.src = originalImg.src;
                lightboxImg.style.opacity = '0';
                lightbox.classList.add('active');

                requestAnimationFrame(() => {
                    const targetRect = lightboxImg.getBoundingClientRect();

                    const clone = originalImg.cloneNode();
                    clone.classList.add('transition-clone');
                    clone.style.top = `${rect.top}px`;
                    clone.style.left = `${rect.left}px`;
                    clone.style.width = `${rect.width}px`;
                    clone.style.height = `${rect.height}px`;
                    clone.style.margin = '0';
                    clone.style.objectFit = 'cover';
                    document.body.appendChild(clone);

                    originalImg.style.visibility = 'hidden';

                    requestAnimationFrame(() => {
                        clone.style.top = `${targetRect.top}px`;
                        clone.style.left = `${targetRect.left}px`;
                        clone.style.width = `${targetRect.width}px`;
                        clone.style.height = `${targetRect.height}px`;

                        setTimeout(() => {
                            lightboxImg.style.opacity = '1';
                            lightboxImg.style.transition = 'none';
                            void lightboxImg.offsetWidth;
                            clone.remove();

                            setTimeout(() => {
                                lightboxImg.style.transition = '';
                            }, 50);
                        }, 600);
                    });
                });
            }
        });
    });

    const closeLightbox = () => {
        if (!activeItem) return;

        const originalImg = activeItem.querySelector('img');
        const originalVideo = activeItem.querySelector('video');
        const originalMedia = isVideo ? originalVideo : originalImg;
        const lightboxMedia = isVideo ? lightboxVideo : lightboxImg;

        // Pause video if it's playing
        if (isVideo) {
            lightboxVideo.pause();
        }

        const currentRect = lightboxMedia.getBoundingClientRect();
        const targetRect = originalMedia.getBoundingClientRect();

        // 1. Create Closing Clone
        const clone = lightboxMedia.cloneNode();
        clone.classList.add('transition-clone');
        clone.style.top = `${currentRect.top}px`;
        clone.style.left = `${currentRect.left}px`;
        clone.style.width = `${currentRect.width}px`;
        clone.style.height = `${currentRect.height}px`;
        clone.style.margin = '0';
        clone.style.boxShadow = '0 40px 100px -20px rgba(0, 0, 0, 0.6)';
        if (isVideo) {
            clone.muted = true;
        }
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
                originalMedia.style.visibility = 'visible';
                clone.style.opacity = '0';
                setTimeout(() => {
                    clone.remove();
                    activeItem = null;
                    isVideo = false;
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
