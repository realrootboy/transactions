import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
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
