// Motion sinematik untuk HERO homepage: orkestrasi entrance + Ken Burns +
// parallax scrub. SSG-safe (client-only), di-guard prefers-reduced-motion,
// punya failsafe (apa pun gagal → hero tetap tampil), dan cleanup penuh
// untuk SPA route change. GSAP hanya mengurus HERO — section lain tetap
// memakai sistem .reveal CSS yang sudah ada.
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useCinematic() {
  // Guard: hanya jalan di browser (vite-ssg mem-prerender di server).
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {}

  const heroRises = Array.from(document.querySelectorAll('.hero__inner .hero__rise'))
  const reveal = () => heroRises.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none' })

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const motionOn = document.documentElement.classList.contains('motion-on')

  // Reduced-motion / motion-off → pastikan hero tampil, jangan animasikan.
  if (reduce || !motionOn) { reveal(); return () => {} }

  let ctx
  try {
    gsap.registerPlugin(ScrollTrigger)
    ctx = gsap.context(() => {
      // 1) Orkestrasi entrance hero (sekali saat load, berurutan & berbobot).
      gsap.set(heroRises, { opacity: 0, y: 34 })
      gsap.to(heroRises, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.15,
        onComplete: () => heroRises.forEach((el) => { el.style.willChange = 'auto' }),
      })

      // 2) Ken Burns + 3) parallax scrub pada foto latar (transform-only, 60fps).
      const bg = document.querySelector('.hero__bg')
      if (bg) {
        gsap.fromTo(bg, { scale: 1.06 },
          { scale: 1.16, duration: 20, ease: 'sine.inOut', repeat: -1, yoyo: true })
        gsap.to(bg, {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
      }
    })

    // Recalibrate trigger setelah gambar hero termuat (tinggi bisa berubah).
    ScrollTrigger.refresh()
    window.addEventListener('load', onLoadRefresh, { once: true })
  } catch (e) {
    // Failsafe: apa pun yang gagal → hero tetap terbaca, tidak pernah blank.
    reveal()
  }

  function onLoadRefresh() { try { ScrollTrigger.refresh() } catch (e) {} }

  // Cleanup saat pindah halaman / komponen di-unmount.
  return () => {
    try {
      window.removeEventListener('load', onLoadRefresh)
      if (ctx) ctx.revert()   // membatalkan seluruh tween + ScrollTrigger dalam context ini
    } catch (e) {}
  }
}
