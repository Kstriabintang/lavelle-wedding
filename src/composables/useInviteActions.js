// Aksi undangan yang dipakai lintas section (reusable): salin clipboard,
// tautan Google Calendar, unduh .ics, share WhatsApp/Web Share.
import { ref } from 'vue'

export function useInviteActions() {
  const copied = ref('')

  function copyText(text, tag = 'x') {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    navigator.clipboard.writeText(text).then(() => {
      copied.value = tag
      setTimeout(() => { if (copied.value === tag) copied.value = '' }, 1800)
    }).catch(() => { /* diabaikan */ })
  }

  // date: 'YYYY-MM-DD'; jam default 08.00–14.00 WIB (01:00–07:00 UTC)
  function calStamps(date) {
    const d = date.replace(/-/g, '')
    return { start: `${d}T010000Z`, end: `${d}T070000Z` }
  }
  function gcalUrl({ title, date, details = '', location = '' }) {
    const { start, end } = calStamps(date)
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + `&text=${encodeURIComponent(title)}`
      + `&dates=${start}/${end}`
      + `&details=${encodeURIComponent(details)}`
      + `&location=${encodeURIComponent(location)}`
  }
  function downloadIcs({ title, date, details = '', location = '', filename = 'undangan.ics' }) {
    const { start, end } = calStamps(date)
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Lavelle//Royale//ID', 'BEGIN:VEVENT',
      `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${title}`, `LOCATION:${location}`,
      `DESCRIPTION:${details}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 500)
  }
  function shareWa(text) {
    if (typeof window !== 'undefined') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }
  function shareNative({ title = '', url = '' }) {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else copyText(url, 'link')
  }

  return { copied, copyText, gcalUrl, downloadIcs, shareWa, shareNative }
}
