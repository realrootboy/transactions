import { env } from './env'
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: Number(env.PORT),
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Server is running')
  })
