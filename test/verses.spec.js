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

tap.test('GET `/surah/1/verse/1` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/1',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.surah?.id, 1)
      t.equal(JSON.parse(response.payload).data?.verse_number, 1)
      t.equal(
        JSON.parse(response.payload).data?.translation?.author?.id,
        defaultAuthors['tr']
      )
      t.end()
    }
  )
})

tap.test('GET `/surah/undefined/verse/1` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/undefined/verse/1',
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

tap.test('GET `/surah/1/verse/undefined` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/undefined',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-verse-number')
      t.end()
    }
  )
})

tap.test('GET `/surah/123/verse/1` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/123/verse/1',
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

tap.test('GET `/surah/1/verse/111` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/111',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-verse-number')
      t.end()
    }
  )
})

tap.test('GET `/surah/1/verse/1?author=103` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/1?author=103',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.surah?.id, 1)
      t.equal(JSON.parse(response.payload).data?.verse_number, 1)
      t.equal(JSON.parse(response.payload).data?.translation?.author?.id, 103)
      t.end()
    }
  )
})

tap.test('GET `/surah/1/verse/1?author=undefined` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/1?author=undefined',
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

tap.test('GET `/surah/1/verse/1?author=111111` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/1?author=111111',
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

tap.test('GET `/surah/1/verse/1/translations` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/1/translations',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.[0]?.author.id, 3)
      t.end()
    }
  )
})

tap.test('GET `/surah/undefined/verse/111/translations` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/undefined/verse/111/translations',
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

tap.test('GET `/surah/1/verse/111/translations` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/111/translations',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-verse-number')
      t.end()
    }
  )
})

tap.test('GET `/surah/1/verse/1/verseparts` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/1/verseparts',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.[0]?.root?.id, 1)
      t.end()
    }
  )
})

tap.test('GET `/surah/1/verse/1/words` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/1/words',
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

tap.test('GET `/surah/undefined/verse/1/words` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/undefined/verse/1/words',
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

tap.test('GET `/surah/1/verse/undefined/words` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/undefined/words',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-verse-number')
      t.end()
    }
  )
})

tap.test('GET `/surah/1/verse/111/words` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/surah/1/verse/111/words',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-verse-number')
      t.end()
    }
  )
})
