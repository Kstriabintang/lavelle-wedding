/* =========================================================
   Demo KLASIK — interaksi (vanilla JS)
   Semua ISI undangan diambil dari ./data.js (window.LAVELLE).
   File ini mengatur cara kerjanya — biasanya tidak perlu diubah.
   ========================================================= */

// ====== Ambil data undangan ======
const D = window.LAVELLE || {};

// ====== Isi undangan dari data ======
(function applyData() {
    if (!window.LAVELLE) return; // kalau data.js tak ada, biarkan isi bawaan HTML
    const $ = (id) => document.getElementById(id);
    const setText = (id, val) => { const el = $(id); if (el != null && val != null) el.textContent = val; };
    const setHTML = (id, val) => { const el = $(id); if (el != null && val != null) el.innerHTML = val; };

    // Judul tab & deskripsi
    if (D.meta) {
        if (D.meta.title) document.title = D.meta.title;
        const md = document.querySelector('meta[name="description"]');
        if (md && D.meta.description) md.setAttribute('content', D.meta.description);
    }

    // Nama pasangan (semua tempat yang pakai class .lv-names)
    if (D.couple && D.couple.display) {
        document.querySelectorAll('.lv-names').forEach((el) => { el.textContent = D.couple.display; });
        // Hero: pakai pemisah "&" yang dihias
        const heroNames = $('lv-hero-names');
        if (heroNames) {
            const parts = D.couple.display.split('&');
            heroNames.innerHTML = parts.length === 2
                ? `${parts[0].trim()} <span class="amp">&amp;</span> ${parts[1].trim()}`
                : D.couple.display;
        }
    }

    // Tanggal
    if (D.date) {
        setText('lv-cover-date', D.date.display);
        setText('lv-hero-date', D.date.display);
        setText('lv-married-date', D.date.display);
        setHTML('lv-hero-date-after', 'Telah menikah &middot; ' + (D.date.display || ''));
    }

    // Kutipan / ayat
    if (D.quote) {
        setText('lv-quote', '"' + (D.quote.text || '') + '"');
        setHTML('lv-quote-src', '&mdash; ' + (D.quote.source || ''));
    }

    // Mempelai
    const setPerson = (who, p) => {
        if (!p) return;
        const photo = $(`lv-${who}-photo`);
        if (photo) {
            if (p.photo) {
                photo.textContent = '';
                photo.style.backgroundImage = `url('${p.photo}')`;
                photo.style.backgroundSize = 'cover';
                photo.style.backgroundPosition = 'center';
                photo.classList.add('has-photo');
            } else if (p.initial) {
                photo.textContent = p.initial;
            }
        }
        setText(`lv-${who}-name`, p.full);
        setHTML(`lv-${who}-parents`, p.parents);
        const ig = $(`lv-${who}-ig`);
        if (ig && p.ig) { ig.href = p.ig; ig.target = '_blank'; ig.rel = 'noopener'; }
    };
    if (D.couple) { setPerson('bride', D.couple.bride); setPerson('groom', D.couple.groom); }

    // Rangkaian acara
    if (Array.isArray(D.events) && D.events.length) {
        const box = $('lv-events');
        if (box) {
            box.innerHTML = D.events.map((ev) => {
                const link = ev.map
                    ? `href="${ev.map}" target="_blank" rel="noopener"`
                    : `href="#"`;
                return `<div class="event-card reveal">
                    <div class="ic"><i class="fa-solid ${ev.icon || 'fa-ring'}"></i></div>
                    <h3>${ev.title || ''}</h3>
                    <p>${ev.date || ''}<br>${ev.time || ''}<br>${ev.venue || ''}</p>
                    <a class="btn-map" ${link}><i class="fa-solid fa-location-dot"></i> Lihat Lokasi</a>
                </div>`;
            }).join('');
        }
    }

    // Galeri (foto utama + foto tambahan khusus mode kenangan)
    if (Array.isArray(D.gallery)) {
        const grid = $('lv-gallery');
        if (grid) {
            const main = D.gallery.map((src) => `<div class="ph"><img src="${src}" alt="Momen" loading="lazy"></div>`);
            const after = (D.galleryAfter || []).map((src) => `<div class="ph phase-after"><img src="${src}" alt="Dokumentasi" loading="lazy"></div>`);
            grid.innerHTML = main.concat(after).join('');
        }
    }

    // Penutup
    setText('lv-closing', D.closing);
})();

