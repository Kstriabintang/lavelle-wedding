/* =========================================================
   ui.js — lapisan DOM: loader, rail, hint, nama tamu,
   kontrol musik, form RSVP, parallax pointer, & event.
   ========================================================= */
(function (M3D) {
    "use strict";
    M3D.ui.init = function () {
        var cfg = M3D.cfg, U = M3D.ui;
        U.loaderEl = document.getElementById("loader");
        U.loaderBar = document.getElementById("loaderBar");
        U.secTitle = document.getElementById("secTitle");
        U.railEl = document.getElementById("rail");
        U.hintEl = document.getElementById("hint");
        U.rsvpEl = document.getElementById("rsvp");
        U.pointer = { x: 0, y: 0 };
        U.curSec = 0;
        U.railDots = [];

        var L = M3D.layout;

        /* nama tamu via ?to= */
        (function () {
            var to = new URLSearchParams(location.search).get("to");
            var el = document.getElementById("guestName");
            if (to && el) { try { to = decodeURIComponent(to.replace(/\+/g, " ")); } catch (e) {} el.textContent = to; }
        })();

        /* rail dots */
        for (var i = 0; i < L.N; i++) {
            (function (idx) {
                var d = document.createElement("span"); d.className = "dot" + (idx === 0 ? " active" : "");
                d.setAttribute("role", "button"); d.setAttribute("tabindex", "0");
                d.setAttribute("aria-label", cfg.sectionNames[idx]);
                var go = function () { var max = document.documentElement.scrollHeight - window.innerHeight; window.scrollTo({ top: (idx / (L.N - 1)) * max, behavior: "smooth" }); };
                d.addEventListener("click", go);
                d.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
                U.railEl.appendChild(d); U.railDots.push(d);
            })(i);
        }

        /* parallax pointer + sembunyikan hint/greeting saat scroll */
        window.addEventListener("pointermove", function (e) { U.pointer.x = (e.clientX / window.innerWidth) * 2 - 1; U.pointer.y = (e.clientY / window.innerHeight) * 2 - 1; }, { passive: true });
        window.addEventListener("scroll", function () { if (window.scrollY > 40) { U.hintEl.classList.add("gone"); document.body.classList.add("scrolled"); } }, { passive: true });
        window.addEventListener("resize", M3D.onResize);

        /* RSVP (demo) */
        var form = document.getElementById("rsvpForm");
        if (form) form.addEventListener("submit", function (e) { e.preventDefault(); document.getElementById("rsvpOk").classList.add("show"); e.target.querySelector(".btn").innerHTML = '<i class="fa-solid fa-check"></i> Terkirim'; });

        /* audio backsound — mulai (& tiap loop) di detik ke-START */
        (function () {
            var audio = document.getElementById("bgm"), btn = document.getElementById("musicBtn");
            if (!audio || !btn) return;
            var want = false, TV = 0.7, fT, START = M3D.cfg.audioStartAt || 0;
            function seekStart() { try { if (audio.readyState > 0) audio.currentTime = START; } catch (e) {} }
            // set posisi awal begitu metadata siap (kasus preload), sekali saja
            audio.addEventListener("loadedmetadata", function () { try { if (audio.currentTime < START) audio.currentTime = START; } catch (e) {} }, { once: true });
            // loop manual agar tiap putaran kembali ke detik START (bukan 0)
            audio.addEventListener("ended", function () { seekStart(); audio.play().catch(function () {}); });
            function fade(to, done) { clearInterval(fT); var step = (to - audio.volume) / 20; fT = setInterval(function () { var v = audio.volume + step; if (step === 0 || (step > 0 && v >= to) || (step < 0 && v <= to)) { v = to; clearInterval(fT); if (done) done(); } audio.volume = Math.min(1, Math.max(0, v)); }, 70); }
            function play() { want = true; seekStart(); audio.volume = 0; audio.play().then(function () { seekStart(); btn.classList.add("playing"); fade(TV); }).catch(function () {}); }
            function stop() { want = false; btn.classList.remove("playing"); fade(0, function () { audio.pause(); }); }
            btn.addEventListener("click", function () { audio.paused ? play() : stop(); });
            // coba mainkan saat interaksi pertama (browser memblokir autoplay)
            var once = function () { if (!want) play(); window.removeEventListener("scroll", once); window.removeEventListener("pointerdown", once); };
            window.addEventListener("scroll", once, { passive: true, once: true });
            window.addEventListener("pointerdown", once, { once: true });
            document.addEventListener("visibilitychange", function () { if (document.hidden) { if (!audio.paused) { audio.pause(); btn.classList.remove("playing"); } } else if (want && audio.paused) { audio.volume = 0; audio.play().then(function () { btn.classList.add("playing"); fade(TV); }).catch(function () {}); } });
            M3D.ui.play = play;
        })();
    };

    /* hook loading manager + redraw saat font siap (dipanggil dari main) */
    M3D.ui.bindLoading = function () {
        var U = M3D.ui, total = M3D.photoURLs.length, loaded = 0;
        THREE.DefaultLoadingManager.onProgress = function () { loaded++; U.loaderBar.style.width = Math.min(100, Math.round((loaded / total) * 100)) + "%"; };
        function finish() { U.loaderBar.style.width = "100%"; U.loaderEl.classList.add("done"); }
        THREE.DefaultLoadingManager.onLoad = finish;
        setTimeout(finish, 7000);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { M3D.redraws.forEach(function (fn) { try { fn(); } catch (e) {} }); });
    };
})(window.M3D);
