import styles from './ShopSkeleton.module.css'

export default function ShopSkeleton() {
  return (
    <div className="row g-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="col-md-6 col-lg-4">
          <div className={`card h-100 ${styles.card}`}>
            <div className={styles.image} />
            <div className="card-body p-4">
              <div className={styles.line} />
              <div className={`${styles.line} ${styles.lineSm}`} />
              <div className={`${styles.line} ${styles.lineMd}`} />
              <div className={`${styles.line} ${styles.lineShort}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
