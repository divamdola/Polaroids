import styles from './Pagination.module.css'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className={`d-flex justify-content-center align-items-center gap-2 mt-4 ${styles.nav}`} aria-label="Pagination">
      <button type="button" className={`btn btn-sm ${styles.pageButton}`} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Prev
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button type="button" className={`btn btn-sm ${styles.pageButton}`} disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </nav>
  )
}
