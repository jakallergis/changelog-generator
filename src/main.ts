import fs from 'fs'
import {getInput, setFailed} from '@actions/core'
import getGitCommits from './utils/getGitCommits'
import {getCurrentVersion} from './utils/getCurrentVersion'
import {extractCurrentChangelog} from './utils/extractCurrentChangelog'
import formatUnicorn from './utils/formatUnicorn'

async function run(): Promise<void> {
  try {
    const repo = getInput('repo')
    const owner = getInput('owner')
    const ctx = {repo, owner}

    const version = getCurrentVersion()
    const commits = getGitCommits()
    const newChangelog = extractCurrentChangelog(commits, version)
    const formattedLog = formatUnicorn(newChangelog, ctx)

    const currentLog = fs.readFileSync('./CHANGELOG.md', 'utf-8')
    fs.writeFileSync('./CHANGELOG.md', `${formattedLog}${currentLog}`)
  } catch (error) {
    console.log({error})
    setFailed(error.message)
  }
}

void run()
