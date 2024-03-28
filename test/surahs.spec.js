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

tap.test('GET `/surahs` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surahs',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.[0]?.id, 1)
      t.end()
    }
  )
})

tap.test('GET `/surah/1` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.id, 1)
      t.equal(JSON.parse(response.payload).data?.name, 'Fatiha')
      t.equal(JSON.parse(response.payload).data?.zero, null)
      t.equal(
        JSON.parse(response.payload).data?.verses[0]?.translation?.author?.id,
        defaultAuthors['tr']
      )
      t.end()
    }
  )
})

tap.test('GET `/surah/2?author=103` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/2?author=103',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.id, 2)
      t.equal(JSON.parse(response.payload).data?.name, 'Bakara')
      t.equal(JSON.parse(response.payload).data?.zero?.id, 1)
      t.equal(
        JSON.parse(response.payload).data?.zero?.translation?.author?.id,
        103
      )
      t.equal(
        JSON.parse(response.payload).data?.verses[0]?.translation?.author?.id,
        103
      )
      t.end()
    }
  )
})

tap.test('GET `/surah/1?author=103` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1?author=103',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.id, 1)
      t.equal(JSON.parse(response.payload).data?.name, 'Fatiha')
      t.equal(
        JSON.parse(response.payload).data?.verses?.[0]?.translation?.author?.id,
        103
      )
      t.end()
    }
  )
})

tap.test('GET `/surah/1?author=250` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1?author=250',
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

tap.test('GET `/surah/1?author=asd` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1?author=asd',
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

tap.test('GET `/surah/150` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/150',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-surah-id')
      t.end()
    }
  )
})
