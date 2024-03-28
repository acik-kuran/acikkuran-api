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

tap.test('GET `/root/latin/qwm` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/root/latin/qwm',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.id, 13)
      t.equal(JSON.parse(response.payload).data?.latin, 'qwm')
      t.end()
    }
  )
})

tap.test('GET `/root/latin/1` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/root/latin/1',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-latin-char')
      t.end()
    }
  )
})

tap.test('GET `/root/latin/undefined` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/root/latin/undefined',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-latin-char')
      t.end()
    }
  )
})

tap.test('GET `/root/latin/qwm/verseparts` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/root/latin/qwm/verseparts',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.[0]?.root.latin, 'qwm')
      t.equal(
        JSON.parse(response.payload).data?.[0]?.verse.translation.author.id,
        defaultAuthors['tr']
      )
      t.end()
    }
  )
})

tap.test('GET `/root/latin/qwm/verses` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/root/latin/qwm/verses',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.[0]?.root.latin, 'qwm')
      t.equal(
        JSON.parse(response.payload).data?.[0]?.verse.translation.author.id,
        defaultAuthors['tr']
      )
      t.end()
    }
  )
})

tap.test('GET `/root/latin/qwm/verses?author=103` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/root/latin/qwm/verses?author=103',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.[0]?.root.latin, 'qwm')
      t.equal(
        JSON.parse(response.payload).data?.[0]?.verse.translation.author.id,
        103
      )
      t.end()
    }
  )
})

tap.test('GET `/root/latin/qwm/verses?author=undefined` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/root/latin/qwm/verses?author=undefined',
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

tap.test('GET `/root/latin/qwm/verses?author=10000` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/root/latin/qwm/verses?author=10000',
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

tap.test('GET `/root/latin/123/verses` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/root/latin/123/verses',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-latin-char')
      t.end()
    }
  )
})

tap.test('GET `/root/latin/qwm/verses?page=-1` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/root/latin/qwm/verses?page=-1',
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

tap.test('GET `/rootchars` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/rootchars',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.ok(JSON.parse(response.payload).data?.length > 0)
      t.equal(JSON.parse(response.payload).data?.[0]?.id, 1)
      t.end()
    }
  )
})

tap.test('GET `/rootchar/1` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/rootchar/1',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.ok(JSON.parse(response.payload).data?.length > 0)
      t.equal(JSON.parse(response.payload).data?.[0]?.id, 1)
      t.end()
    }
  )
})

tap.test('GET `/rootchar/undefined` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/rootchar/undefined',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-rootchar-id')
      t.end()
    }
  )
})

tap.test('GET `/rootchar/123456` route', (t) => {
  fastify.inject(
    {
      method: 'GET',
      url: '/rootchar/123456',
    },
    (err, response) => {
      t.error(err)
      t.equal(response.statusCode, 404)
      t.equal(response.headers['access-control-allow-origin'], '*')
      t.equal(JSON.parse(response.payload).data?.error, 'invalid-rootchar-id')
      t.end()
    }
  )
})
