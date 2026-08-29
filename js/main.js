/* ==========================================================================
   RAKESH.EDIT PORTFOLIO - INTERACTIVE LOGIC (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  }

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
