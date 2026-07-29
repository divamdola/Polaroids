import { memo, useMemo } from 'react'

const SectionHeading = memo(function SectionHeading({ eyebrow, title, text, align = 'start' }) {
  const alignment = useMemo(() => (align === 'center' ? 'text-center' : 'text-start'), [align])

  return (
    <div className={`mb-4 ${alignment}`}>
      {eyebrow && <p className="text-uppercase fw-semibold mb-2 text-muted" style={{ letterSpacing: '0.24rem', fontSize: '0.75rem' }}>{eyebrow}</p>}
      <h2 className="fw-semibold mb-2" style={{ color: '#171514', fontSize: 'clamp(1.55rem, 2.2vw, 2rem)' }}>{title}</h2>
      {text && <p className="text-muted mb-0" style={{ lineHeight: 1.8, maxWidth: '680px', marginInline: align === 'center' ? 'auto' : '0' }}>{text}</p>}
    </div>
  )
})

export default SectionHeading
