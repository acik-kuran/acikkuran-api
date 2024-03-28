const tap = require('tap')
const buildFastify = require('../app')
const defaultAuthors = require('../data/defaultAuthors')

let fastify = null
tap.beforeEach(() => {
  fastify = buildFastify()
})

tap.afterEach(() => {
  fastify.close()
})

tap.test('GET `/page/0` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/page/0',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.[0]?.id, 1)
      t.equal(JSON.parse(response.payload).data?.[0]?.surah?.name, 'Fatiha')
      t.equal(JSON.parse(response.payload).data?.[0]?.zero, null)
      t.equal(
        JSON.parse(response.payload).data?.[0]?.translation?.author?.id,
        defaultAuthors['tr']
      )
      t.end()
    }
  )
})

tap.test('GET `/page/1` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/page/1',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.[0]?.id, 8)
      t.equal(JSON.parse(response.payload).data?.[0]?.surah?.name, 'Bakara')
      t.equal(JSON.parse(response.payload).data?.[0]?.zero?.id, 1)
      t.equal(
        JSON.parse(response.payload).data?.[0]?.zero?.translation?.author?.id,
        defaultAuthors['tr']
      )
      t.equal(
        JSON.parse(response.payload).data?.[0]?.translation?.author?.id,
        defaultAuthors['tr']
      )
      t.end()
    }
  )
})

tap.test('GET `/page/1?author=103` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/page/1?author=103',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.[0]?.id, 8)
      t.equal(JSON.parse(response.payload).data?.[0]?.surah?.name, 'Bakara')
      t.equal(JSON.parse(response.payload).data?.[0]?.zero?.id, 1)
      t.equal(
        JSON.parse(response.payload).data?.[0]?.zero?.translation?.author?.id,
        103
      )
      t.equal(
        JSON.parse(response.payload).data?.[0]?.translation?.author?.id,
        103
      )
      t.end()
    }
  )
})

tap.test('GET `/page/8976` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/page/8976',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-page-number')
      t.end()
    }
  )
})

tap.test('GET `/page/1?author=31312` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/page/1?author=31312',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-author')
      t.end()
    }
  )
})

tap.test('GET `/page/1?author=asd` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/page/asd',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-page-number')
      t.end()
    }
  )
})
