import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')

    return {
      transactions,
    }
  })

  app.get('/:id', async (request, reply) => {
    const getTransactionParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions')
      .select('*')
      .where('id', id)
      .first()

    if (!transaction) {
      return reply.status(404).send()
    }

    return {
      transaction,
    }
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', {
        as: 'amount',
      })
      .first()

    return {
      summary,
    }
  })

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    const id = crypto.randomUUID()
    await knex('transactions')
      .insert({
        id,
        title,
        amount: type === 'credit' ? amount : -amount,
      })
      .returning('id')

    return reply.status(201).send({ id })
  })
}
