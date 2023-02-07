import { env } from './env'
import { Knex, knex as setupKnex } from 'knex'

const dbHost = env.DB_HOST
const dbPort = env.DB_PORT
const dbUser = env.DB_USER
const dbPass = env.DB_PASS
const dbName = env.DB_NAME

export const config: Knex.Config = {
  client: 'mysql',
  connection: {
    host: dbHost,
    port: Number(dbPort),
    user: dbUser,
    password: dbPass,
    database: dbName,
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
