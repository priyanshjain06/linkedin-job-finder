export const generateSearchTerms = () => {
  const cities = [
    'Hyderabad',
    'Jaipur',
    'Ahmedabad',
    'Gurugram',
    'Gurgaon'
  ]

  //REVIEW Location 
  // 'Bangalore',
  //   'Pune',
  //   'Nodia',  
  //   'Delhi NCR',

  const titles = ['0 years of experience full stack engineer', '0 years of experience front end engineer', '0 years of experience back end engineer']

  //REVIEW -  Titles 
  // const titles = ['SDE Intern',"Software Intern","Software Engineer Intern","Software Developer Intern","Software Development Engineer Intern","Software Development Intern",'Software Engineer Trainee',"Software Developer Trainee","Software Development Engineer Trainee","Software Development Trainee"]
  

  //REVIEW time 
  //const time = '12 hours'
  //const time = '2 hours'
  //const time = '1 week'
  
  const time = '24 hours'

  return cities.map(city => ({
    city,
    searches: titles.map(
      title => `${title} posted in the past ${time} in ${city}`
    )
  }))
}
