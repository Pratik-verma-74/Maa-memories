/**
 * Digital Smriti - Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global State ---
    let currentScreen = 'homeScreen';
    let currentPhotoIndex = 0;
    let currentShlokIndex = 0;
    let isMusicPlaying = false;
    let slideshowInterval = null;

    // --- DOM Elements ---
    const screens = document.querySelectorAll('.screen');
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('#navMenu a, .back-btn');
    
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const bgMusic = document.getElementById('bgMusic');
    
    const enterBtn = document.getElementById('enterBtn');
    const openPhotoBtn = document.getElementById('openPhotoBtn');
    const openVideoBtn = document.getElementById('openVideoBtn');

    // --- Screen Navigation ---
    function switchScreen(targetScreenId) {
        screens.forEach(screen => {
            if (screen.id === targetScreenId) {
                screen.classList.remove('hidden');
                // slight delay to allow display:block to render before fading in
                setTimeout(() => screen.classList.add('active'), 10);
            } else {
                screen.classList.remove('active');
                setTimeout(() => screen.classList.add('hidden'), 800); // match CSS transition duration
            }
        });
        currentScreen = targetScreenId;
        
        // Hide hamburger menu in immersive modes to prevent overlaps and UI clutter
        if (targetScreenId === 'photoMode' || targetScreenId === 'videoMode') {
            mainNav.style.display = 'none';
        } else {
            mainNav.style.display = 'block';
        }
        
        // Pause slideshow if leaving photo mode
        if (currentScreen !== 'photoMode') {
            stopSlideshow();
        }
        
        // Pause video if leaving video mode
        if (currentScreen !== 'videoMode') {
             const videoPlayer = document.getElementById('mainVideoPlayer');
             if(videoPlayer) videoPlayer.pause();
             document.getElementById('videoLightbox').classList.add('hidden');
        }

        mainNav.classList.remove('open');
        window.scrollTo(0, 0);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if (target) switchScreen(target);
        });
    });

    if(enterBtn) enterBtn.addEventListener('click', () => switchScreen('selectionScreen'));
    if(openPhotoBtn) openPhotoBtn.addEventListener('click', () => switchScreen('photoMode'));
    if(openVideoBtn) openVideoBtn.addEventListener('click', () => switchScreen('videoMode'));
    const openBhavBtn = document.getElementById('openBhavBtn');
    if(openBhavBtn) openBhavBtn.addEventListener('click', () => switchScreen('bhavMode'));
    const homeBhavBtn = document.getElementById('homeBhavBtn');
    if(homeBhavBtn) homeBhavBtn.addEventListener('click', () => switchScreen('bhavMode'));
    const viewInBookBtn = document.getElementById('viewInBookBtn');
    if(viewInBookBtn) viewInBookBtn.addEventListener('click', () => switchScreen('bookMode'));

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent document click from firing
        mainNav.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (mainNav.classList.contains('open') && !mainNav.contains(e.target)) {
            mainNav.classList.remove('open');
        }
    });

    // --- Audio System ---
    // Restore preference
    const savedMusicPref = localStorage.getItem('musicEnabled');
    if (savedMusicPref === 'true') {
        isMusicPlaying = true;
        musicIcon.textContent = '🔊';
        // Browsers block autoplay without interaction, so we just set state and try to play on first click anywhere
    }

    musicToggle.addEventListener('click', toggleMusic);

    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '🔇';
            isMusicPlaying = false;
            localStorage.setItem('musicEnabled', 'false');
        } else {
            bgMusic.play().catch(e => console.log("Audio play prevented:", e));
            musicIcon.textContent = '🔊';
            isMusicPlaying = true;
            localStorage.setItem('musicEnabled', 'true');
        }
    }
    
    // Audio Track Selection
    const audioBtns = document.querySelectorAll('.audio-btn');
    audioBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const src = e.target.getAttribute('data-src');
            if (!src) return;
            
            // Update UI
            audioBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Change Audio
            const wasPlaying = isMusicPlaying;
            bgMusic.src = src;
            if (wasPlaying) {
                bgMusic.play().catch(err => console.log("Audio play prevented:", err));
            }
        });
    });
    
    // Play music on first interaction if it was enabled previously
    document.body.addEventListener('click', function firstInteraction() {
        if (isMusicPlaying && bgMusic.paused) {
            bgMusic.play().catch(e => console.log("Audio play prevented:", e));
        }
        document.body.removeEventListener('click', firstInteraction);
    }, { once: true });


    // --- Tribute Features ---
    const btnPushpanjali = document.getElementById('btnPushpanjali');
    const btnDiya = document.getElementById('btnDiya');
    const diyaContainer = document.getElementById('diyaContainer');
    const heroPortrait = document.querySelector('.hero-portrait');

    if (btnDiya && diyaContainer) {
        btnDiya.addEventListener('click', () => {
            diyaContainer.classList.toggle('hidden');
        });
    }

    if (btnPushpanjali && heroPortrait) {
        btnPushpanjali.addEventListener('click', () => {
            // Spawn 20 petals over 3 seconds
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const petal = document.createElement('img');
                    petal.classList.add('petal');
                    petal.src = 'assets/images/real_flower.png';
                    
                    // Random horizontal position within portrait
                    const randomX = Math.random() * 180 - 90; // Center offset
                    petal.style.left = `calc(50% + ${randomX}px)`;
                    
                    // Randomize duration
                    const fallDuration = 2.5 + Math.random() * 2; // 2.5 to 4.5 seconds
                    const swayDuration = 1 + Math.random() * 1.5;
                    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
                    
                    // Random rotation starting point and scale to make them look dynamic
                    const randomScale = 0.5 + Math.random() * 0.5;
                    petal.style.transform = `scale(${randomScale})`;

                    heroPortrait.appendChild(petal);
                    
                    // Cleanup
                    setTimeout(() => petal.remove(), fallDuration * 1000);
                }, i * 150);
            }
        });
    }

    // --- Mini Shlok on Selection Screen ---
    function updateMiniShlok() {
        const sanskritEl = document.getElementById('miniShlokSanskrit');
        const hindiEl = document.getElementById('miniShlokHindi');
        if (sanskritEl && hindiEl && shlokas.length > 0) {
            // Pick a random shlok or cycle
            const shlok = shlokas[Math.floor(Math.random() * shlokas.length)];
            sanskritEl.innerText = shlok.sanskrit;
            hindiEl.innerText = shlok.hindi;
        }
    }
    updateMiniShlok();

    // --- Photo Mode Logic ---
    const currentPhotoEl = document.getElementById('currentPhoto');
    const photoCounterEl = document.getElementById('photoCounter');
    const photoTitleEl = document.getElementById('photoTitle');
    const photoCaptionEl = document.getElementById('photoCaption');
    const photoDateEl = document.getElementById('photoDate');
    const prevPhotoBtn = document.getElementById('prevPhotoBtn');
    const nextPhotoBtn = document.getElementById('nextPhotoBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const playPauseSlideshowBtn = document.getElementById('playPauseSlideshow');

    function updatePhotoView() {
        if (photos.length === 0) return;
        
        const photo = photos[currentPhotoIndex];
        
        // Fade out slightly
        currentPhotoEl.style.opacity = 0;
        
        setTimeout(() => {
            currentPhotoEl.src = photo.src;
            currentPhotoEl.alt = photo.title || 'स्मृति';
            photoTitleEl.textContent = photo.title || '';
            photoCaptionEl.textContent = photo.caption || '';
            photoDateEl.textContent = photo.date || '';
            photoCounterEl.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
            
            // Fade in
            currentPhotoEl.style.opacity = 1;
            
            // Preload next image
            if (currentPhotoIndex < photos.length - 1) {
                const nextImg = new Image();
                nextImg.src = photos[currentPhotoIndex + 1].src;
            }
        }, 300);
    }

    function nextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        updatePhotoView();
    }

    function prevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        updatePhotoView();
    }

    if(prevPhotoBtn) prevPhotoBtn.addEventListener('click', prevPhoto);
    if(nextPhotoBtn) nextPhotoBtn.addEventListener('click', nextPhoto);

    // Initialize photo viewer
    if (photos.length > 0) {
        updatePhotoView();
    } else {
        photoCounterEl.textContent = "0 / 0";
    }

    // Swipe Support for Photos
    let touchStartX = 0;
    let touchEndX = 0;
    const photoMainArea = document.getElementById('photoMainArea');

    if (photoMainArea) {
        photoMainArea.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        photoMainArea.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        const SWIPE_THRESHOLD = 50;
        if (touchEndX < touchStartX - SWIPE_THRESHOLD) nextPhoto();
        if (touchEndX > touchStartX + SWIPE_THRESHOLD) prevPhoto();
    }

    // Slideshow
    function toggleSlideshow() {
        if (slideshowInterval) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    }

    function startSlideshow() {
        if (playPauseSlideshowBtn) playPauseSlideshowBtn.textContent = '⏸ Pause';
        slideshowInterval = setInterval(nextPhoto, 3500);
    }

    function stopSlideshow() {
        if (playPauseSlideshowBtn) playPauseSlideshowBtn.textContent = '▶ Slideshow';
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }

    if (playPauseSlideshowBtn) playPauseSlideshowBtn.addEventListener('click', toggleSlideshow);

    // Fullscreen for photo
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.getElementById('photoMode').requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }

    // --- Video Mode Logic ---
    const videoGrid = document.getElementById('videoGrid');
    const videoLightbox = document.getElementById('videoLightbox');
    const mainVideoPlayer = document.getElementById('mainVideoPlayer');
    const closeVideoBtn = document.getElementById('closeVideoBtn');
    const lightboxVideoTitle = document.getElementById('lightboxVideoTitle');

    function renderVideos() {
        if (!videoGrid) return;
        
        videos.forEach((video, index) => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.innerHTML = `
                <div class="video-thumbnail-container">
                    <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" loading="lazy">
                    <div class="play-icon-overlay">▶</div>
                </div>
                <div class="video-info text-center">
                    <h3 class="video-title">${video.title}</h3>
                    ${video.date ? `<p class="date">${video.date}</p>` : ''}
                </div>
            `;
            
            card.addEventListener('click', () => openVideo(video));
            videoGrid.appendChild(card);
        });
    }

    function openVideo(video) {
        mainVideoPlayer.src = video.src;
        lightboxVideoTitle.textContent = video.title || '';
        videoLightbox.classList.remove('hidden');
        
        // Pause background music
        if (isMusicPlaying) {
            bgMusic.pause();
        }
    }

    function closeVideo() {
        mainVideoPlayer.pause();
        mainVideoPlayer.src = '';
        videoLightbox.classList.add('hidden');
        
        // Resume background music if it was playing
        if (isMusicPlaying) {
            bgMusic.play().catch(e=>console.log(e));
        }
    }

    if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideo);
    
    // Resume music when video ends
    if (mainVideoPlayer) {
        mainVideoPlayer.addEventListener('ended', () => {
            if (isMusicPlaying) {
                bgMusic.play().catch(e=>console.log(e));
            }
        });
    }

    renderVideos();

    // --- Shlok Mode Logic ---
    const mainShlokSanskrit = document.getElementById('mainShlokSanskrit');
    const mainShlokHindi = document.getElementById('mainShlokHindi');
    const prevShlokBtn = document.getElementById('prevShlok');
    const nextShlokBtn = document.getElementById('nextShlok');

    function updateShlokView() {
        if (shlokas.length === 0 || !mainShlokSanskrit) return;
        const shlok = shlokas[currentShlokIndex];
        
        const card = document.querySelector('.shlok-card');
        if(card) {
            card.style.opacity = 0;
            setTimeout(() => {
                mainShlokSanskrit.innerText = shlok.sanskrit;
                mainShlokHindi.innerText = shlok.hindi;
                card.style.opacity = 1;
            }, 300);
        }
    }

    if (prevShlokBtn) {
        prevShlokBtn.addEventListener('click', () => {
            currentShlokIndex = (currentShlokIndex - 1 + shlokas.length) % shlokas.length;
            updateShlokView();
        });
    }

    if (nextShlokBtn) {
        nextShlokBtn.addEventListener('click', () => {
            currentShlokIndex = (currentShlokIndex + 1) % shlokas.length;
            updateShlokView();
        });
    }

    updateShlokView();

    // --- Keyboard Navigation ---
    document.addEventListener('keydown', (e) => {
        if (currentScreen === 'photoMode') {
            if (e.key === 'ArrowRight') nextPhoto();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === ' ') {
                e.preventDefault();
                toggleSlideshow();
            }
            if (e.key.toLowerCase() === 'f') {
                if (fullscreenBtn) fullscreenBtn.click();
            }
        }
        
        if (e.key.toLowerCase() === 'm') {
            toggleMusic();
        }
        
        if (e.key === 'Escape') {
            if (!videoLightbox.classList.contains('hidden')) {
                closeVideo();
            }
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    });

    // --- Firebase and Bhav Mode Logic ---
    const bhavForm = document.getElementById('bhavForm');
    const bhavList = document.getElementById('bhavList');
    const STORAGE_KEY = 'maa_smriti_bhavs';

    // REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIG
    const firebaseConfig = {
        apiKey: "AIzaSyARPXG2TzKDASm7nidx80F1gXCTqy1IFlY",
        authDomain: "maa-memory.firebaseapp.com",
        projectId: "maa-memory",
        storageBucket: "maa-memory.firebasestorage.app",
        messagingSenderId: "984263730957",
        appId: "1:984263730957:web:08f5c50a34270f706a7244",
        measurementId: "G-QX2L45FLXV"
    };

    let db = null;
    let isFirebaseConfigured = false;

    // Check if Firebase is actually configured (user replaced placeholders)
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            isFirebaseConfigured = true;
        } catch (e) {
            console.error("Firebase initialization error:", e);
        }
    }

    let allBhavsData = []; // Store all bhavs for search
    let bookFlipInstance = null;

    async function loadBhavs() {
        const flipBookContainer = document.getElementById('flipBookContainer');
        if (!flipBookContainer) return;
        
        let savedBhavs = [];

        if (isFirebaseConfigured) {
            try {
                const snapshot = await db.collection("bhavs").orderBy("timestamp", "asc").get();
                snapshot.forEach((doc) => {
                    savedBhavs.push(doc.data());
                });
                savedBhavs.reverse();
            } catch (error) {
                console.error("Error loading from Firebase:", error);
                savedBhavs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').reverse();
            }
        } else {
            savedBhavs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').reverse();
        }

        allBhavsData = savedBhavs;
        renderBook(allBhavsData);
    }

    function renderBook(bhavsToRender) {
        const flipBookContainer = document.getElementById('flipBookContainer');
        if (!flipBookContainer) return;
        
        // Destroy previous instance if exists
        if (bookFlipInstance) {
            bookFlipInstance.destroy();
            bookFlipInstance = null;
        }
        
        flipBookContainer.innerHTML = '';
        
        // Create cover page
        let pagesHtml = `
            <div class="page page-cover" data-density="hard">
                <div class="book-page-content" style="justify-content:center; align-items:center;">
                    <img src="assets/photos/Gemini_Generated_Image_jj7tyjjj7tyjjj7t.png" class="book-header-photo" style="width: 100px; height: 100px; margin-bottom: 20px;">
                    <h3 class="neon-text mt-6" style="font-size: 1.8rem;">श्रीमती अन्नपूर्णा देवी</h3>
                    <h3 class="neon-text mt-2">स्मृति पुस्तक</h3>
                    <p class="text-center mt-6" style="color:#0ff; font-style:italic;">आपकी स्मृतियाँ हमारे साथ हमेशा जीवित रहेंगी।</p>
                </div>
            </div>
        `;
        
        if (bhavsToRender.length === 0) {
            pagesHtml += `
                <div class="page">
                    <div class="watermark">ॐ शांति</div>
                    <div class="book-page-content">
                        <img src="assets/photos/Gemini_Generated_Image_jj7tyjjj7tyjjj7t.png" class="book-header-photo">
                        <p class="text-center mt-8" style="color: rgba(0,255,255,0.7); font-style: italic;">अभी तक कोई भाव समर्पित नहीं किया गया है।</p>
                    </div>
                </div>
            `;
        } else {
            bhavsToRender.forEach((bhav, index) => {
                const dateObj = new Date(bhav.timestamp);
                const dateStr = dateObj.toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });
                const locStr = bhav.location ? bhav.location : '';

                pagesHtml += `
                    <div class="page">
                        <div class="watermark">ॐ शांति</div>
                        <div class="book-page-content">
                            <img src="assets/photos/Gemini_Generated_Image_jj7tyjjj7tyjjj7t.png" class="book-header-photo">
                            <p style="white-space: pre-wrap; margin-top: 1rem; margin-bottom: 1rem; color: #fff; line-height: 1.6; font-size:1.1rem; flex-grow:1; overflow-y:auto;">${bhav.message}</p>
                            
                            <div style="font-size: 0.85rem; color: #0ff; border-top: 1px solid rgba(0,255,255,0.3); padding-top:10px;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <strong style="font-size:1rem;">— ${bhav.name}</strong>
                                    <span>${dateStr}</span>
                                </div>
                                ${locStr ? `<div style="text-align:left; margin-top:5px; color:rgba(0,255,255,0.7);">📍 ${locStr}</div>` : ''}
                            </div>
                            <div class="page-number">Page ${index + 1}</div>
                        </div>
                    </div>
                `;
            });
        }
        
        // Back cover
        pagesHtml += `
            <div class="page page-cover" data-density="hard">
                <div class="book-page-content" style="justify-content:center; align-items:center;">
                    <h3 class="neon-text" style="font-size: 1.5rem;">ॐ शान्तिः शान्तिः शान्तिः॥</h3>
                </div>
            </div>
        `;
        
        flipBookContainer.innerHTML = pagesHtml;
        
        // Initialize StPageFlip
        if (typeof St !== 'undefined' && St.PageFlip) {
            bookFlipInstance = new St.PageFlip(flipBookContainer, {
                width: 350,
                height: 500,
                size: "stretch",
                minWidth: 300,
                maxWidth: 450,
                minHeight: 400,
                maxHeight: 650,
                maxShadowOpacity: 0.5,
                showCover: true,
                mobileScrollSupport: false,
                usePortrait: true
            });
            bookFlipInstance.loadFromHTML(flipBookContainer.querySelectorAll('.page'));
        }
    }
    
    // Search Functionality
    const searchBookInput = document.getElementById('searchBookInput');
    if (searchBookInput) {
        searchBookInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if (!term) {
                renderBook(allBhavsData);
                return;
            }
            
            const filtered = allBhavsData.filter(bhav => {
                const text = (bhav.name + " " + (bhav.location || "") + " " + bhav.message).toLowerCase();
                return text.includes(term);
            });
            
            renderBook(filtered);
        });
    }

    if (bhavForm) {
        bhavForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = bhavForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            const nameInput = document.getElementById('bhavName').value.trim();
            const locInput = document.getElementById('bhavLocation').value.trim();
            const messageInput = document.getElementById('bhavMessage').value.trim();
            
            if (nameInput && messageInput) {
                submitBtn.innerText = "समर्पित हो रहा है...";
                submitBtn.disabled = true;

                const newBhav = {
                    name: nameInput,
                    location: locInput,
                    message: messageInput,
                    timestamp: new Date().toISOString()
                };
                
                if (isFirebaseConfigured) {
                    try {
                        await db.collection("bhavs").add(newBhav);
                    } catch (error) {
                        console.error("Error saving to Firebase:", error);
                        // Save locally as fallback
                        const savedBhavs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                        savedBhavs.push(newBhav);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBhavs));
                    }
                } else {
                    const savedBhavs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                    savedBhavs.push(newBhav);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBhavs));
                }
                
                bhavForm.reset();
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                loadBhavs();
            }
        });
        
        loadBhavs();
    }

    // --- QR Code Generation ---
    const qrContainer = document.getElementById('qrCodeContainer');
    if (qrContainer && typeof QRCode !== 'undefined') {
        const currentUrl = window.location.href.split('#')[0]; // basic clean url
        new QRCode(qrContainer, {
            text: currentUrl,
            width: 150,
            height: 150,
            colorDark : "#AA8222",
            colorLight : "#FDFBF7",
            correctLevel : QRCode.CorrectLevel.H
        });
    }
});
