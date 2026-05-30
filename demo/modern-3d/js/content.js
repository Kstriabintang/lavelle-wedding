/* =========================================================
   content.js — membangun 5 adegan 3D dari config:
   0 Pembuka · 1 Hitung Mundur · 2 Our Story · 3 Acara · 4 RSVP
   ========================================================= */
(function (M3D) {
    "use strict";
    M3D.buildSections = function () {
        var cfg = M3D.cfg, U = M3D.util, L = M3D.layout, scene = M3D.scene, redraws = M3D.redraws, S = M3D.sections;
        var centerY = L.centerY, CZ = L.CZ;

        /* ===== 0 — PEMBUKA ===== */
        var opening = new THREE.Group(); opening.position.set(0, centerY(0), CZ); scene.add(opening);
        var nameCv = U.newCanvas(1600, 800);
        function drawNames() {
            var ctx = nameCv.getContext("2d"), W = nameCv.width, H = nameCv.height; ctx.clearRect(0, 0, W, H);
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillStyle = "#d8ad68"; ctx.font = "500 46px 'Cormorant Garamond',serif"; U.spaced(ctx, "THE WEDDING OF", W / 2, 150, 16);
            ctx.fillStyle = U.goldGrad(ctx, 220, 560); var s = 280; ctx.font = s + "px 'Pinyon Script',cursive";
            while (ctx.measureText(cfg.couple.full).width > W - 120 && s > 120) { s -= 8; ctx.font = s + "px 'Pinyon Script',cursive"; }
            ctx.shadowColor = "rgba(233,205,140,0.5)"; ctx.shadowBlur = 40; ctx.fillText(cfg.couple.full, W / 2, 400); ctx.shadowBlur = 0;
            ctx.fillStyle = "#efe2c4"; ctx.font = "italic 60px 'Cormorant Garamond',serif"; U.spaced(ctx, cfg.dateText, W / 2, 640, 6);
        }
        drawNames(); var namesP = U.planeTex(nameCv, 16, 8); opening.add(namesP.mesh);
        redraws.push(function () { drawNames(); namesP.tex.needsUpdate = true; });
        S.opening = { group: opening, namesP: namesP };

        /* ===== 1 — HITUNG MUNDUR ===== */
        var countdown = new THREE.Group(); countdown.position.set(0, centerY(1), CZ); scene.add(countdown);
        (function () {
            var cv = U.newCanvas(1200, 260);
            var draw = function () { var ctx = cv.getContext("2d"); ctx.clearRect(0, 0, 1200, 260); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#d8ad68"; ctx.font = "500 44px 'Cormorant Garamond',serif"; U.spaced(ctx, "MENUJU HARI BAHAGIA", 600, 130, 12); };
            draw(); var tp = U.planeTex(cv, 9, 1.95); tp.mesh.position.set(0, 2.7, 0); countdown.add(tp.mesh); redraws.push(function () { draw(); tp.tex.needsUpdate = true; });
        })();
        var cdLabels = ["HARI", "JAM", "MENIT", "DETIK"], cdCards = [];
        for (var i = 0; i < 4; i++) {
            var cv = U.newCanvas(300, 380), card = U.planeTex(cv, 2.0, 2.55);
            var baseX = (i - 1.5) * 2.35; card.mesh.userData.baseX = baseX; card.mesh.userData.dir = (i < 2 ? -1 : 1);
            card.mesh.position.set(baseX, 0, 0); countdown.add(card.mesh);
            var halo = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.95), new THREE.MeshBasicMaterial({ map: M3D.sprite, color: 0xe9cd8c, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
            halo.userData.baseX = baseX; halo.position.set(baseX, 0, -0.06); countdown.add(halo);
            cdCards.push({ cv: cv, tex: card.tex, mat: card.mat, mesh: card.mesh, halo: halo, label: cdLabels[i] });
        }
        function drawCdCard(o, value) {
            var ctx = o.cv.getContext("2d"), W = o.cv.width, H = o.cv.height; ctx.clearRect(0, 0, W, H);
            var r = 28; ctx.beginPath(); ctx.moveTo(r, 0); ctx.arcTo(W, 0, W, H, r); ctx.arcTo(W, H, 0, H, r); ctx.arcTo(0, H, 0, 0, r); ctx.arcTo(0, 0, W, 0, r); ctx.closePath();
            var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(24,32,58,0.96)"); g.addColorStop(1, "rgba(10,14,26,0.96)"); ctx.fillStyle = g; ctx.fill();
            ctx.strokeStyle = "rgba(212,175,106,0.7)"; ctx.lineWidth = 3; ctx.stroke();
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillStyle = U.goldGrad(ctx, 60, 250); ctx.font = "600 150px 'Cormorant Garamond',serif"; ctx.fillText(String(value), W / 2, H / 2 - 18);
            ctx.fillStyle = "#cfc6b0"; ctx.font = "500 36px 'Jost',sans-serif"; U.spaced(ctx, o.label, W / 2, H - 54, 8); o.tex.needsUpdate = true;
        }
        var TARGET = new Date(cfg.target).getTime(), lastSec = -1;
        function updateCountdown() {
            var diff = TARGET - Date.now(); if (diff < 0) diff = 0;
            var d = Math.floor(diff / 86400000), h = Math.floor(diff % 86400000 / 3600000), m = Math.floor(diff % 3600000 / 60000), s = Math.floor(diff % 60000 / 1000);
            if (s === lastSec) return; lastSec = s; var vals = [d, h, m, s];
            for (var k = 0; k < 4; k++) drawCdCard(cdCards[k], k === 0 ? vals[k] : String(vals[k]).padStart(2, "0"));
        }
        updateCountdown(); redraws.push(updateCountdown);
        S.countdown = { group: countdown, cards: cdCards }; S.updateCountdown = updateCountdown;

        /* ===== 2 — OUR STORY (konstelasi foto) ===== */
        var gallery = new THREE.Group(); gallery.position.set(0, centerY(2), CZ); scene.add(gallery);
        M3D.photoURLs.forEach(function (src, i) {
            var ang = (i / M3D.photoURLs.length) * Math.PI * 2, radius = 9 + (i % 2) * 1.6;
            // band tipis & rata (lurus) — foto tidak lagi terbang jauh ke atas-bawah
            var yy = (i % 2 === 0 ? 1.6 : -1.6);
            var frame = new THREE.Group();
            frame.position.set(Math.sin(ang) * radius, yy, Math.cos(ang) * radius);
            frame.rotation.y = ang; frame.rotation.z = 0;
            var border = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 2.75), new THREE.MeshStandardMaterial({ color: 0xc9a85e, metalness: 0.7, roughness: 0.35, side: THREE.DoubleSide }));
            border.position.z = -0.02; frame.add(border);
            var mat = new THREE.MeshBasicMaterial({ color: 0x222633, side: THREE.DoubleSide });
            frame.add(new THREE.Mesh(new THREE.PlaneGeometry(1.85, 2.55), mat));
            gallery.add(frame);
            new THREE.TextureLoader().load(src, function (tex) { tex.encoding = THREE.sRGBEncoding; mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true; });
        });
        (function () {
            var cv = U.newCanvas(1200, 300);
            var draw = function () { var ctx = cv.getContext("2d"); ctx.clearRect(0, 0, 1200, 300); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = U.goldGrad(ctx, 40, 240); ctx.font = "150px 'Pinyon Script',cursive"; ctx.fillText("Our Story", 600, 150); };
            draw(); var tp = U.planeTex(cv, 9, 2.25); tp.mesh.position.set(0, 4.2, 0); gallery.add(tp.mesh); redraws.push(function () { draw(); tp.tex.needsUpdate = true; });
        })();
        S.gallery = { group: gallery };

        /* ===== 3 — ACARA ===== */
        var ceremony = new THREE.Group(); ceremony.position.set(0, centerY(3), CZ); scene.add(ceremony);
        var ceremonyMesh;
        (function () {
            var cv = U.newCanvas(900, 1160);
            function draw() {
                var ctx = cv.getContext("2d"), W = cv.width, H = cv.height; ctx.clearRect(0, 0, W, H);
                var r = 36; ctx.beginPath(); ctx.moveTo(r, 0); ctx.arcTo(W, 0, W, H, r); ctx.arcTo(W, H, 0, H, r); ctx.arcTo(0, H, 0, 0, r); ctx.arcTo(0, 0, W, 0, r); ctx.closePath();
                var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(22,32,58,0.96)"); g.addColorStop(1, "rgba(10,14,26,0.96)"); ctx.fillStyle = g; ctx.fill();
                ctx.strokeStyle = "#caa75e"; ctx.lineWidth = 3; ctx.strokeRect(36, 36, W - 72, H - 72);
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillStyle = "#d8ad68"; ctx.font = "500 38px 'Cormorant Garamond',serif"; U.spaced(ctx, "SAVE THE DATE", W / 2, 130, 12);
                ctx.fillStyle = U.goldGrad(ctx, 180, 320); ctx.font = "140px 'Pinyon Script',cursive"; ctx.fillText(cfg.dateLong, W / 2, 280);
                ctx.strokeStyle = "#caa75e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 120, 400); ctx.lineTo(W / 2 + 120, 400); ctx.stroke();
                ctx.fillStyle = "#efe2c4"; ctx.font = "600 52px 'Cormorant Garamond',serif"; ctx.fillText("Akad Nikah", W / 2, 500);
                ctx.fillStyle = "#cfc6b0"; ctx.font = "36px 'Jost',sans-serif"; ctx.fillText(cfg.akad, W / 2, 560);
                ctx.fillStyle = "#efe2c4"; ctx.font = "600 52px 'Cormorant Garamond',serif"; ctx.fillText("Resepsi", W / 2, 680);
                ctx.fillStyle = "#cfc6b0"; ctx.font = "36px 'Jost',sans-serif"; ctx.fillText(cfg.resepsi, W / 2, 740);
                ctx.fillStyle = "#d8ad68"; ctx.font = "italic 40px 'Cormorant Garamond',serif"; ctx.fillText(cfg.venue, W / 2, 900);
                ctx.fillStyle = "#9a9279"; ctx.font = "32px 'Cormorant Garamond',serif"; U.spaced(ctx, cfg.brand.toUpperCase(), W / 2, H - 120, 14);
            }
            draw(); var tp = U.planeTex(cv, 5.4, 6.96); ceremonyMesh = tp.mesh; ceremony.add(tp.mesh); redraws.push(function () { draw(); tp.tex.needsUpdate = true; });
        })();
        S.ceremony = { group: ceremony, mesh: ceremonyMesh };

        /* ===== 4 — RSVP ===== */
        var rsvp = new THREE.Group(); rsvp.position.set(0, centerY(4), CZ); scene.add(rsvp);
        (function () {
            var cv = U.newCanvas(900, 650);
            function draw() {
                var ctx = cv.getContext("2d"), W = cv.width, H = cv.height; ctx.clearRect(0, 0, W, H);
                var r = 36; ctx.beginPath(); ctx.moveTo(r, 0); ctx.arcTo(W, 0, W, H, r); ctx.arcTo(W, H, 0, H, r); ctx.arcTo(0, H, 0, 0, r); ctx.arcTo(0, 0, W, 0, r); ctx.closePath();
                ctx.fillStyle = "rgba(12,16,30,0.45)"; ctx.fill(); ctx.strokeStyle = "rgba(212,175,106,0.5)"; ctx.lineWidth = 3; ctx.stroke();
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillStyle = U.goldGrad(ctx, 120, 330); ctx.font = "150px 'Pinyon Script',cursive"; ctx.fillText("Be Our Guest", W / 2, 250);
                ctx.fillStyle = "#cfc6b0"; ctx.font = "italic 40px 'Cormorant Garamond',serif"; ctx.fillText("Konfirmasikan kehadiranmu", W / 2, 430);
            }
            draw(); var tp = U.planeTex(cv, 6.6, 4.77); tp.mesh.position.set(0, 2.6, 0); rsvp.add(tp.mesh); redraws.push(function () { draw(); tp.tex.needsUpdate = true; });
        })();
        S.rsvp = { group: rsvp };
    };
})(window.M3D);
