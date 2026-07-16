export const generateSearchTerms = () => {
  const cities = [
    'Hyderabad',
    'Jaipur',
    'Ahmedabad',
    'Gurugram',
    'Gurgaon'
  ]

  // 'Bangalore',
  //   'Pune',
  //   'Nodia',  
  //   'Delhi NCR',

  
  const titles = ['0 years of experience full stack engineer', '0 years of experience front end engineer', '0 years of experience back end engineer']


  //   const titles = [
  //   "Software Engineer Intern",
  //   "SDE Intern",
  //   "Software Developer Intern",
  //   "Front End Intern",
  //   "Back End Intern"
  // ]


  //const time = '2 hours'
  const time = '24 hours'

  return cities.map(city => ({
    city,
    searches: titles.map(
      title => `${title} posted in the past ${time} in ${city}`
    )
  }))
}
