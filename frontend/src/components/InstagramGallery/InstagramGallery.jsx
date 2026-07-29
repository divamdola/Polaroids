import SectionHeading from '../SectionHeading/SectionHeading'

const images = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
]

export default function InstagramGallery() {
  return (
    <section className="container py-5">
      <SectionHeading eyebrow="Inspiration" title="Moments captured in our community" text="From studio sessions to everyday rituals, our collection is designed to feel timeless and personal." align="center" />
      <div className="row g-3 mt-2">
        {images.map((image, index) => (
          <div key={image} className={`col-6 ${index === 0 ? 'col-lg-3' : 'col-lg-3'}`}>
            <img src={image} alt="Inspiration" className="img-fluid rounded-4 w-100" style={{ height: 240, objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </section>
  )
}
