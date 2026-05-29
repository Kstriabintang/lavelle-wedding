/* =========================================================
   Demo KLASIK — interaksi (vanilla JS)
   Backsound: Frank Sinatra - My Way
   ========================================================= */

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
// Undangan tetap aktif sampai H+2 (2 hari setelah nikah).
// Setelah AFTER_AT terlewati, web otomatis berubah jadi mode kenangan/dokumentasi.
// Hari-H: 20 Des 2026 -> H+2 berakhir di awal 23 Des 2026.
const AFTER_AT = new Date('2026-12-23T00:00:00+07:00').getTime();
// Preview manual: tambah ?mode=after atau ?mode=before di URL.
const _mode = _params.get('mode');
const isAfter = _mode === 'after' || (_mode !== 'before' && Date.now() > AFTER_AT);
document.body.classList.add(isAfter ? 'is-after' : 'is-before');
if (isAfter) {
    const ob = document.getElementById('openBtn');
    if (ob) ob.innerHTML = '<i class="fa-regular fa-images"></i> Buka Kenangan';
}

// ====== Audio / backsound (Until I Found You - violin cover) ======
const audio = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');
const TARGET_VOLUME = 0.75; // agak besar agar violin terdengar jelas & syahdu
const START_AT = 31;        // mulai dari detik 31 (lewati intro yang panjang)
let fadeTimer;

// ulang dari detik 31 saat lagu selesai (loop manual)
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
    // mulai dari detik 31 (set sebelum & sesudah play, agar pasti tersedia setelah metadata siap)
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
const target = new Date('2026-12-20T08:00:00+07:00').getTime();
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
