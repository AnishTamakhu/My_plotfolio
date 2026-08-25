// Mobile nav toggle and small UI behaviors
document.addEventListener('DOMContentLoaded', function(){
  // Year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if(navToggle && nav){
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });
    // Close nav when clicking a link (mobile)
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=> nav.classList.remove('open')));
  }

  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Simple reveal on scroll
  const revealElems = document.querySelectorAll('.card, .section h2, .hero');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('reveal');
      }
    });
  }, {threshold: 0.12});
  revealElems.forEach(e => io.observe(e));

  // Contact form submission
  (function(){
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(e){
      e.preventDefault();

      const name = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const message = form.querySelector('textarea[name="message"]').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
      }

      const payload = { name, email, message };

      try {
        if(submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        // Use a relative path so the site can call the Vercel Serverless Function at /api/contact
        const resp = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'omit'
        });

        const data = await resp.json().catch(() => ({}));

        if (resp.ok && data.success) {
          alert('Message sent — thank you!');
          form.reset();
        } else {
          alert('Error sending message: ' + (data.error || resp.statusText || 'Unknown'));
        }
      } catch (err) {
        alert('Network error: ' + err.message);
      } finally {
        if(submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send';
        }
      }
    });
  })();

});