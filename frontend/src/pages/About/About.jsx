import SectionHeading from '../../components/SectionHeading/SectionHeading'
import Newsletter from '../../components/Newsletter/Newsletter'

export default function About() {
  return (
    <section className="container py-5">
      <SectionHeading eyebrow="Our story" title="Designed for creators, collectors, and curious minds." text="Polaroid Store brings together timeless photography essentials with a calm, premium online experience." />
      <div className="row align-items-center g-5 mt-2">
        <div className="col-lg-6">
          <div className="rounded-4 p-4 p-lg-5" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.75)' }}>
            <p className="text-muted lead">We believe great products deserve a beautiful place to live. Our collection is carefully chosen to feel modern, personal, and lasting.</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm p-4 border-0 rounded-4">
            <h5 className="fw-semibold">Why shoppers love us</h5>
            <ul className="mb-0 text-muted">
              <li>Curated instant camera gear</li>
              <li>Fast and simple checkout</li>
              <li>Responsive shopping across every device</li>
            </ul>
          </div>
        </div>
      </div>
      <Newsletter />
    </section>
  )
}
