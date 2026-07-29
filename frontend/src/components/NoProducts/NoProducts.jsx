import { FiSearch, FiRefreshCcw } from 'react-icons/fi'
import Button from '../Button/Button'
import styles from './NoProducts.module.css'

export default function NoProducts({ onClearFilters }) {
  return (
    <div className={`text-center py-5 px-4 ${styles.container}`}>
      <div className={styles.iconWrap}>
        <FiSearch size={24} />
      </div>
      <h3 className="fw-semibold mb-2">No products found</h3>
      <p className="text-muted mb-4">Try adjusting your search or filters to discover something new.</p>
      <Button variant="outline" onClick={onClearFilters}>
        <FiRefreshCcw className="me-2" /> Reset filters
      </Button>
    </div>
  )
}
