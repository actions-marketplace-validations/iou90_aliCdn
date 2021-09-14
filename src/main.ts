import * as core from '@actions/core'
import axios from 'axios'

import {getUrl, Parameters} from './sdk'

interface CdnError {
  response?: {data?: {Message: string}}
}

const run: () => Promise<void> = async () => {
  try {
    const accessKeyId = core.getInput('accessKeyId')
    const appSecret = core.getInput('appSecret')
    const version = core.getInput('version')
    const action = core.getInput('action')
    const parametersInputs = core.getInput('parameters')
    const parameters: Parameters = {}
    if (parametersInputs) {
      for (const {key, value} of JSON.parse(parametersInputs)) {
        parameters[key] = value
      }
    }
    try {
      const url = getUrl(accessKeyId, appSecret, action, parameters, version)
      const result = await axios.get(url)
      if (result?.data) {
        core.setOutput('result', JSON.stringify(result.data))
      }
    } catch (error) {
      console.error((error as CdnError)?.response?.data?.Message)
      core.setFailed((error as Error).message)
    }
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
