/* =========================================================
   Demo MODERN — interaksi (vanilla JS + AOS)
   Backsound: Until I Found You - Stephen Sanchez
   ========================================================= */

// ====== Gold dust melayang ======
(function spawnDust() {
    const wrap = document.getElementById('dust');
    if (!wrap) return;
    const icons = ['fa-star', 'fa-heart', 'fa-certificate'];
    for (let i = 0; i < 18; i++) {
        const el = document.createElement('i');
        el.className = 'fa-solid ' + icons[Math.floor(Math.random() * icons.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (7 + Math.random() * 14) + 'px';
        el.style.animationDuration = (10 + Math.random() * 12) + 's';
        el.style.animationDelay = -(Math.random() * 16) + 's';
        wrap.appendChild(el);
    }
})();

// ====== Nama tamu dari ?to= ======
const _params = new URLSearchParams(location.search);
const to = _params.get('to');
if (to) document.getElementById('guestName').textContent = decodeURIComponent(to);

// ====== Fase otomatis: Undangan (before) <-> Kenangan (after) ======
// Undangan & buku ucapan tetap aktif sampai H+2 (2 hari setelah nikah).
// Setelah AFTER_AT terlewati, web otomatis berubah jadi mode kenangan/dokumentasi (read-only).
// Hari-H: 14 Feb 2027 -> H+2 berakhir di awal 17 Feb 2027.
const AFTER_AT = new Date('2027-02-17T00:00:00+07:00').getTime();
// Preview manual: tambah ?mode=after atau ?mode=before di URL (untuk demo tanpa menunggu tanggal).
const _mode = _params.get('mode');
const isAfter = _mode === 'after' || (_mode !== 'before' && Date.now() > AFTER_AT);
document.body.classList.add(isAfter ? 'is-after' : 'is-before');
if (isAfter) {
    const ob = document.getElementById('openBtn');
    if (ob) ob.innerHTML = '<i class="fa-regular fa-images"></i> Buka Kenangan';
}

// ====== AOS ======
AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic' });

// ====== Audio / backsound (Marry You - violin cover) ======
const audio = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');
const TARGET_VOLUME = 0.75; // agak besar agar violin terdengar jelas & syahdu
let fadeTimer;

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
    audio.play().then(() => {
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
    playMusic();
    setTimeout(() => AOS.refresh(), 200);
});

// ====== Countdown ======
const target = new Date('2027-02-14T09:00:00+07:00').getTime();
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

// ====== RSVP (UI demo) ======
document.getElementById('rsvpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('rsvpOk').classList.add('show');
    e.target.querySelector('.btn').innerHTML = '<i class="fa-solid fa-check"></i> Terkirim';
});

// ====== Buku ucapan (client-side) ======
const wishesEl = document.getElementById('wishes');
const seed = [
    { n: 'Rizky Maulana', t: '2 menit lalu', m: 'Selamat ya bro Bima! Akhirnya sah juga. Semoga jadi keluarga sakinah, mawaddah, warahmah 🤍' },
    { n: 'Putri Salsabila', t: '11 menit lalu', m: 'Anindya cantik bangett! Selamat menempuh hidup baru, semoga langgeng sampai jannah ya 😍' },
    { n: 'Dewi & Andre', t: '34 menit lalu', m: 'Turut berbahagia atas pernikahan kalian. Semoga menjadi keluarga yang harmonis dan penuh cinta.' },
    { n: 'Ust. Fauzi', t: '1 jam lalu', m: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Aamiin." },
    { n: 'Tante Lina', t: '3 jam lalu', m: 'Nggak nyangka udah gede dan nikah. Bahagia terus ya nak, sehat selalu buat kalian berdua.' },
    { n: 'Geng Arisan', t: 'kemarin', m: 'Cieee yang udah halal! Selamat ya, jangan lupa traktirannya 😆 Semoga cepet dikasih momongan!' },
];
function renderWish({ n, m, t }, prepend) {
    const d = document.createElement('div');
    d.className = 'wish glass';
    d.innerHTML = `<b>${n}</b><span class="at">${t || 'baru saja'}</span><p>${m}</p>`;
    wishesEl[prepend ? 'prepend' : 'append'](d);
}
seed.forEach((w) => renderWish(w, false));
document.getElementById('wishForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const n = (document.getElementById('w-name').value.trim() || 'Tamu').replace(/</g, '');
    const m = document.getElementById('w-msg').value.trim().replace(/</g, '');
    if (!m) return;
    renderWish({ n, m }, true);
    e.target.reset();
});

// ====== Salin nomor rekening ======
document.querySelectorAll('.btn-copy').forEach((b) => b.addEventListener('click', () => {
    const txt = document.getElementById(b.dataset.copy).textContent.replace(/\s/g, '');
    navigator.clipboard?.writeText(txt);
    const old = b.innerHTML;
    b.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin';
    setTimeout(() => (b.innerHTML = old), 1600);
}));
