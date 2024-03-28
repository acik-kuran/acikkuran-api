const { isCacheEnabled } = require('../config')

async function cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply }) {
  const cachePrefix = process.env.CACHE_PREFIX || process.env.ENVIRONMENT
  const prefixedCacheKey = `${cachePrefix}-${cacheKey}`

  console.log('---\n')

  // skip cache-related operations if ENVIRONMENT is 'test'
  if (!isCacheEnabled) {
    return fetchAndReply().then((response) => {
      if (response.data.error) {
        console.log('ERROR!')
        reply.code(404).send(response)
        return reply
      } else {
        console.log('--- GET FROM DB!', prefixedCacheKey)
        reply.send(response)
        return reply
      }
    })
  } else {
    await fastify.cache.get(prefixedCacheKey).then(async (cachedResult) => {
      if (cachedResult?.item) {
        // if in cache, reply with the cached result
        console.log('@@@ GET FROM CACHE', prefixedCacheKey)
        reply.send(cachedResult?.item)
        return reply
      } else {
        // if not in cache or cache is skipped, fetch from DB and cache the result
        return fetchAndReply().then((response) => {
          if (response.data.error) {
            console.log('ERROR!')
            reply.code(404).send(response)
            return reply
          } else {
            if (response.data.length > 0) {
              // if response is not empty, cache the result
              fastify.cache
                .set(prefixedCacheKey, response, 252800000)
                .then((res) => {
                  console.log('### CACHE HAS BEEN SET', res, prefixedCacheKey)
                })
            }
            reply.send(response)
            return reply
          }
        })
      }
    })
  }
}

module.exports = cacheOrFetch
