/* =========================================================
   particles.js — debu emas & bintang yang menyelimuti scene
   sepanjang scroll. Mengisi M3D.particles.
   ========================================================= */
(function (M3D) {
    "use strict";
    M3D.buildParticles = function () {
        var TOTAL = M3D.layout.TOTAL, scene = M3D.scene, mk = M3D.util.makePoints;
        var dust = mk(3000, 150, TOTAL + 220, 200, 0.22, 0xe9cd8c, 0.9);
        var stars = mk(1100, 170, TOTAL + 260, 230, 0.1, 0xffffff, 0.85);
        scene.add(dust); scene.add(stars);
        M3D.particles = { dust: dust, stars: stars };
    };
})(window.M3D);
