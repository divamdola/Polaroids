import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'
import ProductCard from '../../components/ProductCard/ProductCard'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import { useStore } from '../../context/StoreContext'

const collectionHighlights = [
  {
    title: 'Instant Cameras',
    description: 'Pocket-size classics for spontaneous, colorful moments.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Film & Accessories',
    description: 'Everything you need to keep your creativity flowing.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Lifestyle Essentials',
    description: 'Thoughtful pieces made to carry your story every day.',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
  },
]

export default function Collections() {
  const { products } = useStore()

  const featuredProducts = products.filter((product) =>
    ['Cameras', 'Accessories', 'Bags', 'Albums'].includes(product.category),
  )

  return (
    <section className="container py-5">
      <SectionHeading
        eyebrow="Curated stories"
        title="Collections designed for everyday creativity"
        text="Browse our most beloved edit of cameras, accessories, and timeless pieces made to keep your memories close."
      />

      <div className="row g-4 mt-2">
        {collectionHighlights.map((collection, index) => (
          <motion.div
            key={collection.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="col-md-6 col-lg-4"
          >
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
              <img src={collection.image} alt={collection.title} className="img-fluid" style={{ height: '220px', objectFit: 'cover' }} />
              <div className="card-body p-4">
                <h4 className="fw-semibold mb-3">{collection.title}</h4>
                <p className="text-muted mb-3">{collection.description}</p>
                <Link to="/shop">
                  <Button variant="outline">Browse collection</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-5">
        <SectionHeading eyebrow="Featured edit" title="A closer look at the collection" text="Our most-loved pieces are ready to bring home today." />
        <div className="row g-4">
          {featuredProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="col-md-6 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
