// ── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://mrriqdjucenfcrykrlcs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_viCur_nFYScxHve6dVGcow_pPNHlbT7';

// ── WAITLIST FORM ────────────────────────────────────────────────────────────
async function handleWaitlist(e) {
  e.preventDefault();

  const email   = document.getElementById('waitlist-email').value.trim();
  const btn     = document.querySelector('.waitlist-btn');
  const btnText = document.getElementById('waitlist-btn-text');
  const success = document.getElementById('waitlist-success');

  if (!email || !email.includes('@')) return;

  btn.disabled  = true;
  btnText.textContent = 'Joining…';

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify({
        email,
        source: 'landing_page',
      }),
    });

    if (res.ok || res.status === 409) {
      // 409 = duplicate (already on list) — treat as success
      document.querySelector('.waitlist-form').style.display = 'none';
      success.style.display = 'block';
      incrementCounter();
    } else {
      throw new Error('Save failed');
    }
  } catch (err) {
    console.error('[UnMoot]', err);
    btnText.textContent = 'Try again';
    btn.disabled = false;
  }
}

function incrementCounter() {
  const el = document.getElementById('waitlist-counter');
  if (!el) return;
  const current = parseInt(el.textContent.replace(/\D/g, ''), 10);
  const next = (current + 1).toLocaleString();
  el.textContent = `${next} people`;
}

// ── SCROLL ANIMATIONS ────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.problem-card, .step, .trust-card, .data-card, .data-card-mini'
).forEach(el => {
  el.classList.add('animate-on-scroll');
  observer.observe(el);
});

// ── ANIMATE BARS ON SCROLL ───────────────────────────────────────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.data-bar-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = width; }, 100);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.data-card').forEach(el => barObserver.observe(el));

// ── INJECT SCROLL ANIMATION STYLES ──────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .problem-card:nth-child(2) { transition-delay: 0.1s; }
  .problem-card:nth-child(3) { transition-delay: 0.2s; }
  .trust-card:nth-child(2)   { transition-delay: 0.08s; }
  .trust-card:nth-child(3)   { transition-delay: 0.16s; }
  .trust-card:nth-child(4)   { transition-delay: 0.24s; }
`;
document.head.appendChild(style);
