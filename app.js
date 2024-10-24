const Fastify = require('fastify')
const Postgres = require('@fastify/postgres')

const FastifyCors = require('@fastify/cors')
const { isCacheEnabled } = require('./config')

require('dotenv').config()

let IORedis, FastifyRedis, RedisClient, Abcache, AbstractCache, FastifyCaching

// if isCacheEnabled is true, require Redis and AbstractCache
if (isCacheEnabled) {
  IORedis = require('ioredis')
  AbstractCache = require('abstract-cache')
  FastifyRedis = require('@fastify/redis')
  FastifyCaching = require('@fastify/caching')
  RedisClient = new IORedis(process.env.REDIS_URL)
  Abcache = AbstractCache({
    useAwait: true,
    driver: {
      name: 'abstract-cache-redis',
      options: { client: RedisClient },
    },
  })
}

function buildFastify() {
  const fastify = Fastify({
    logger: {
      level: 'info',
      serializers: {
        req: function (req) {
          const referer = req?.headers?.referer
          const remoteAddress = req?.socket?.remoteAddress
          return { url: req.url, referer, remoteAddress }
        },
      },
      // file: "./.logs/zieg.json", // Will use pino.destination()
    },
  })

  // if isCacheEnabled is true, register Redis and Caching plugins
  if (isCacheEnabled) {
    fastify
      .register(FastifyRedis, { client: RedisClient })
      .register(FastifyCaching, { cache: Abcache })
  }

  fastify.register(
    Postgres,
    {
      connectionString: process.env.DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    {
      logLevel: 'debug',
    }
  )

  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (_, reply) => {
      reply.send({
        name: 'Açık Kuran API',
        repository: 'https://github.com/ziegfiroyt/acikkuran-api',
        website: 'https://acikkuran.com',
        author: 'Uğur Sözen <x.com/ziegfiroyt>',
        email: 'selam@acikkuran.com',
      })
    },
  })

  fastify.register(require('./routes/authors'), { logLevel: 'debug' })
  fastify.register(require('./routes/surahs'), { logLevel: 'debug' })
  fastify.register(require('./routes/verses'), { logLevel: 'debug' })
  fastify.register(require('./routes/roots'), { logLevel: 'debug' })
  fastify.register(require('./routes/pages'), { logLevel: 'debug' })
  fastify.register(require('./routes/searches'), { logLevel: 'debug' })
  fastify.register(require('./routes/zieg/surahs'), { logLevel: 'debug' })

  fastify.register(FastifyCors, {
    origin: '*',
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  })

  return fastify
}

module.exports = buildFastify
