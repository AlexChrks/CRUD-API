import {IncomingMessage, ServerResponse} from 'http'
import { handleRequest } from './userController.js'

export const router = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  try {
    const data = await handleRequest(request)
    if (data) {
      const { headers, body, statusCode } = data
      response.writeHead(statusCode, '', headers)
      response.write(body)
      response.end()
    }
  } catch (e) {
    throw new Error()
  }
}