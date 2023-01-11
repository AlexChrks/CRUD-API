import {createServer} from 'http'
import { Database } from './database/database.js'
import { router } from './core/router.js'
import * as dotenv from 'dotenv'
dotenv.config()

const port: number = process.env.PORT as unknown as number ?? 3001
const host: string = process.env.HOST ?? 'localhost'

export const database = new Database()

const app = createServer()

app.listen(port, host, (): void => {
  console.log(`Server is running on ${host}:${port}`)
  app.on('request', router)
})
