import Button from '../Button/Button'

export default function Newsletter() {
  return (
    <section className="container py-5">
      <div className="rounded-4 p-4 p-lg-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(244,239,232,0.9))', border: '1px solid rgba(255,255,255,0.7)' }}>
        <p className="text-uppercase fw-semibold mb-2 text-muted" style={{ letterSpacing: '0.24rem', fontSize: '0.75rem' }}>Stay inspired</p>
        <h3 className="fw-semibold mb-3" style={{ color: '#171514' }}>Join our newsletter for first access to new arrivals and editorials.</h3>
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <input className="form-control rounded-pill" placeholder="Email address" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
