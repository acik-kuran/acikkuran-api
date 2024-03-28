const tap = require("tap");
const buildFastify = require("../app");

let fastify = null;
tap.beforeEach(() => {
  fastify = buildFastify();
});

tap.afterEach(() => {
  fastify.close();
});

tap.test("GET `/authors` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/authors",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.ok(JSON.parse(response.payload).data?.length > 0);
      t.end();
    }
  );
});
