import Button from '../Button/Button'

export default function CollectionBanner() {
  return (
    <section className="container py-5">
      <div className="rounded-4 p-4 p-lg-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(244,239,232,0.95))', border: '1px solid rgba(255,255,255,0.75)' }}>
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <p className="text-uppercase fw-semibold mb-2 text-muted" style={{ letterSpacing: '0.24rem', fontSize: '0.75rem' }}>Curated edit</p>
            <h3 className="fw-semibold mb-3" style={{ color: '#171514' }}>A soft, premium collection for the modern storyteller.</h3>
            <p className="text-muted mb-0">Explore our seasonal assortment of instant cameras, film, and elevated accessories.</p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Button>Explore collection</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
