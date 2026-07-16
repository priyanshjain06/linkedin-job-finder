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


  // const titles = ['SDE Intern',"Software Intern","Software Engineer Intern","Software Developer Intern","Software Development Engineer Intern","Software Development Intern",'Software Engineer Trainee',"Software Developer Trainee","Software Development Engineer Trainee","Software Development Trainee"]


  // const titles = ["Front End Intern","Front End Software Engineer Intern","Front End Software Developer Intern","Front End Software Development Intern","Back End Intern","Back End Software Engineer Intern","Back End Software Developer Intern","Back End Software Development Intern","Full Stack Intern","Full Stack Software Engineer Intern","Full Stack Software Developer Intern","Full Stack Software Development Intern"]

  
  //const time = '2 hours'
  const time = '24 hours'

  return cities.map(city => ({
    city,
    searches: titles.map(
      title => `${title} posted in the past ${time} in ${city}`
    )
  }))
}
