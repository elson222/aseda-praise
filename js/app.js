/* ============================================================
   ASEDA PRAISE — Application JavaScript Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initScrollAnimations();
  initModals();
});

// 1. Live Countdown Timer
function initCountdown() {
  // Target date for Aseda Praise 2026
  const targetDate = new Date('2026-11-20T17:00:00+00:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-mins');
    const elSecs = document.getElementById('cd-secs');

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(mins).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// 2. Scroll Reveal Animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// 3. Modal Dialogs (Free Admission & Calendar Add)
function initModals() {
  const modalOverlay = document.getElementById('attend-modal');
  const openBtns = document.querySelectorAll('.open-attend-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modalOverlay) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  // Handle Free Attendance Form Submit
  const attendForm = document.getElementById('attend-form');
  if (attendForm) {
    attendForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('attendee-name').value || 'Worshipper';
      alert(`Hallelujah, ${name}! Your free attendance confirmation for Aseda Praise has been saved. We look forward to worshipping together in Tarkwa!`);
      modalOverlay.classList.remove('active');
    });
  }
}
