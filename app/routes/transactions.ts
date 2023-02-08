import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const sessionId = request.cookies.session_id

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select('*')

      return {
        transactions,
      }
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string(),
      })
      const sessionId = request.cookies.session_id

      const { id } = getTransactionParamsSchema.parse(request.params)

      const transaction = await knex('transactions')
        .select('*')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      if (!transaction) {
        return reply.status(404).send()
      }

      return {
        transaction,
      }
    },
  )

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const sessionId = request.cookies.session_id

      const summary = await knex('transactions')
        .sum('amount', {
          as: 'amount',
        })
        .where('session_id', sessionId)
        .first()

      return {
        summary,
      }
    },
  )

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.session_id

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      reply.cookie('session_id', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const id = crypto.randomUUID()
    await knex('transactions').insert({
      id,
      title,
      amount: type === 'credit' ? amount : -amount,
      session_id: sessionId,
    })

    return reply.status(201).send({ id })
  })
}
