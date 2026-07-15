import fs from 'fs'

export const today = () => {
  const today = new Date()
  const year = today.getUTCFullYear()
  const month = today.getUTCMonth() + 1
  const date = today.getUTCDate()

  return `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export const readSavedData = todayFile => {
  const savedData = {
    finishedSearchTerms: new Set(),
    jobs: [],
    uniqueJobIds: new Set()
  }

  if (fs.existsSync(`data/${todayFile}.json`)) {
    const existingData = JSON.parse(
      fs.readFileSync(`data/${todayFile}.json`, 'utf-8')
    )
    savedData.finishedSearchTerms = new Set(
      existingData.finishedSearchTerms || []
    )
    savedData.jobs = existingData.jobs || []
    savedData.uniqueJobIds = new Set(savedData.jobs.map(job => job.id))
  }
  return savedData
}

export const saveData = (todayFile, data) => {
  fs.writeFileSync(
    `data/${todayFile}.json`,
    JSON.stringify(
      {
        finishedSearchTerms: Array.from(data.finishedSearchTerms),
        jobs: data.jobs
      },
      null,
      2
    ),
    'utf-8'
  )
}

export const printJobsTable = jobs => {
  const counts = {}
  for (const j of jobs) {
    if (!counts[j.city]) {
      counts[j.city] = 0
    }
    counts[j.city]++
  }
  console.table([
    ...Object.entries(counts).map(([City, Count]) => ({ City, Count })),
    {
      City: 'Total',
      Count: jobs.length
    }
  ])
}
