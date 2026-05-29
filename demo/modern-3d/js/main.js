/* =========================================================
   main.js — bootstrap: merangkai semua modul sesuai urutan.
   Dimuat paling akhir (setelah three.js + modul lain).
   ========================================================= */
(function (M3D) {
    "use strict";
    function boot() {
        var canvas = document.getElementById("scene");
        var loader = document.getElementById("loader");
        if (!window.THREE) { if (loader) loader.classList.add("done"); console.warn("[Modern3D] Three.js gagal dimuat."); return; }

        M3D.initCore(canvas);   // renderer, scene, kamera, cahaya, sprite, layout
        M3D.computeFit();       // skala kamera ikut rasio layar (mobile/desktop)
        M3D.buildParticles();   // debu & bintang
        M3D.buildSections();    // 5 adegan 3D
        M3D.ui.init();          // DOM: rail, hint, nama tamu, musik, RSVP
        M3D.ui.bindLoading();   // progress loader + redraw saat font siap
        M3D.start();            // loop animasi sinematik
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
})(window.M3D);
