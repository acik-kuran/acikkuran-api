const cacheOrFetch = require('../utils/cacheOrFetch')

async function routes(fastify) {
  fastify.get('/authors', async (_, reply) => {
    const cacheKey = `a`

    const fetchAndReply = async () => {
      const authorResult = await fastify.pg.query(
        'SELECT * FROM acikkuran_authors'
      )

      if (authorResult?.rows?.length > 0) {
        return { data: authorResult.rows }
      } else {
        return { data: { error: 'no-authors' } }
      }
    }

    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })
}

module.exports = routes
