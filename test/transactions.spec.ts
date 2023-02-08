import { expect, test, beforeAll, afterAll, beforeEach, describe } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app/app'

describe('Transaction routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('POST /transactions', async () => {
    const response = await request(app.server).post('/transactions').send({
      amount: 100,
      title: 'Test',
      type: 'credit',
    })

    expect(response.status).toBe(201)
  })

  test('GET /transactions', async () => {
    const cookie = (
      await request(app.server).post('/transactions').send({
        amount: 100,
        title: 'Test',
        type: 'credit',
      })
    ).get('Set-Cookie')

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)

    expect(response.status).toBe(200)
    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        amount: 100,
        title: 'Test',
        id: expect.any(String),
      }),
    ])
  })

  test('GET /transactions/:id', async () => {
    const requestCreation = await request(app.server)
      .post('/transactions')
      .send({
        amount: 100,
        title: 'Test',
        type: 'credit',
      })

    const cookie = requestCreation.get('Set-Cookie')

    const transactionId = requestCreation.body.id

    const response = await request(app.server)
      .get('/transactions/' + transactionId)
      .set('Cookie', cookie)

    expect(response.status).toBe(200)
    expect(response.body.transaction).toEqual(
      expect.objectContaining({
        amount: 100,
        title: 'Test',
        id: transactionId,
      }),
    )
  })

  test('GET /transactions/summary', async () => {
    const cookie = (
      await request(app.server).post('/transactions').send({
        amount: 100,
        title: 'Test',
        type: 'credit',
      })
    ).get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .send({
        amount: 30,
        title: 'Test',
        type: 'debit',
      })
      .set('Cookie', cookie)

    const response = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie)

    expect(response.status).toBe(200)
    expect(response.body.summary).toEqual({
      amount: 70,
    })
  })
})
