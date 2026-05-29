/* =========================================================
   utils.js — fungsi bantu (matematika, canvas, tekstur)
   Mengisi M3D.util.* — dipakai oleh particles/content/engine.
   ========================================================= */
(function (M3D) {
    "use strict";
    var util = M3D.util;

    util.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    util.lerp = function (a, b, t) { return a + (b - a) * t; };

    util.newCanvas = function (w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; };

    util.spaced = function (ctx, text, x, y, ls) {
        if ("letterSpacing" in ctx) { ctx.letterSpacing = ls + "px"; ctx.fillText(text, x, y); ctx.letterSpacing = "0px"; }
        else { ctx.fillText(text, x, y); }
    };

    util.goldGrad = function (ctx, y0, y1) {
        var g = ctx.createLinearGradient(0, y0, 0, y1);
        g.addColorStop(0, "#f7e8c1"); g.addColorStop(1, "#b08f48"); return g;
    };

    // tekstur titik lembut (untuk partikel & halo)
    util.dotTexture = function () {
        var c = util.newCanvas(64, 64), g = c.getContext("2d");
        var rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        rg.addColorStop(0, "rgba(255,255,255,1)");
        rg.addColorStop(0.3, "rgba(255,236,200,0.9)");
        rg.addColorStop(1, "rgba(255,236,200,0)");
        g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    };

    // plane bertekstur canvas (judul/kartu) — butuh renderer utk anisotropy
    util.planeTex = function (cv, w, h, dbl) {
        var tex = new THREE.CanvasTexture(cv);
        tex.anisotropy = M3D.renderer.capabilities.getMaxAnisotropy();
        var mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: dbl ? THREE.DoubleSide : THREE.FrontSide });
        return { mesh: new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat), tex: tex, mat: mat };
    };

    // kumpulan titik (debu/bintang)
    util.makePoints = function (count, sx, sy, sz, size, color, opacity) {
        var geo = new THREE.BufferGeometry(), pos = new Float32Array(count * 3), midY = M3D.layout.midY;
        for (var i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * sx;
            pos[i * 3 + 1] = (Math.random() - 0.5) * sy + midY;
            pos[i * 3 + 2] = (Math.random() - 0.5) * sz;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        var mat = new THREE.PointsMaterial({
            size: size, map: M3D.sprite, color: color, transparent: true, opacity: opacity,
            depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
        });
        return new THREE.Points(geo, mat);
    };
})(window.M3D);
