/* ===================================================
   LAVELLE — interaksi ringan, vanilla JS
   =================================================== */

// --- Konfigurasi mudah diubah ---
const WHATSAPP_NUMBER = '6285264402640';   // Admin 1 (085264402640) — dipakai tombol paket & tombol melayang
const WHATSAPP_NUMBER_2 = '6282299913592'; // Admin 2 (082299913592)
const DEMO_LINKS = {
    classic: './demo/klasik/?to=Tamu%20Undangan',  // demo undangan klasik
    modern: './demo/modern/?to=Tamu%20Undangan',   // demo undangan modern
};

// --- Preloader "Love Loading": sembunyikan setelah halaman siap (min. 1.4s) ---
const HIDE_PRELOADER = () => {
    const pl = document.getElementById('preloader');
    if (!pl) return;
    pl.classList.add('done');
    setTimeout(() => pl.remove(), 800);
};
const _start = Date.now();
window.addEventListener('load', () => {
    const elapsed = Date.now() - _start;
    setTimeout(HIDE_PRELOADER, Math.max(0, 1400 - elapsed));
});
// fallback bila event load tidak terpicu
setTimeout(HIDE_PRELOADER, 4000);

// --- Hati melayang di background ---
function spawnHearts(count = 14) {
    const wrap = document.getElementById('hearts');
    if (!wrap) return;
    for (let i = 0; i < count; i++) {
        const h = document.createElement('i');
        h.className = 'fa-solid fa-heart';
        const size = 10 + Math.random() * 22;
        h.style.left = Math.random() * 100 + 'vw';
        h.style.fontSize = size + 'px';
        h.style.animationDuration = 9 + Math.random() * 12 + 's';
        h.style.animationDelay = -(Math.random() * 14) + 's';
        h.style.color = Math.random() > 0.5 ? '#d8c39a' : '#aeb892';
        wrap.appendChild(h);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    spawnHearts();
    const nav = document.getElementById('nav');
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');

    // Navbar berubah saat scroll
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Toggle menu mobile
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', () => navLinks.classList.remove('open'))
    );

    // Reveal saat masuk viewport
    const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                io.unobserve(e.target);
            }
        }),
        { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    // Tahun footer otomatis
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Tombol paket -> WhatsApp dengan pesan otomatis
    document.querySelectorAll('[data-plan]').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            const plan = btn.getAttribute('data-plan');
            const text = `Halo Admin Lavelle, saya tertarik dengan paket *${plan}* untuk undangan pernikahan digital. Boleh dibantu informasi selengkapnya?`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
        });
    });

    // Link demo
    document.querySelectorAll('[data-demo]').forEach((a) => {
        const key = a.getAttribute('data-demo');
        const url = DEMO_LINKS[key];
        if (url && url !== '#') {
            a.setAttribute('href', url); // buka di tab yang sama
        } else {
            a.addEventListener('click', (ev) => {
                ev.preventDefault();
                const text = 'Halo Admin Lavelle, saya ingin melihat contoh undangan pernikahan digital. Boleh dikirimkan demonya?';
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
            });
        }
    });
});
