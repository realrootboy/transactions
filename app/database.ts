import { Knex, knex as setupKnex } from 'knex'

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
const dbName = process.env.DB_NAME

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
