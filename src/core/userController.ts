import {IncomingMessage} from 'http'
import {User} from '../models/User.js'
import {IQueryParams, IResponse} from '../types/types.js'
import {parse} from 'url'
import {createUser, deleteUser, getUsers, updateUser} from '../services/users.js'
import {formatJSONResponse} from '../utils/utils.js'

export const getRequestData = (
  request: IncomingMessage
): Promise<User> => {
  request.setEncoding('utf8')
  return new Promise((resolve) => {
    let body = ''
    request.on('data', (chunk: Buffer) => {
      body += chunk
    })
    request.on('end', () => {
      resolve(JSON.parse(body))
    })
  })
}

export const handleRequest = async (
  request: IncomingMessage
): Promise<IResponse | undefined> => {
  const query = parse(request.url as string, true).query as IQueryParams
  const params: IQueryParams = { id: undefined }
  if (query) {
    params.id = query.id
  }
  let body
  try {
    switch (request.method) {
      case 'GET':
        return await getUsers(params)
      case 'POST':
        body = await getRequestData(request)
        return await createUser(body)
      case 'PUT':
        body = await getRequestData(request)
        return updateUser(params, body)
      case 'DELETE':
        return await deleteUser(params)
    }
  } catch (errorMessage) {
    console.log(errorMessage)
    return formatJSONResponse({ message: 'Unhandled error' }, 500)
  }
}