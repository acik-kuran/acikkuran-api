const tap = require("tap");
const buildFastify = require("../app");

let fastify = null;
tap.beforeEach(() => {
  fastify = buildFastify();
});

tap.afterEach(() => {
  fastify.close();
});

tap.test("GET `/search?q=` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.equal(JSON.parse(response.payload).data?.redirect, "/30/30");
      t.end();
    }
  );
});

tap.test("GET `/search?q=undefined` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=undefined",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.ok(JSON.parse(response.payload).data?.hits.length == 0);
      t.end();
    }
  );
});

tap.test("GET `/search?q=1` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=1",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.equal(JSON.parse(response.payload).data?.redirect, "/1");
      t.end();
    }
  );
});

tap.test("GET `/search?q=ba` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=ba",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.equal(JSON.parse(response.payload).data?.error, "min-char");
      t.end();
    }
  );
});

tap.test("GET `/search?q=1/1` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=1/1",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.equal(JSON.parse(response.payload).data?.redirect, "/1/1");
      t.end();
    }
  );
});

tap.test("GET `/search?q=1:1` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=1:1",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.equal(JSON.parse(response.payload).data?.redirect, "/1/1");
      t.end();
    }
  );
});

tap.test("GET `/search?q=bakara 1` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=bakara 1",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.equal(JSON.parse(response.payload).data?.redirect, "/2/1");
      t.end();
    }
  );
});

tap.test("GET `/search?q=bakara` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=bakara",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.ok(JSON.parse(response.payload).data?.surahs?.length);
      t.ok(!JSON.parse(response.payload).data?.verses?.length);
      t.ok(JSON.parse(response.payload).data?.hits?.[0]?._rankingScore > 0.8);
      t.ok(
        JSON.parse(response.payload).data?.hits?.[0]?._formatted.text.includes(
          "<em>bakara</em>"
        )
      );
      t.equal(JSON.parse(response.payload).data?.query, "bakara");
      t.equal(JSON.parse(response.payload).data?.page, 1);
      t.ok(JSON.parse(response.payload).data?.totalPages > 0);
      t.end();
    }
  );
});

tap.test("GET `/search?q=baqara&lang=en` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=baqara&lang=en",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.ok(JSON.parse(response.payload).data?.surahs?.length);
      t.ok(!JSON.parse(response.payload).data?.verses?.length);
      t.equal(
        JSON.parse(response.payload).data?.hits?.[0]?.author.language,
        "en"
      );
      t.equal(JSON.parse(response.payload).data?.query, "baqara");
      t.equal(JSON.parse(response.payload).data?.page, 1);
      t.ok(JSON.parse(response.payload).data?.totalHits > 0);
      t.end();
    }
  );
});

tap.test("GET `/search?q=baqara&lang=zw` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=baqara&lang=zw",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 404);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.equal(JSON.parse(response.payload).data?.error, "invalid-language");
      t.end();
    }
  );
});

tap.test("GET `/search?q=bakara&page=0` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=bakara&page=0",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 404);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.equal(JSON.parse(response.payload).data?.error, "invalid-page-number");

      t.end();
    }
  );
});

tap.test("GET `/search?q=1&type=quick` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=1&type=quick",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.ok(JSON.parse(response.payload).data?.surahs?.length);
      t.ok(!JSON.parse(response.payload).data?.verses?.length);
      t.ok(!JSON.parse(response.payload).data?.hits?.length);
      t.end();
    }
  );
});

tap.test("GET `/search?q=1:1&type=quick` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=1:1&type=quick",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.ok(!JSON.parse(response.payload).data?.surahs?.length);
      t.ok(JSON.parse(response.payload).data?.verses?.length);
      t.ok(!JSON.parse(response.payload).data?.hits?.length);
      t.end();
    }
  );
});

tap.test("GET `/search?q=bakara 1&type=quick` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/search?q=bakara 1",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.equal(JSON.parse(response.payload).data?.redirect, "/2/1");
      t.end();
    }
  );
});

tap.test("GET `/random-search` route", (t) => {
  fastify.inject(
    {
      method: "GET",
      url: "/random-search",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["access-control-allow-origin"], "*");
      t.ok(JSON.parse(response.payload).data?.hits?.length === 10);
      t.end();
    }
  );
});
