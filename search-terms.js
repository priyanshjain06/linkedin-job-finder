export const generateSearchTerms = () => {
  const cities = [
    'Hyderabad',
    'Jaipur',
    'Ahmedabad',
    'Gurugram',
    'Gurgaon'
  ]

  const titles = ['Full Stack Engineer', 'AI Engineer']

  // const time = 'week'
  const time = '24 hours'

  return cities.map(city => ({
    city,
    searches: titles.map(
      title => `${title} posted in the past ${time} in ${city}`
    )
  }))
}
