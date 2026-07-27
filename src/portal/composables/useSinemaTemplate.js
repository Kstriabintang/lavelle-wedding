// SINEMA TEMPLATE — orkestrasi motion scroll-driven (GSAP + ScrollTrigger).
// Versi portal committable (digeneralisasi dari useSinema.js, tanpa dependensi client-001).
// Scroll reveal (stagger), parallax scrub, pin + scrub (scrollytelling horizontal),
// name char reveal. Client-only, reduced-motion → state akhir tanpa animasi, cleanup penuh.
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useSinemaTemplate(root) {
  if (typeof window === 'undefined' || !root) return () => {}
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduce) {
    root.querySelectorAll('.sn-reveal, .sn-char, .sn-slide-l, .sn-slide-r').forEach((el) => {
      el.style.opacity = '1'; el.style.transform = 'none'
    })
    return () => {}
  }

  let ctx
  try {
    gsap.registerPlugin(ScrollTrigger)
    ctx = gsap.context((self) => {
      const q = self.selector

      // 1) HERO — parallax foto (scrub)
      const heroPhoto = q('.sn-hero__photo')[0]
      if (heroPhoto) {
        gsap.to(heroPhoto, {
          yPercent: 18, ease: 'none',
          scrollTrigger: { trigger: '.sn-hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
      }

      // 2) REVEAL-ON-SCROLL umum
      q('.sn-reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 42, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        })
      })

      // 3) COUPLE — dua potret meluncur dari sisi berlawanan (scrub)
      q('.sn-slide-l').forEach((el) => gsap.from(el, { xPercent: -14, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 45%', scrub: 1 } }))
      q('.sn-slide-r').forEach((el) => gsap.from(el, { xPercent: 14, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 45%', scrub: 1 } }))

      // 4) SIGNATURE — cerita cinta horizontal ter-PIN (pin + scrub)
      const track = q('.sn-story__track')[0]
      const story = q('.sn-story')[0]
      if (track && story) {
        story.classList.add('sn-on')
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth)
        gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: '.sn-story', start: 'top top', end: () => '+=' + dist(),
            pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          },
        })
      }

      // 5) CLOSING — tanda tangan membesar & memudar
      const sign = q('.sn-closing__sign')[0]
      if (sign) {
        gsap.fromTo(sign, { scale: 0.86, opacity: 0.2 }, {
          scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: '.sn-closing', start: 'top 80%', end: 'center center', scrub: 1 },
        })
      }
    }, root)

    ScrollTrigger.refresh()
    window.addEventListener('load', onLoad, { once: true })
  } catch (e) {
    root.querySelectorAll('.sn-reveal, .sn-char, .sn-slide-l, .sn-slide-r').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none' })
  }

  function onLoad() { try { ScrollTrigger.refresh() } catch (e) { /* ok */ } }

  return () => {
    try { window.removeEventListener('load', onLoad); if (ctx) ctx.revert() } catch (e) { /* ok */ }
  }
}
