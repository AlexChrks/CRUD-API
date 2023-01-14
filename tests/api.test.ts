import request from 'supertest'
import { app as server } from '../src'

const state = { id: null }

describe('API tests', () => {
  describe('Suite 1', () => {
    it('\x1b[36mGet users\x1b[0m // Should return code 200', async () => {
      const response = await request(server).get('/api/users')
      expect(response.statusCode).toBe(200)
    })
    it("\x1b[36mNo age and hobby\x1b[0m // Should return 400 and 'The field age is required'", async () => {
      const response = await request(server)
        .post('/api/users')
        .send({ name: 'Jack' })
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe('The field age is required')
    })
    it("\x1b[36mNo hobby\x1b[0m // Should return 400 and 'The field hobby is required'", async () => {
      const response = await request(server)
        .post('/api/users')
        .send({ name: 'Jack', age: 17 })
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe('The field hobby is required')
    })
    it("\x1b[36mHobby is not Array\x1b[0m // Should return 400 and 'The field hobby is required'", async () => {
      const response = await request(server)
        .post('/api/users')
        .send({ name: 'Jack', age: 17, hobby: 123 })
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe('The field hobby is required')
    })
    it("\x1b[36mUserId is not uuid\x1b[0m // Should return 400 and 'UserId is not valid'", async () => {
      const response = await request(server)
        .put('/api/users/id?=123')
        .send({ name: 'Jack', age: 17, hobby: [] })
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe('UserId is not valid')
    })
  })
  describe('Suite 2', () => {
    it("\x1b[36mCreate user\x1b[0m // Should return 201 and 'User created successfully'", async () => {
      const response = await request(server)
        .post('/api/users')
        .send({ name: 'Jack', age: 17, hobby: ['hacking'] })
      state.id = response.body.users.id
      expect(response.statusCode).toBe(201)
      expect(response.body.message).toBe('User created successfully')
    })
    it('\x1b[36mReturn user by id\x1b[0m // Should return 200 and user entity', async () => {
      const response = await request(server).get(
        '/api/users/?id=' + state.id
      )
      expect(response.statusCode).toBe(200)
    })
    it('\x1b[36mUpdate user by id\x1b[0m // Should return 200 and updated user', async () => {
      const response = await request(server)
        .put('/api/users/?id=' + state.id)
        .send({
          name: 'Sammy',
          age: 30,
          hobby: ['games'],
        })
      expect(response.statusCode).toBe(200)
      expect(response.body.message).toBe('User successfully updated')
    })
    it("\x1b[36mDelete user by non-uuid\x1b[0m // Should return 400 and 'UserId is not valid'", async () => {
      const response = await request(server).delete(
        '/api/users/?id=' + 'someid'
      )
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe('UserId is not valid')
    })
  })
  describe('Suite 3', () => {
    it("\x1b[36mDelete not existing user\x1b[0m // Should return 404 and 'User not found'", async () => {
      const response = await request(server).delete(
        '/api/users/?id=aac190dc-78b3-4f7b-9cb4-54a985f811c4'
      )
      const message = JSON.parse(response.text).message
      expect(response.statusCode).toBe(404)
      expect(message).toBe('User not found')
    })
    it('\x1b[36mDelete user by uuid\x1b[0m // Should return 204', async () => {
      const response = await request(server).delete(
        '/api/users/?id=' + state.id
      )
      expect(response.statusCode).toBe(204)
    })
    it('\x1b[36mGet all users\x1b[0m // Should return 200 and empty array', async () => {
      const response = await request(server).get('/api/users')
      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual({ users: [] })
    })
    it("\x1b[36mUpdate not existing user\x1b[0m // Should return 404 and 'User not found'", async () => {
      const response = await request(server)
        .put('/api/users/?id=a3f29920-ef8d-456d-ab5c-263f43001237')
        .send({ name: 'Jack', age: 17, hobby: [] })
      expect(response.statusCode).toBe(404)
      expect(response.body.message).toBe('User not found')
    })
  })
})