// ====== Kelopak/daun melayang ======
(function spawnPetals() {
    const wrap = document.getElementById('petals');
    if (!wrap) return;
    const icons = ['fa-leaf', 'fa-spa', 'fa-fan'];
    const colors = ['#d9a7a7', '#9aa988', '#c0a35e'];
    for (let i = 0; i < 16; i++) {
        const el = document.createElement('i');
        el.className = 'fa-solid ' + icons[Math.floor(Math.random() * icons.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (10 + Math.random() * 18) + 'px';
        el.style.animationDuration = (10 + Math.random() * 12) + 's';
        el.style.animationDelay = -(Math.random() * 16) + 's';
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
        wrap.appendChild(el);
    }
})();

// ====== Nama tamu dari ?to= ======
const _params = new URLSearchParams(location.search);
const to = _params.get('to');
if (to) document.getElementById('guestName').textContent = decodeURIComponent(to);

// ====== Fase otomatis: Undangan (before) <-> Kenangan (after) ======
// Setelah tanggal afterIso terlewati, web otomatis jadi mode kenangan/dokumentasi.
// Preview manual: tambah ?mode=after atau ?mode=before di URL.
const AFTER_AT = new Date((D.date && D.date.afterIso) || '2026-12-23T00:00:00+07:00').getTime();
const _mode = _params.get('mode');
const isAfter = _mode === 'after' || (_mode !== 'before' && Date.now() > AFTER_AT);
document.body.classList.add(isAfter ? 'is-after' : 'is-before');
if (isAfter) {
    const ob = document.getElementById('openBtn');
    if (ob) ob.innerHTML = '<i class="fa-regular fa-images"></i> Buka Kenangan';
}

// ====== Audio / backsound ======
const audio = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');
const TARGET_VOLUME = (D.music && typeof D.music.volume === 'number') ? D.music.volume : 0.75;
const START_AT = (D.music && typeof D.music.startAt === 'number') ? D.music.startAt : 31;
if (D.music && D.music.src) audio.src = D.music.src;
let fadeTimer;

// ulang dari START_AT saat lagu selesai (loop manual)
audio.addEventListener('ended', () => {
    audio.currentTime = START_AT;
    audio.play().catch(() => {});
});

// fade volume halus (masuk/keluar) — kesan elegan
function fadeTo(target, onDone) {
    clearInterval(fadeTimer);
    const step = (target - audio.volume) / 22;
    fadeTimer = setInterval(() => {
        let v = audio.volume + step;
        if (step === 0 || (step > 0 && v >= target) || (step < 0 && v <= target)) {
            v = target;
            clearInterval(fadeTimer);
            if (onDone) onDone();
        }
        audio.volume = Math.min(1, Math.max(0, v));
    }, 70);
}
function playMusic() {
    audio.volume = 0;
    if (audio.currentTime < START_AT) {
        try { audio.currentTime = START_AT; } catch (e) {}
    }
    audio.play().then(() => {
        if (audio.currentTime < START_AT) audio.currentTime = START_AT;
        musicBtn.classList.add('playing');
        fadeTo(TARGET_VOLUME);
    }).catch(() => {}); // diabaikan bila browser blokir; tamu bisa tekan tombol musik
}
function pauseMusic() {
    musicBtn.classList.remove('playing');
    fadeTo(0, () => audio.pause());
}
function toggleMusic() { audio.paused ? playMusic() : pauseMusic(); }
musicBtn.addEventListener('click', toggleMusic);

// ====== Buka undangan ======
const cover = document.getElementById('cover');
document.getElementById('openBtn').addEventListener('click', () => {
    cover.classList.add('open');
    document.body.classList.remove('locked');
    window.scrollTo({ top: 0 });
    playMusic(); // musik mulai saat undangan dibuka (gesture pengguna)
});

// ====== Countdown ======
const target = new Date((D.date && D.date.iso) || '2026-12-20T08:00:00+07:00').getTime();
const pad = (n) => String(n).padStart(2, '0');
function tick() {
    const diff = target - Date.now();
    if (diff <= 0) return;
    document.getElementById('cd-d').textContent = Math.floor(diff / 86400000);
    document.getElementById('cd-h').textContent = pad(Math.floor(diff % 86400000 / 3600000));
    document.getElementById('cd-m').textContent = pad(Math.floor(diff % 3600000 / 60000));
    document.getElementById('cd-s').textContent = pad(Math.floor(diff % 60000 / 1000));
}
tick();
setInterval(tick, 1000);

// ====== Reveal saat scroll ======
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
