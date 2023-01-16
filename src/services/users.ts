import { formatJSONResponse } from '../utils/utils.js'
import { User } from '../models/User.js'
import { IResponse, IQueryParams } from "../types/types.js";
import { v4 as uuid, validate as validateUuid } from 'uuid'
import {database} from "../index.js";

export const getUsers = async (
  params?: IQueryParams
): Promise<IResponse> => {
  if (params && params.id) {
    const user = await database.getUserById(params.id)
    if (user) {
      return formatJSONResponse({ users: user }, 200)
    } else {
      return formatJSONResponse({ message: 'User not found' }, 400)
    }
  } else {
    const users = await database.getUsers()
    console.log(users)
    return formatJSONResponse({ users }, 200)
  }
}

export const createUser = async (
  data: Omit<User, 'id'>
): Promise<IResponse> => {
  if (data) {
    const id = uuid()
    const { name, age, hobby } = data
    const user = new User(name, age, hobby, id)
    for (const key in user) {
      // @ts-ignore
      if (user[key] === undefined && key !== 'id') {
        return formatJSONResponse(
          {
            message: `The field ${key} is required`,
          },
          400
        )
      }
    }
    user.id = id
    await database.addUser(user)
    return formatJSONResponse(
      { message: 'User created successfully', users: user },
      201
    )
  } else {
    return formatJSONResponse({ message: 'Not contain something' }, 400)
  }
}

export const updateUser = async (
  params: IQueryParams,
  data: Omit<User, 'id'>
) => {
  const { id } = params
  if (!validateUuid(<string>id)) {
    return formatJSONResponse({ message: 'UserId is not valid' }, 400)
  }
  if (id) {
    const currentUser = await database.getUserById(id)
    if (currentUser) {
      const { name, age, hobby } = data
      const user = new User(name, age, hobby, id)
      for (const key in user) {
        // @ts-ignore
        if (user[key] === undefined && key !== 'id') {
          return formatJSONResponse(
            {
              message: `The field ${key} is required`,
            },
            400
          )
        }
      }
      await database.updateUser(user)
      return formatJSONResponse(
        { message: 'User successfully updated', users: user },
        200
      )
    } else {
      return formatJSONResponse({ message: 'User not found' }, 404)
    }
  }
}
export const deleteUser = async (params: IQueryParams) => {
  const { id } = params
  if (!validateUuid(<string>id)) {
    return formatJSONResponse({ message: 'UserId is not valid' }, 400)
  }
  if (id) {
    const user = await database.getUserById(id)
    if (user) {
      await database.deleteUser(user)
      return formatJSONResponse(
        { message: 'User successfully deleted' },
        204
      )
    } else {
      return formatJSONResponse({ message: 'User not found' }, 404)
    }
  }
}