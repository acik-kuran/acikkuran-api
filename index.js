const buildFastify = require('./app')
const fastify = buildFastify()

fastify.listen(
  { host: process.env.HTTP_HOST, port: process.env.HTTP_PORT },
  (err) => {
    if (err) throw err
    console.log(`Server listening on  ${fastify.server.address().port}`)
  }
)
