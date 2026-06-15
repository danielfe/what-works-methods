// Minimal inline icon set (stroke-based, Feather-ish). Keeps the bundle dependency-free.
const P = {
  search: 'M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0 M21 21l-4.3-4.3',
  x: 'M6 6l12 12 M18 6L6 18',
  arrowLeft: 'M19 12H5 M12 19l-7-7 7-7',
  arrowRight: 'M5 12h14 M12 5l7 7-7 7',
  external: 'M14 5h5v5 M19 5l-8 8 M19 13v6H5V5h6',
  clock: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 7v5l3 2',
  layers: 'M12 3l9 5-9 5-9-5 9-5 M3 13l9 5 9-5',
  flask: 'M9 3h6 M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3',
  badge: 'M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L3.8 7.7l5.4-.8z',
  heart: 'M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z',
  droplet: 'M12 3s6 6.5 6 10.5a6 6 0 1 1-12 0C6 9.5 12 3 12 3z',
  utensils: 'M5 3v8 M8 3v8 M6.5 11v10 M16 3c-1.5 0-3 2-3 5s1.5 4 3 4 m0-9v18',
  moon: 'M21 12.8A8 8 0 1 1 11 3a6.5 6.5 0 0 0 10 9.8z',
  sunset: 'M12 4v6 M4.2 10.2l1.4 1.4 M2 18h20 M18.4 11.6l1.4-1.4 M8 15a4 4 0 0 1 8 0 M5 18h14 M9 21h6',
  repeat: 'M17 2l4 4-4 4 M3 11V9a4 4 0 0 1 4-4h14 M7 22l-4-4 4-4 M21 13v2a4 4 0 0 1-4 4H3',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  compass: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M16 8l-2.5 5.5L8 16l2.5-5.5z',
  zap: 'M13 2L4 14h7l-1 8 9-12h-7z',
  message: 'M21 11.5a8.5 8.5 0 0 1-12 7.7L3 21l1.8-6A8.5 8.5 0 1 1 21 11.5z',
  video: 'M15 10l6-3v10l-6-3 M3 6h12v12H3z',
  printer: 'M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.7 21a2 2 0 0 1-3.4 0',
  music: 'M9 18V5l12-2v13 M9 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M21 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  check: 'M5 13l4 4L19 7',
  alert: 'M12 9v4 M12 17h.01 M10.3 3.9l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0z',
  list: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  spark: 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5L18 18 M6 18l2.5-2.5 M15.5 8.5L18 6',
}
export const TOOL_ICON = { practice: 'message', video: 'video', printable: 'printer', reminder: 'bell', playlist: 'music', checklist: 'list' }

export default function Icon({ name, className = '', size }) {
  const d = P[name]
  if (!d) return null
  const style = size ? { width: size, height: size } : undefined
  return (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
      {d.split(' M').map((seg, i) => <path key={i} d={(i ? 'M' : '') + seg} />)}
    </svg>
  )
}
