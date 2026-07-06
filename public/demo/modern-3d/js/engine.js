/* =========================================================
   engine.js — inti Three.js: renderer, scene, kamera, cahaya,
   layout vertikal, resize, dan loop animasi sinematik.
   ========================================================= */
(function (M3D) {
    "use strict";
    var cfg = M3D.cfg;

    M3D.initCore = function (canvas) {
        // layout vertikal (5 layar konten)
        var N = cfg.sectionNames.length, GAP = 42, TOTAL = (N - 1) * GAP, CZ = -3;
        M3D.layout = {
            N: N, GAP: GAP, TOTAL: TOTAL, CZ: CZ, midY: -TOTAL / 2,
            centerY: function (i) { return -i * GAP; }
        };

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        M3D.renderer = renderer;

        var scene = new THREE.Scene();
        scene.background = new THREE.Color(cfg.colors ? cfg.colors.navy : 0x070a12);
        scene.fog = new THREE.FogExp2(0x070a12, 0.011);
        M3D.scene = scene;

        var camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 500);
        scene.add(camera);
        M3D.camera = camera;

        scene.add(new THREE.AmbientLight(0x8492b5, 0.8));
        var camLight = new THREE.PointLight(0xffe6bf, 1.3, 70); camLight.position.set(0, 1, 3); camera.add(camLight);
        var warm = new THREE.PointLight(0xffd49a, 0.9, 200); warm.position.set(12, 10, 14); scene.add(warm);
        var cool = new THREE.PointLight(0x9ab4ff, 0.6, 240); cool.position.set(-14, -40, -20); scene.add(cool);

        M3D.sprite = M3D.util.dotTexture();
        M3D.clock = new THREE.Clock();
        camera.position.set(0, M3D.layout.centerY(0), 9);
    };

    M3D.computeFit = function () {
        var a = window.innerWidth / window.innerHeight;
        M3D.state.fitK = a < 0.7 ? 1.7 : a < 1 ? 1.32 : 1;
    };

    M3D.onResize = function () {
        var c = M3D.camera, r = M3D.renderer;
        c.aspect = window.innerWidth / window.innerHeight; c.updateProjectionMatrix();
        r.setSize(window.innerWidth, window.innerHeight);
        r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        M3D.computeFit();
    };

    M3D.progress = function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        return max > 0 ? M3D.util.clamp(window.scrollY / max, 0, 1) : 0;
    };

    M3D.start = function () {
        var L = M3D.layout, S = M3D.sections, U = M3D.ui, util = M3D.util;
        var camera = M3D.camera, scene = M3D.scene, renderer = M3D.renderer, clock = M3D.clock;
        var lp = function (i, camY) { return util.clamp(1 - Math.abs(camY - L.centerY(i)) / L.GAP, 0, 1); };

        function animate() {
            requestAnimationFrame(animate);
            var t = clock.getElapsedTime();
            if (S.updateCountdown) S.updateCountdown();
            var p = M3D.progress();

            // kamera turun mengikuti scroll (damping → sinematik)
            var targetY = -p * L.TOTAL, targetZ = 9 * M3D.state.fitK, ptr = U.pointer;
            camera.position.y = util.lerp(camera.position.y, targetY + ptr.y * -0.6, 0.08);
            camera.position.x = util.lerp(camera.position.x, ptr.x * 1.0, 0.06);
            camera.position.z = util.lerp(camera.position.z, targetZ, 0.06);
            camera.lookAt(0, camera.position.y - ptr.y * 0.3, L.CZ);
            var camY = camera.position.y;

            // section 0 — pembuka
            S.opening.group.position.y = L.centerY(0) + Math.sin(t * 0.8) * 0.18;
            S.opening.namesP.mat.opacity = util.clamp(lp(0, camY) * 1.35, 0, 1);

            // section 1 — kartu hitung mundur terbang dari samping
            var l1 = lp(1, camY);
            S.countdown.cards.forEach(function (o) {
                var off = (1 - l1) * 22 * o.mesh.userData.dir;
                o.mesh.position.x = o.mesh.userData.baseX + off; o.halo.position.x = o.halo.userData.baseX + off;
                o.mat.opacity = util.clamp(l1 * 1.4, 0, 1); o.halo.material.opacity = util.clamp(l1 * 0.22, 0, 0.22);
                o.mesh.position.y = Math.sin(t * 1.1 + o.mesh.userData.baseX) * 0.12;
            });

            // section 2 — konstelasi foto berputar
            S.gallery.group.rotation.y += 0.0016;

            // section 3 — kartu acara mengambang masuk
            var l3 = lp(3, camY);
            S.ceremony.group.rotation.y = Math.sin(t * 0.35) * 0.06;
            S.ceremony.group.position.y = L.centerY(3) + Math.sin(t * 0.7) * 0.12;
            if (S.ceremony.mesh) { var sc = 0.7 + l3 * 0.3; S.ceremony.mesh.scale.set(sc, sc, sc); S.ceremony.mesh.material.opacity = util.clamp(l3 * 1.4, 0, 1); }

            // section 4 — RSVP
            var l4 = lp(4, camY);
            S.rsvp.group.rotation.y = Math.sin(t * 0.35 + 1) * 0.05;
            S.rsvp.group.position.y = L.centerY(4) + Math.sin(t * 0.7 + 1) * 0.12;
            S.rsvp.group.children.forEach(function (c) { if (c.material) c.material.opacity = util.clamp(l4 * 1.4, 0, 1); });
            if (U.rsvpEl) U.rsvpEl.classList.toggle("show", l4 > 0.78);

            // partikel hanyut
            M3D.particles.dust.rotation.y += 0.0003;
            M3D.particles.stars.rotation.y -= 0.0002;

            // UI: section aktif + judul
            var idx = Math.round(p * (L.N - 1));
            if (idx !== U.curSec) {
                U.curSec = idx;
                U.railDots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
                U.secTitle.textContent = cfg.sectionNames[idx];
            }

            renderer.render(scene, camera);
        }
        U.secTitle.textContent = cfg.sectionNames[0];
        animate();
    };
})(window.M3D);
