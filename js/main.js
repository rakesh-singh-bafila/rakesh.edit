/* ==========================================================================
   RAKESH.EDIT PORTFOLIO - INTERACTIVE LOGIC (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* 0. PRELOADER SCREEN & INITIAL VIDEOS LOADING CONTROLLER */
  const preloader = document.getElementById('preloader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderStatus = document.getElementById('loader-status');

  // Find the initial 3 visible cards' preview videos (under influencers tab)
  const initialCards = Array.from(document.querySelectorAll('.reel-card')).slice(0, 3);
  const initialVideos = initialCards.map(card => card.querySelector('.reel-video-preview')).filter(Boolean);
  
  let loadedCount = 0;
  const totalToLoad = initialVideos.length;

  function updateLoaderProgress() {
    loadedCount++;
    const percentage = Math.min((loadedCount / totalToLoad) * 100, 100);
    if (loaderBar) loaderBar.style.width = `${percentage}%`;
    if (loaderStatus) loaderStatus.textContent = `Loading Visuals (${loadedCount}/${totalToLoad})`;

    if (loadedCount >= totalToLoad) {
      hidePreloader();
    }
  }

  function hidePreloader() {
    if (preloader && !preloader.classList.contains('fade-out')) {
      if (loaderBar) loaderBar.style.width = '100%';
      if (loaderStatus) loaderStatus.textContent = 'Ready';
      
      setTimeout(() => {
        preloader.classList.add('fade-out');
        // Once preloader starts fading out, play all visible previews
        playVisiblePreviews();
      }, 300);
    }
  }

  // Bind loading handlers to the initial 3 videos
  if (totalToLoad > 0) {
    initialVideos.forEach(video => {
      // Set src from data-src immediately to begin download
      if (video.getAttribute('data-src')) {
        video.src = video.getAttribute('data-src');
        video.load();
      }

      // Check state
      if (video.readyState >= 2) {
        updateLoaderProgress();
      } else {
        video.addEventListener('loadeddata', updateLoaderProgress);
        video.addEventListener('error', updateLoaderProgress);
      }
    });
  } else {
    hidePreloader();
  }

  // Safety timer to prevent locking the screen on very slow connections
  setTimeout(hidePreloader, 4000);

  /* 1. NAVBAR SCROLL EFFECT */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* 2. PORTFOLIO FILTER TABS WITH INITIAL 3-CARD LIMIT & SHOW ALL TOGGLE */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const reelCards = document.querySelectorAll('.reel-card');
  const showAllBtn = document.getElementById('show-all-btn');
  const showAllContainer = document.getElementById('show-all-container');

  let isExpanded = false;
  let currentFilter = 'influencers'; // default tab

  function updateCardVisibility() {
    let matchingCount = 0;

    reelCards.forEach(card => {
      const categories = card.getAttribute('data-category');
      const isMatch = (currentFilter === 'all' || categories.includes(currentFilter));

      if (isMatch) {
        matchingCount++;
        if (isExpanded || matchingCount <= 3) {
          card.classList.remove('hidden');
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.classList.add('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
        }
      } else {
        card.classList.add('hidden');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
      }
    });

    // Toggle visibility of "Show All" button if total matching cards > 3
    if (matchingCount > 3) {
      if (showAllContainer) showAllContainer.style.display = 'block';
      if (showAllBtn) {
        showAllBtn.textContent = isExpanded ? 'Show Less ↑' : `Show All (${matchingCount}) Projects ↓`;
      }
    } else {
      if (showAllContainer) showAllContainer.style.display = 'none';
    }

    // Play visible and pause hidden previews
    playVisiblePreviews();
  }

  function playVisiblePreviews() {
    // Play visible videos
    const visiblePreviews = document.querySelectorAll('.reel-card:not(.hidden) .reel-video-preview');
    visiblePreviews.forEach(video => {
      // Lazy load: copy data-src to src if not loaded yet
      if (!video.src && video.getAttribute('data-src')) {
        video.src = video.getAttribute('data-src');
        video.autoplay = true;
        video.load();
      }

      if (video.paused) {
        // If readyState is ready, play immediately; otherwise, let autoplay and canplay fallback handle it once loaded
        if (video.readyState >= 2) {
          video.play().catch(err => {
            console.log("Autoplay preview play error handled:", err);
          });
        } else {
          // Fallback listener in case browser autoplay doesn't trigger on source load
          video.addEventListener('canplay', () => {
            video.play().catch(e => console.log("Canplay autoplay preview error handled:", e));
          }, { once: true });
        }
      }
    });

    // Pause hidden videos
    const hiddenPreviews = document.querySelectorAll('.reel-card.hidden .reel-video-preview');
    hiddenPreviews.forEach(video => {
      if (!video.paused) {
        video.pause();
      }
    });
  }

  // Interaction triggers to unlock autoplay on mobile/phone
  const unlockAutoplay = () => {
    playVisiblePreviews();
    window.removeEventListener('scroll', unlockAutoplay);
    window.removeEventListener('touchstart', unlockAutoplay);
    document.removeEventListener('click', unlockAutoplay);
  };
  window.addEventListener('scroll', unlockAutoplay);
  window.addEventListener('touchstart', unlockAutoplay);
  document.addEventListener('click', unlockAutoplay);

  // Filter Tab Click Events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.getAttribute('data-filter');
      isExpanded = false; // Reset expansion when changing tab
      updateCardVisibility();
    });
  });

  // "Show All Projects" Button Click Event
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      updateCardVisibility();
    });
  }

  // Initial call
  updateCardVisibility();

  /* 3. LIGHTBOX VIDEO MODAL WITH REAL VIDEO PLAYBACK */
  const videoModal = document.getElementById('video-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalVideoElement = document.getElementById('modal-video-element');
  const modalVideoSource = document.getElementById('modal-video-source');
  const modalTitleText = document.getElementById('modal-title-text');
  const modalClientText = document.getElementById('modal-client-text');

  reelCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-video-title');
      const client = card.getAttribute('data-client');
      const videoUrl = card.getAttribute('data-video-url');

      modalTitleText.textContent = title || 'Video Showcase';
      modalClientText.textContent = client || 'Rakesh.EDIT';

      if (videoUrl) {
        modalVideoSource.setAttribute('src', videoUrl);
        modalVideoElement.load();
      }

      videoModal.classList.add('active');
      modalVideoElement.play().catch(e => console.log('Autoplay handled:', e));
    });
  });

  function closeModal() {
    videoModal.classList.remove('active');
    modalVideoElement.pause();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeModal();
    }
  });

  /* 4. FAQ ACCORDION INTERACTION */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  /* 5. COPY EMAIL BUTTON */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'rakeshbafila.7060@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied! ✓';
        copyEmailBtn.style.background = '#10b981';
        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
          copyEmailBtn.style.background = '';
        }, 2500);
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    });
  }

});
