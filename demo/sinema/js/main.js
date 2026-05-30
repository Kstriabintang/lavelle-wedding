/* =========================================================
   Lavelle — Demo "Sinema" (cinematic, scroll-based, banner 3D)
   Backsound: Marry You (violin cover)
   - Backdrop hidup: dedaunan + kelopak + debu cahaya (Canvas), parallax, tirai, kabut, lilin.
   - Tiap section = "banner" yang beranimasi 3D mengikuti scroll (engine sendiri, tanpa AOS).
   - Fitur undangan lengkap: fase, countdown, RSVP, buku ucapan, salin rekening.
   ========================================================= */
(function () {
    "use strict";

    var CFG = {
        bride: "Kirana", groom: "Arsa",
        weddingISO: "2027-06-12T08:00:00+07:00",
        afterISO: "2027-06-14T00:00:00+07:00"
    };

    var body = document.body;
    var params = new URLSearchParams(location.search);
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Nama tamu ?to= ---------- */
    var to = params.get("to");
    if (to) { try { to = decodeURIComponent(to.replace(/\+/g, " ")); } catch (e) {} document.getElementById("guestName").textContent = to; }

    /* ---------- Fase before/after ---------- */
    var AFTER_AT = new Date(CFG.afterISO).getTime();
    var mode = params.get("mode");
    var isAfter = mode === "after" || (mode !== "before" && Date.now() > AFTER_AT);
    body.classList.add(isAfter ? "is-after" : "is-before");
    if (isAfter) { var ob = document.getElementById("openBtn"); if (ob) ob.innerHTML = '<i class="fa-regular fa-images"></i> Buka Kenangan'; }

    /* ---------- Parallax pointer/gyro ---------- */
    var tx = 0, ty = 0, cx = 0, cy = 0;
    if (!reduceMotion) {
        window.addEventListener("pointermove", function (e) { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
        window.addEventListener("deviceorientation", function (e) { if (e.gamma == null) return; tx = Math.max(-1, Math.min(1, e.gamma / 35)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 35)); }, { passive: true });
    }

    /* ====================================================
       CANVAS — dedaunan + kelopak + debu cahaya
       ==================================================== */
    var canvas = document.getElementById("particles");
    var ctx = canvas.getContext("2d", { alpha: true });
    var W = 0, H = 0, DPR = 1, leaves = [], dust = [], running = true;
    function isMobile() { return Math.min(innerWidth, innerHeight) < 640; }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function resize() {
        DPR = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
        canvas.width = W * DPR; canvas.height = H * DPR; canvas.style.width = W + "px"; canvas.style.height = H + "px";
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    var LEAF = ["#cf9d52", "#a8772f", "#6f7d3a", "#b6602e", "#e8c879"], PETAL = ["#f4c9c0", "#e7a7a0", "#f3e2b6"];
    function makeLeaf() {
        var petal = Math.random() < 0.45;
        return { petal: petal, x: rand(0, W), y: rand(-H, -10), s: petal ? rand(7, 14) : rand(11, 22),
            vy: rand(22, 52), vx: rand(-14, 14), sway: rand(0.5, 1.4), ph: rand(0, 6.28),
            rot: rand(0, 6.28), vr: rand(-1.1, 1.1),
            col: petal ? PETAL[(Math.random() * PETAL.length) | 0] : LEAF[(Math.random() * LEAF.length) | 0], op: rand(0.6, 0.95) };
    }
    function makeDust() { return { x: rand(0, W), y: rand(0, H), r: rand(0.6, 2.1), vy: rand(-12, -3), vx: rand(-6, 6), tw: rand(0, 6.28), tws: rand(1.5, 3.5), op: rand(0.25, 0.85) }; }
    function seed() {
        leaves.length = 0; dust.length = 0; if (reduceMotion) return;
        var area = W * H, nL = Math.round(Math.min(isMobile() ? 20 : 40, area / 36000)), nD = Math.round(Math.min(isMobile() ? 40 : 85, area / 17000));
        for (var i = 0; i < nL; i++) { var l = makeLeaf(); l.y = rand(0, H); leaves.push(l); }
        for (var j = 0; j < nD; j++) dust.push(makeDust());
    }
    function drawLeaf(o) {
        ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot); ctx.globalAlpha = o.op; ctx.fillStyle = o.col; ctx.beginPath();
        if (o.petal) { ctx.moveTo(0, -o.s / 2); ctx.quadraticCurveTo(o.s / 2, 0, 0, o.s / 2); ctx.quadraticCurveTo(-o.s / 2, 0, 0, -o.s / 2); }
        else { ctx.moveTo(0, -o.s); ctx.quadraticCurveTo(o.s * 0.6, 0, 0, o.s); ctx.quadraticCurveTo(-o.s * 0.6, 0, 0, -o.s); }
        ctx.fill();
        if (!o.petal) { ctx.globalAlpha = o.op * 0.5; ctx.strokeStyle = "rgba(40,30,10,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -o.s); ctx.lineTo(0, o.s); ctx.stroke(); }
        ctx.restore();
    }

    /* ====================================================
       3D SCROLL ENGINE — gerakkan tiap banner mengikuti scroll
       ==================================================== */
    var fxEls = [].slice.call(document.querySelectorAll("[data-fx]"));
    var secs = [].slice.call(document.querySelectorAll(".scene .sec"));
    var fxDirty = true;
    window.addEventListener("scroll", function () { fxDirty = true; }, { passive: true });

    /* ---- Ganti foto + warna background tiap section (crossfade) ---- */
    var bdLayers = [document.getElementById("bdA"), document.getElementById("bdB")];
    var bdTint = document.getElementById("bdTint");
    var bdCur = 0, curBest = -1;
    function imgUrl(name) { return "url('../../img/mentahan/" + name + ".jpeg')"; }
    function setBg(name, tint) {
        if (name) {
            var nxt = bdLayers[bdCur ^ 1];
            nxt.style.backgroundImage = imgUrl(name);
            nxt.style.opacity = "1"; bdLayers[bdCur].style.opacity = "0"; bdCur ^= 1;
        }
        if (tint) bdTint.style.backgroundColor = tint;
    }
    // foto awal (section pertama) tanpa fade
    (function () {
        var first = secs[0];
        if (first && first.dataset.bg) { bdLayers[0].style.backgroundImage = imgUrl(first.dataset.bg); bdLayers[0].style.opacity = "1"; }
        if (first && first.dataset.tint) bdTint.style.backgroundColor = first.dataset.tint;
    })();

    function fxTransform(fx, t, a) {
        switch (fx) {
            case "hero":     return "translateY(" + (t * -28) + "px) rotateX(" + (t * 5) + "deg)";
            case "rise":
            case "up":       return "translateY(" + (t * 52) + "px) rotateX(" + (t * -12) + "deg) translateZ(" + (-a * 90) + "px)";
            case "down":     return "translateY(" + (t * -52) + "px) rotateX(" + (t * 12) + "deg) translateZ(" + (-a * 90) + "px)";
            case "left":     return "translateX(" + (t * -92) + "px) rotateY(" + (t * 14) + "deg) translateZ(" + (-a * 80) + "px)";
            case "right":    return "translateX(" + (t * 92) + "px) rotateY(" + (t * -14) + "deg) translateZ(" + (-a * 80) + "px)";
            case "zoom-in":  return "scale(" + (1 - a * 0.24).toFixed(3) + ") translateZ(" + (-a * 160) + "px) rotateX(" + (t * -5) + "deg)";
            case "zoom-out":
            case "zoom":     return "scale(" + (1 + a * 0.18).toFixed(3) + ") translateZ(" + (-a * 60) + "px) rotateX(" + (t * -5) + "deg)";
            case "slide-l":  return "translateX(" + (t * -72) + "px) rotateY(" + (t * 16) + "deg) translateZ(" + (-a * 70) + "px)";
            case "slide-r":  return "translateX(" + (t * 72) + "px) rotateY(" + (t * -16) + "deg) translateZ(" + (-a * 70) + "px)";
            case "flip":     return "rotateY(" + (t * 24) + "deg) rotateX(" + (t * -6) + "deg) translateZ(" + (-a * 120) + "px)";
            case "book":     return "rotateY(" + (t * 12) + "deg) rotateX(" + (t * -7) + "deg) translateZ(" + (-a * 80) + "px)";
            case "card":     return "rotateX(" + (t * 14) + "deg) translateZ(" + (-a * 60) + "px)";
            default:         return "translateY(" + (t * 40) + "px)";
        }
    }
    var railDots = [];
    function updateFx() {
        var vh = innerHeight, vc = vh * 0.5, i;
        // BACA semua rect dulu (hindari layout thrash), lalu TULIS
        var data = [];
        for (i = 0; i < fxEls.length; i++) {
            var el = fxEls[i], r = el.getBoundingClientRect();
            if (r.height === 0 && r.width === 0) { data.push(null); continue; }
            var t = (r.top + r.height / 2 - vc) / vh;
            t = Math.max(-1.1, Math.min(1.1, t));
            var a = Math.abs(t);
            var op = a < 0.32 ? 1 : Math.max(0, 1 - (a - 0.32) / 0.55);
            data.push({ fx: el.dataset.fx, t: t, a: a, op: op });
        }
        for (i = 0; i < fxEls.length; i++) {
            var d = data[i]; if (!d) continue;
            fxEls[i].style.transform = "perspective(1100px) " + fxTransform(d.fx, d.t, d.a);
            fxEls[i].style.opacity = d.op.toFixed(3);
        }
        // rail aktif: section terdekat ke tengah
        var best = 0, bestDist = 1e9;
        for (i = 0; i < secs.length; i++) {
            var rr = secs[i].getBoundingClientRect();
            var dist = Math.abs(rr.top + rr.height / 2 - vc);
            if (dist < bestDist) { bestDist = dist; best = i; }
        }
        for (i = 0; i < railDots.length; i++) railDots[i].classList.toggle("active", i === best);
        if (best !== curBest) { curBest = best; setBg(secs[best].dataset.bg, secs[best].dataset.tint); }
    }

    /* ====================================================
       LOOP UTAMA (partikel + parallax + engine)
       ==================================================== */
    var last = performance.now();
    var lastSY = window.scrollY || 0, swing = 0;
    function frame(now) {
        if (!running) { last = now; requestAnimationFrame(frame); return; }
        var dt = Math.min((now - last) / 1000, 0.05); last = now;
        cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
        document.documentElement.style.setProperty("--px", cx.toFixed(3));
        document.documentElement.style.setProperty("--py", cy.toFixed(3));

        // goyang pohon: didorong kecepatan scroll, lalu mereda halus
        if (!reduceMotion) {
            var sy = window.scrollY || 0, sv = sy - lastSY; lastSY = sy;
            var targetSwing = Math.max(-7, Math.min(7, sv * 0.06));
            swing += (targetSwing - swing) * 0.12;
            if (Math.abs(swing) < 0.01) swing = 0;
            document.documentElement.style.setProperty("--swing", swing.toFixed(3));
        }

        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = "lighter";
        for (var i = 0; i < dust.length; i++) {
            var dd = dust[i]; dd.x += (dd.vx + cx * 14) * dt; dd.y += dd.vy * dt; dd.tw += dd.tws * dt;
            if (dd.y < -10) { dd.y = H + 10; dd.x = rand(0, W); }
            if (dd.x < -10) dd.x = W + 10; else if (dd.x > W + 10) dd.x = -10;
            ctx.globalAlpha = dd.op * (0.55 + Math.sin(dd.tw) * 0.45); ctx.fillStyle = "rgba(255,224,160,1)";
            ctx.beginPath(); ctx.arc(dd.x, dd.y, dd.r, 0, 6.2832); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
        for (var k = 0; k < leaves.length; k++) {
            var o = leaves[k]; o.ph += dt * o.sway;
            o.x += (o.vx + Math.sin(o.ph) * 18 + cx * 10) * dt; o.y += o.vy * dt; o.rot += o.vr * dt;
            if (o.y > H + 28) { Object.assign(o, makeLeaf()); o.y = -24; }
            if (o.x < -34) o.x = W + 34; else if (o.x > W + 34) o.x = -34;
            drawLeaf(o);
        }
        ctx.globalAlpha = 1;

        if (fxDirty) { updateFx(); fxDirty = false; }
        requestAnimationFrame(frame);
    }
    resize(); seed();
    window.addEventListener("resize", function () { resize(); seed(); fxDirty = true; }, { passive: true });
    document.addEventListener("visibilitychange", function () { running = !document.hidden; fxDirty = true; });
    updateFx();
    requestAnimationFrame(frame);

    /* ---------- Ornamen sudut bingkai + hemat animasi (in-view) ---------- */
    (function () {
        var corners = ["tl", "tr", "bl", "br"];
        var frames = document.querySelectorAll(".bingkai");
        frames.forEach(function (b) {
            corners.forEach(function (c) {
                var i = document.createElement("i");
                i.className = "bingkai__c bingkai__c--" + c;
                i.setAttribute("aria-hidden", "true");
                b.appendChild(i);
            });
        });
        // animasi bingkai hanya aktif saat terlihat (hemat CPU/baterai)
        if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) { e.target.classList.toggle("in-view", e.isIntersecting); });
            }, { rootMargin: "120px 0px" });
            frames.forEach(function (b) { io.observe(b); });
        } else {
            frames.forEach(function (b) { b.classList.add("in-view"); });
        }
    })();

    /* ---------- Rail dots ---------- */
    (function () {
        var rail = document.getElementById("rail");
        secs.forEach(function (s) {
            var dot = document.createElement("span"); dot.className = "dot";
            dot.addEventListener("click", function () { s.scrollIntoView({ behavior: "smooth", block: "center" }); });
            rail.appendChild(dot); railDots.push(dot);
        });
    })();

    /* ====================================================
       AUDIO (fade)
       ==================================================== */
    var audio = document.getElementById("bgm"), musicBtn = document.getElementById("musicBtn"), TARGET_VOLUME = 0.75, fadeTimer;
    var AUDIO_START = 22;   // mulai (& tiap loop) di detik ke-22
    var jumpedToStart = false;
    // Loncat ke AUDIO_START HANYA bila audio sudah bisa di-seek ke sana
    // (mencegah stall/diam di server tanpa Range request). Sebelum itu, biar main dari 0.
    function trySeekStart() {
        if (jumpedToStart) return;
        try {
            var sk = audio.seekable;
            if (sk && sk.length && sk.end(sk.length - 1) >= AUDIO_START + 0.3) {
                audio.currentTime = AUDIO_START;
                jumpedToStart = true;
            }
        } catch (e) {}
    }
    audio.addEventListener("progress", trySeekStart);
    audio.addEventListener("canplay", trySeekStart);
    audio.addEventListener("canplaythrough", trySeekStart);
    // loop manual: tiap putaran kembali ke AUDIO_START (file sudah ter-buffer penuh)
    audio.addEventListener("ended", function () { try { audio.currentTime = AUDIO_START; } catch (e) {} audio.play().catch(function () {}); });
    function fadeTo(target, onDone) {
        clearInterval(fadeTimer); var step = (target - audio.volume) / 22;
        fadeTimer = setInterval(function () {
            var v = audio.volume + step;
            if (step === 0 || (step > 0 && v >= target) || (step < 0 && v <= target)) { v = target; clearInterval(fadeTimer); if (onDone) onDone(); }
            audio.volume = Math.min(1, Math.max(0, v));
        }, 70);
    }
    var userWantsAudio = false;
    function playMusic() { userWantsAudio = true; audio.volume = 0; audio.play().then(function () { musicBtn.classList.add("playing"); fadeTo(TARGET_VOLUME); trySeekStart(); }).catch(function () {}); }
    function pauseMusic() { userWantsAudio = false; musicBtn.classList.remove("playing"); fadeTo(0, function () { audio.pause(); }); }
    musicBtn.addEventListener("click", function () { audio.paused ? playMusic() : pauseMusic(); });
    // jeda musik otomatis saat tab disembunyikan, lanjut lagi saat kembali (jika tadinya menyala)
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) { if (!audio.paused) { audio.pause(); musicBtn.classList.remove("playing"); } }
        else if (userWantsAudio && audio.paused) { audio.volume = 0; audio.play().then(function () { musicBtn.classList.add("playing"); fadeTo(TARGET_VOLUME); }).catch(function () {}); }
    });

    /* ---------- Buka undangan (tirai membuka) ---------- */
    var cover = document.getElementById("cover");
    document.getElementById("openBtn").addEventListener("click", function () {
        cover.classList.add("open"); body.classList.remove("locked"); body.classList.add("invite-open");
        window.scrollTo({ top: 0 }); fxDirty = true; playMusic();
        setTimeout(function () { fxDirty = true; }, 300);
    });

    /* ---------- Countdown ---------- */
    var target = new Date(CFG.weddingISO).getTime(), pad = function (n) { return String(n).padStart(2, "0"); };
    function tick() {
        var diff = target - Date.now(); if (diff < 0) diff = 0;
        document.getElementById("cd-d").textContent = Math.floor(diff / 86400000);
        document.getElementById("cd-h").textContent = pad(Math.floor(diff % 86400000 / 3600000));
        document.getElementById("cd-m").textContent = pad(Math.floor(diff % 3600000 / 60000));
        document.getElementById("cd-s").textContent = pad(Math.floor(diff % 60000 / 1000));
    }
    tick(); setInterval(tick, 1000);

    /* ---------- Tanggal hero dari ISO ---------- */
    (function () {
        try {
            var d = new Date(CFG.weddingISO);
            var hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][d.getDay()];
            var bln = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][d.getMonth()];
            var el = document.getElementById("heroDate"); if (el) el.textContent = hari + ", " + d.getDate() + " " + bln + " " + d.getFullYear();
        } catch (e) {}
    })();

    /* ---------- RSVP ---------- */
    document.getElementById("rsvpForm").addEventListener("submit", function (e) {
        e.preventDefault(); document.getElementById("rsvpOk").classList.add("show");
        e.target.querySelector(".btn").innerHTML = '<i class="fa-solid fa-check"></i> Terkirim';
    });

    /* ---------- Buku ucapan ---------- */
    var wishesEl = document.getElementById("wishes");
    var seedWishes = [
        { n: "Rizky Maulana", t: "2 menit lalu", m: "Selamat ya Arsa! Akhirnya sah juga. Semoga jadi keluarga sakinah, mawaddah, warahmah 🤍" },
        { n: "Putri Salsabila", t: "11 menit lalu", m: "Kirana cantik bangett! Selamat menempuh hidup baru, semoga langgeng sampai jannah ya 😍" },
        { n: "Dewi & Andre", t: "34 menit lalu", m: "Turut berbahagia atas pernikahan kalian. Semoga menjadi keluarga yang harmonis dan penuh cinta." },
        { n: "Ust. Fauzi", t: "1 jam lalu", m: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Aamiin." },
        { n: "Tante Lina", t: "3 jam lalu", m: "Bahagia terus ya nak, sehat selalu buat kalian berdua." },
        { n: "Geng Arisan", t: "kemarin", m: "Cieee yang udah halal! Selamat ya, semoga cepet dikasih momongan!" }
    ];
    function renderWish(w, prepend) {
        var d = document.createElement("div"); d.className = "wish glass";
        d.innerHTML = "<b></b><span class='at'></span><p></p>";
        d.querySelector("b").textContent = w.n; d.querySelector(".at").textContent = w.t || "baru saja"; d.querySelector("p").textContent = w.m;
        wishesEl[prepend ? "prepend" : "append"](d);
    }
    seedWishes.forEach(function (w) { renderWish(w, false); });
    document.getElementById("wishForm").addEventListener("submit", function (e) {
        e.preventDefault();
        var n = document.getElementById("w-name").value.trim() || "Tamu", m = document.getElementById("w-msg").value.trim();
        if (!m) return; renderWish({ n: n, m: m }, true); e.target.reset();
    });

    /* ---------- Salin rekening ---------- */
    document.querySelectorAll(".btn-copy").forEach(function (b) {
        b.addEventListener("click", function () {
            var el = document.getElementById(b.dataset.copy);
            // alamat (data-raw): pertahankan spasi; nomor rekening: hapus spasi
            var txt = el.hasAttribute("data-raw") ? el.textContent.trim().replace(/\s+/g, " ") : el.textContent.replace(/\s/g, "");
            if (navigator.clipboard) navigator.clipboard.writeText(txt);
            var old = b.innerHTML; b.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin';
            setTimeout(function () { b.innerHTML = old; }, 1600);
        });
    });

    /* ---------- Lightbox galeri ---------- */
    (function () {
        var lb = document.getElementById("lightbox");
        if (!lb) return;
        var lbImg = lb.querySelector("img");
        function open(src, alt) { lbImg.src = src; lbImg.alt = alt || ""; lb.classList.add("show"); lb.setAttribute("aria-hidden", "false"); }
        function close() { lb.classList.remove("show"); lb.setAttribute("aria-hidden", "true"); }
        document.querySelectorAll(".gallery-grid .ph").forEach(function (ph) {
            ph.style.cursor = "zoom-in";
            ph.addEventListener("click", function () { var im = ph.querySelector("img"); if (im) open(im.currentSrc || im.src, im.alt); });
        });
        lb.addEventListener("click", function (e) { if (e.target === lb || e.target.hasAttribute("data-close")) close(); });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    })();

    /* ---------- Scroll-cue memudar setelah mulai scroll ---------- */
    window.addEventListener("scroll", function () {
        body.classList.toggle("scrolled", (window.scrollY || 0) > 40);
    }, { passive: true });

    /* refresh engine setelah font/asset termuat */
    window.addEventListener("load", function () { fxDirty = true; });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fxDirty = true; });
})();
