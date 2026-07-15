const LIMIT = 25

export const generateSearchUrl = (searchTerm, page) => {
  const start = (page - 1) * LIMIT
  const encodedSearchTerm = encodeURIComponent(searchTerm)
  return `https://www.linkedin.com/jobs/search-results/?keywords=${encodedSearchTerm}&origin=SEMANTIC_SEARCH_LANDING_PAGE${start ? `&start=${start}` : ''}`
}
