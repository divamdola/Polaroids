import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import { useStore } from '../../context/StoreContext'

export default function Wishlist() {
  const { wishlist } = useStore()

  return (
    <section className="container py-5">
      <SectionHeading eyebrow="Saved for later" title="Your wishlist" text="Keep a private collection of pieces you love and return to whenever you are ready." />
      {wishlist.length === 0 ? (
        <div className="card p-5 text-center border-0 shadow-sm rounded-4">
          <h4 className="fw-semibold">No favorites yet.</h4>
          <p className="text-muted">Save a few products to compare and come back later.</p>
          <Link to="/shop" className="btn btn-dark rounded-pill mt-3">Browse products</Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlist.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
