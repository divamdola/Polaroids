import { useEffect } from 'react'

export function usePageTitle(title, description) {
  useEffect(() => {
    const baseTitle = 'Polaroid Store'
    document.title = title ? `${title} | ${baseTitle}` : baseTitle

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', description)
    }
  }, [title, description])
}
