import fs from 'fs'
import { chromium } from 'playwright-core'
import { generateSearchTerms } from './search-terms.js'
import { generateSearchUrl } from './search-url.js'
import {
  delay,
  printJobsTable,
  readSavedData,
  saveData,
  today
} from './util.js'

/*

"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  --remote-debugging-address=127.0.0.1 \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/Library/Application Support/BraveSoftware/Brave-Browser" \
  --profile-directory="Profile 1"

& "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" --remote-debugging-address=127.0.0.1 --remote-debugging-port=9222 --user-data-dir="$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\User Data" --profile-directory="Default"

*/

const extractJobs = async (page, uniqueJobIds) => {
  const jobCards = await page.$$('div[componentkey^="job-card-component-ref-"]')
  const realJobCards = jobCards.filter((_, i) => i % 2 !== 0)

  const jobs = []

  for (const jobCard of realJobCards) {
    const componentKey = await jobCard.getAttribute('componentkey')
    const jobId = componentKey?.split('-').pop()
    if (!jobId) continue

    if (uniqueJobIds && uniqueJobIds.has(jobId)) {
      continue
    }

    const cardContent = await jobCard.innerText()

    const isEasyApply = cardContent.includes('Easy Apply')

    await jobCard.click()
    await delay(7500)

    const descriptionElements = await page.$$(
      'div[data-testid="lazy-column"][data-component-type="LazyColumn"]'
    )
    const description = await descriptionElements[2]?.innerText()

    if (!description) {
      continue
    }

    let applyUrl
    if (!isEasyApply) {
      const applyButton = await page.$(
        '[aria-label="Apply on company website"]'
      )
      if (applyButton) {
        applyUrl = await applyButton.getAttribute('href')

        if (applyUrl) {
          applyUrl = new URL(applyUrl).searchParams.get('url')
        }
      }
    }

    jobs.push({
      url: page.url(),
      id: jobId,
      title: '',
      company: '',
      city: '',
      isEasyApply,
      applyUrl,
      cardContent,
      description: description || ''
    })
  }

  return jobs
}

export const findJobs = async () => {
  const startedAt = Date.now()
  const todayFile = today()

  const elapsedTime = () => {
    const totalSeconds = Math.floor((Date.now() - startedAt) / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [
      hours && `${hours}h`,
      (hours || minutes) && `${minutes}m`,
      `${seconds}s`
    ]
      .filter(Boolean)
      .join(' ')
  }

  if (!fs.existsSync('data')) {
    await fs.mkdirSync('data')
  }

  const finalData = readSavedData(todayFile)

  const searchCities = generateSearchTerms()

  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')
  const context = browser.contexts()[0]

  if (!context) {
    throw new Error('No Brave browser context found')
  }

  const pages = context.pages()
  const page = pages.at(-1) ?? (await context.newPage())

  page.setDefaultTimeout(60000)
  page.setDefaultNavigationTimeout(60000)

  for (let i = 0; i < searchCities.length; i++) {
    const searchCity = searchCities[i]
    if (!searchCity) {
      continue
    }

    const searchTerms = searchCity.searches

    for (let j = 0; j < searchTerms.length; j++) {
      console.info(
        `City ${i + 1}/${searchCities.length}: ${searchCity.city}, Progress: ${j + 1}/${searchTerms.length}, Overall Progress: ${i * searchTerms.length + j + 1}/${searchCities.length * searchTerms.length}, Elapsed: ${elapsedTime()}, Extracted Jobs: ${finalData.jobs.length}`
      )
      const searchTerm = searchTerms[j]
      if (!searchTerm) {
        continue
      }

      if (finalData.finishedSearchTerms.has(searchTerm)) {
        continue
      }

      const url = generateSearchUrl(searchTerm, 1)

      await page.goto(url)

      await delay(10000)

      {
        // Easy apply ones only for now
        const easyApplyButton = await page.$(
          'div[componentkey="SearchResults_filter_pill_JobSearchFacetSuggestionType_APPLY_WITH_LINKEDIN_Easy Apply"]'
        )
        if (!easyApplyButton) {
          console.info(
            `No easy apply button found for search term: ${searchTerm}, skipping...`
          )
          continue
        }
        await easyApplyButton.click()
        await delay(10000)
      }

      const addJobs = jobs => {
        const filteredJobs = jobs.filter(
          job => !finalData.uniqueJobIds.has(job.id)
        )
        if (filteredJobs.length) {
          filteredJobs.forEach(job => {
            finalData.uniqueJobIds.add(job.id)
            job.city = searchCity.city
            finalData.jobs.push(job)
          })
        }
      }

      const jobs = await extractJobs(page, finalData.uniqueJobIds)
      addJobs(jobs)

      let nextButton = await page.$(
        'button[data-testid="pagination-controls-next-button-visible"]'
      )

      let pageCounter = 1

      while (Boolean(nextButton)) {
        console.info(`Page ${++pageCounter}, Elapsed: ${elapsedTime()}`)
        await nextButton.click()
        await delay(10000)

        const jobs = await extractJobs(page)
        addJobs(jobs)

        nextButton = await page.$(
          'button[data-testid="pagination-controls-next-button-visible"]'
        )
      }

      finalData.finishedSearchTerms.add(searchTerm)

      saveData(todayFile, finalData)
    }
  }

  console.info(
    `Finished searching for jobs ${todayFile}, Elapsed: ${elapsedTime()}`
  )

  printJobsTable(finalData.jobs)
}

findJobs()
