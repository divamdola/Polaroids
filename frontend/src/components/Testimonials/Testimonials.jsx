import { motion } from 'framer-motion'
import SectionHeading from '../SectionHeading/SectionHeading'

const testimonials = [
  {
    name: 'Amelia W.',
    quote: 'The storytelling, the quality, and the calm experience made buying our new camera feel effortless.',
  },
  {
    name: 'Julian R.',
    quote: 'Every detail feels intentional. The shop feels as refined as the products themselves.',
  },
  {
    name: 'Mina K.',
    quote: 'It is the kind of experience that makes you want to come back for every new release.',
  },
]

export default function Testimonials() {
  return (
    <section className="container py-5">
      <SectionHeading eyebrow="What clients say" title="A calm, considered experience" text="Trusted by photography lovers who appreciate thoughtful design and elevated service." align="center" />
      <div className="row g-4 mt-2">
        {testimonials.map((item, index) => (
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={item.name} className="col-md-4">
            <div className="rounded-4 p-4 h-100" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.75)' }}>
              <p className="text-muted mb-3" style={{ fontSize: '1rem', lineHeight: 1.8 }}>&ldquo;{item.quote}&rdquo;</p>
              <p className="fw-semibold mb-0">{item.name}</p>
              <p className="text-muted mb-0">{['Collector', 'Creative', 'Studio Partner'][index]}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
