import SectionHeading from '../../components/SectionHeading/SectionHeading'

export default function Contact() {
  return (
    <section className="container py-5">
      <SectionHeading eyebrow="Contact" title="We’re here to help." text="Reach out for product support, order questions, or collaboration inquiries." />
      <div className="row g-5 mt-2">
        <div className="col-lg-6">
          <div className="rounded-4 p-4 p-lg-5" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.75)' }}>
            <p className="mb-2"><strong>Email:</strong> hello@polaroidstore.com</p>
            <p className="mb-2"><strong>Phone:</strong> +1 555 0123</p>
            <p className="mb-0"><strong>Hours:</strong> Monday to Friday, 9am – 6pm</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm p-4 border-0 rounded-4">
            <h5 className="fw-semibold mb-3">Get in touch</h5>
            <div className="d-grid gap-3">
              <input className="form-control rounded-pill" placeholder="Name" />
              <input className="form-control rounded-pill" placeholder="Email" />
              <textarea className="form-control rounded-4" rows="4" placeholder="How can we help?" />
              <button type="button" className="btn btn-dark rounded-pill">Send message</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
