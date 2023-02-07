import { env } from './env'
import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
  const transaction = await knex('transactions').select('*')

  return transaction
})

app
  .listen({
    port: Number(env.PORT),
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Server is running')
  })
