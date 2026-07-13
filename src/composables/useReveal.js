// Scroll-reveal ringan berbasis IntersectionObserver. Dipanggil sekali
// dari halaman (onMounted) — mengamati semua .r-reveal di dalam scope.
export function wireReveal(root = document, selector = '.r-reveal') {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    })
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' })
  root.querySelectorAll(`${selector}:not(.in)`).forEach((el) => io.observe(el))
  return () => io.disconnect()
}
