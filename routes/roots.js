const { isNumeric } = require('../utils/funcs')
const wordDetails = require('../data/wordDetails')
const cacheOrFetch = require('../utils/cacheOrFetch')
const defaultAuthors = require('../data/defaultAuthors')

async function routes(fastify) {
  // ----------------------------
  // GET /root/latin/:latin
  // ----------------------------

  fastify.get('/root/latin/:latin', async (req, reply) => {
    const latin = req.params.latin

    const cacheKey = `rl-${latin}`

    // define a helper function for fetching roots and sending a reply
    const fetchAndReply = async () => {
      if (!latin || isNumeric(latin)) {
        return { data: { error: 'invalid-latin-char' } }
      }

      const rootLatinResult = await fastify.pg.query(
        'SELECT r.id, r.latin, r.arabic, r.transcription, r.transcription_en, r.mean, r.mean_en, r.rootchar_id, ' +
          "(CASE WHEN COUNT(rd.id) > 0 THEN jsonb_agg(jsonb_build_object('id', rd.id, 'diff', rd.diff, 'count', rd.count)) ELSE '[]'::jsonb END) as rootdiffs " +
          'FROM acikkuran_roots r ' +
          'LEFT JOIN acikkuran_rootdiffs rd ON rd.root_id = r.id ' +
          'WHERE r.latin = $1 GROUP by r.id',
        [latin]
      )

      if (rootLatinResult.rows.length > 0) {
        const item = rootLatinResult.rows[0]
        return {
          data: {
            id: item.id,
            latin: item.latin,
            arabic: item.arabic,
            transcription: item.transcription,
            transcription_en: item.transcription_en || item.transcription,
            mean: item.mean,
            mean_en: item.mean_en || item.mean,
            diffs: item.rootdiffs,
            rootchar_id: item.rootchar_id,
          },
        }
      } else {
        return { data: { error: 'invalid-latin-char' } }
      }
    }

    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })

  // ----------------------------
  // GET /root/latin/:latin/verses
  // ----------------------------
  // This endpoint is no longer supported due to structural changes.
  // The data may be outdated and will soon be deprecated.
  // Please use the GET /root/latin/:latin/verseparts endpoint instead.
  // ----------------------------

  fastify.get('/root/latin/:latin/verses', async (req, reply) => {
    const latin = req.params.latin
    const author_id = req.query.author || defaultAuthors['tr']
    const page = +req.query.page || 1

    const cacheKey = `rl-${latin}-a${author_id}-p${page}`

    const fetchAndReply = async () => {
      if (!latin || isNumeric(latin)) {
        return { data: { error: 'invalid-latin-char' } }
      }

      if (!author_id || !isNumeric(author_id) || +author_id < 0) {
        return { data: { error: 'invalid-author' } }
      }

      if (!page || +page < 1) {
        return { data: { error: 'invalid-page-number' } }
      }

      // const limit and offset for pagination with page number, default limit is 20
      const limit = +req.query.limit || 20
      const offset = (page - 1) * limit || 0

      const root = await fastify.pg.query(
        'SELECT id FROM acikkuran_roots WHERE latin = $1',
        [latin]
      )
      const root_id = root?.rows?.[0]?.id || null
      if (!root_id) {
        return { data: { error: 'invalid-latin-char' } }
      } else {
        const getCount = await fastify.pg.query(
          'SELECT COUNT(*) AS result_count FROM acikkuran_rootverses WHERE root_id = $1;',
          [root_id]
        )

        const result_count = getCount?.rows?.[0]?.result_count || 0

        const lastResponse = await fastify.pg.query(
          'SELECT rv.id as rootverse_id, rv.rootdiff_id, rv.sort_number, rv.surah_id, rv.verse_number, rv.arabic as rootverse_arabic, rv.transcription, rv.turkish, rv.detail_1 as prop_1, rv.detail_2 as prop_2, rv.detail_3 as prop_3, rv.detail_4 as prop_4, rv.detail_5 as prop_5, rv.detail_6 as prop_6, rv.detail_7 as prop_7, rv.detail_8 as prop_8, ' +
            'r.id, r.arabic as root_arabic, r.latin, ' +
            'a.id as author_id, a.name as author_name, a.description as author_description, a.language as author_language, a.url as author_url, ' +
            's.id as surah_id, s.name_original, s.name, s.name_en, s.slug, s.verse_count, s.page_number, s.audio, s.duration, s.audio_en, s.duration_en, ' +
            'v.id as verse_id, v.page as verse_page, v.verse_number as verse_number, v.verse as verse, v.verse_simplified, v.verse_without_vowel, v.transcription as verse_transcription, v.transcription_en as verse_transcription_en, v.juz_number as verse_juz_number, ' +
            'at.id as translation_id, at.text as translation_text, ' +
            "jsonb_build_object('id', at.id, 'author', jsonb_build_object('id', a.id, 'name', a.name, 'description', a.description, 'language', a.language),'text', at.text, 'footnotes', CASE WHEN COUNT(f.id) > 0 THEN jsonb_agg(jsonb_build_object('id', f.id,'number', f.number,'text', f.text)) ELSE 'null'::jsonb END) AS translation " +
            'FROM acikkuran_rootverses rv ' +
            'LEFT JOIN acikkuran_surahs s ON s.id = rv.surah_id ' +
            'LEFT JOIN acikkuran_roots r ON r.id = rv.root_id ' +
            'LEFT JOIN acikkuran_verses v ON v.surah_id = rv.surah_id AND v.verse_number = rv.verse_number ' +
            'LEFT JOIN acikkuran_translations at ON at.verse_id = v.id AND at.author_id = $4 ' +
            'LEFT JOIN acikkuran_authors a ON a.id = at.author_id ' +
            'LEFT JOIN acikkuran_footnotes f ON f.verse_id = v.id AND f.author_id = $4 ' +
            'WHERE rv.root_id = $1 GROUP BY s.id, v.id, at.id, a.id, rv.id, r.id ORDER BY rv.verse_id ASC, rv.sort_number ASC OFFSET $3 LIMIT $2;',
          [root_id, limit, offset, author_id]
        )

        if (lastResponse.rows.length > 0) {
          if (lastResponse.rows?.[0]?.translation_id == null) {
            return { data: { error: 'invalid-author' } }
          }

          const data = lastResponse?.rows?.map((item) => {
            return {
              id: item.rootverse_id,
              rootdiff_id: item.rootdiff_id,
              root: {
                id: item.id,
                latin: item.latin,
                arabic: item.root_arabic,
              },
              surah: {
                id: item.surah_id,
                name: item.name,
                name_en: item.name_en,
                slug: item.slug,
                verse_count: item.verse_count,
                page_number: item.page_number,
                name_original: item.name_original,
                audio: {
                  mp3: `https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/${item.audio}.mp3`,
                  duration: item.duration,
                  mp3_en: `https://archive.org/download/QURANITE-COM/${item.audio_en}.mp3`,
                  duration_en: item.duration_en,
                },
              },
              verse: {
                id: item.verse_id,
                page: item.verse_page,
                surah_id: item.surah_id,
                verse_number: item.verse_number,
                verse: item.verse,
                verse_simplified: item.verse_simplified,
                transcription: item.verse_transcription,
                transcription_en: item.verse_transcription_en,
                juz_number: item.verse_juz_number,
                translation: {
                  id: item.translation_id,
                  author: {
                    id: item.author_id,
                    name: item.author_name,
                    description: item.author_description,
                    language: item.author_language,
                    url: item.author_url,
                  },
                  text: item.translation_text,
                  footnotes: item.translation.footnotes,
                },
              },
              sort_number: item.sort_number,
              arabic: item.rootverse_arabic,
              transcription: item.transcription,
              turkish: item.turkish,
              prop_1: item.prop_1,
              prop_2: item.prop_2,
              prop_3: item.prop_3,
              prop_4: item.prop_4,
              prop_5: item.prop_5,
              prop_6: item.prop_6,
              prop_7: item.prop_7,
              prop_8: item.prop_8,
            }
          })
          const meta_info = {
            links: {
              first: `/root/latin/${latin}/verses?author=${author_id}&page=1`,
              prev:
                page > 1
                  ? `/root/latin/${latin}/verses?author=${author_id}&page=${
                      page - 1
                    }`
                  : null,
              next:
                offset + limit < result_count
                  ? `/root/latin/${latin}/verses?author=${author_id}&page=${
                      page + 1
                    }`
                  : null,
              last: `/root/latin/${latin}/verses?author=${author_id}&page=${Math.ceil(
                result_count / limit
              )}`,
            },
            meta: {
              current_page: +page,
              from: offset,
              last_page: Math.ceil(result_count / limit),
              path: `/root/latin/${latin}/verses?page=${page}&author=${author_id}`,
              per_page: limit,
              to: offset + limit,
              total: +result_count,
            },
          }

          return { ...meta_info, data }
        } else {
          return { data: [] }
        }
      }
    }

    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })

  // ----------------------------
  // GET /root/:root_id
  // ----------------------------

  fastify.get('/root/:root_id', async (req, reply) => {
    const root_id = req.params.root_id
    const cacheKey = `r-${root_id}`

    const fetchAndReply = async () => {
      if (!root_id || !isNumeric(+root_id)) {
        return { data: { error: 'invalid-root-id' } }
      }

      const rootResult = await fastify.pg.query(
        'SELECT r.id, r.latin, r.arabic, r.transcription, r.transcription_en, r.mean, r.mean_en, r.rootchar_id, ' +
          "(CASE WHEN COUNT(rd.id) > 0 THEN jsonb_agg(jsonb_build_object('id', rd.id, 'diff', rd.diff, 'count', rd.count)) ELSE '[]'::jsonb END) as rootdiffs " +
          'FROM acikkuran_roots r ' +
          'LEFT JOIN acikkuran_rootdiffs rd ON rd.root_id = r.id ' +
          'WHERE r.id = $1 GROUP by r.id',
        [root_id]
      )

      if (rootResult?.rows?.length) {
        const results = rootResult.rows.map((item) => {
          return {
            id: item.id,
            latin: item.latin,
            arabic: item.arabic,
            transcription: item.transcription,
            transcription_en: item.transcription_en || item.transcription,
            mean: item.mean,
            mean_en: item.mean_en || item.mean,
            diffs: item.rootdiffs,
            rootchar_id: item.rootchar_id,
          }
        })
        return { data: results }
      } else {
        return { data: { error: 'invalid-root-id' } }
      }
    }

    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })

  // ----------------------------
  // GET /rootchars
  // ----------------------------

  fastify.get('/rootchars', async (_, reply) => {
    const cacheKey = `rcs`

    const fetchAndReply = async () => {
      const rootcharsResult = await fastify.pg.query(
        'SELECT rc.id, rc.arabic, rc.latin FROM acikkuran_rootchars rc ORDER by rc.id ASC'
      )
      let results = []
      if (rootcharsResult?.rows?.length) {
        results = rootcharsResult.rows.map((item) => {
          return {
            id: item.id,
            latin: item.latin,
            arabic: item.arabic,
          }
        })
        return { data: results }
      } else {
        return { data: { error: 'no-rootchars' } }
      }
    }

    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })

  // ----------------------------
  // GET /rootchar/:rootchar_id
  // ----------------------------

  fastify.get('/rootchar/:id', async (req, reply) => {
    const rootchar_id = req.params.id

    const cacheKey = `rc-${rootchar_id}`

    const fetchAndReply = async () => {
      if (!rootchar_id || !isNumeric(+rootchar_id)) {
        return { data: { error: 'invalid-rootchar-id' } }
      }

      const rootcharResult = await fastify.pg.query(
        'SELECT r.id, r.arabic, r.latin FROM acikkuran_roots r WHERE rootchar_id = $1 ORDER by r.id ASC',
        [rootchar_id]
      )
      if (rootcharResult?.rows?.length) {
        const results = rootcharResult.rows.map((item) => {
          return {
            id: item.id,
            latin: item.latin,
            arabic: item.arabic,
          }
        })
        return { data: results }
      } else {
        return { data: { error: 'invalid-rootchar-id' } }
      }
    }

    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })

  // ----------------------------
  // GET /root/latin/:latin/verseparts
  // ----------------------------

  fastify.get('/root/latin/:latin/verseparts', async (req, reply) => {
    const latin = req.params.latin
    const author_id = req.query.author || defaultAuthors['tr']
    const page = +req.query.page || 1
    const limit = +req.query.limit || 20

    let cacheKey = `rlvp-${latin}-a${author_id}-p${page}`
    if(limit !== 20) {
      cacheKey = `${cacheKey}-l${limit}`
    }

    const fetchAndReply = async () => {
      if (!latin || isNumeric(latin)) {
        return { data: { error: 'invalid-latin-char' } }
      }

      if (!author_id || !isNumeric(author_id) || +author_id < 0) {
        return { data: { error: 'invalid-author' } }
      }

      if (!page || +page < 1) {
        return { data: { error: 'invalid-page-number' } }
      }

      // const limit and offset for pagination with page number, default limit is 20
     
      const offset = (page - 1) * limit || 0

      function mergeObjects(obj1, obj2) {
        const result = []

        for (const key in obj1) {
          if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
            const a = obj1[key].map((number) => {
              const matchingDetail = obj2[key].find(
                (detail) => detail.id === number
              )
              return matchingDetail
                ? { tr: matchingDetail.tr, en: matchingDetail.en }
                : null
            })
            result.push(a)
          }
        }

        return result
      }

      const root = await fastify.pg.query(
        'SELECT id FROM acikkuran_roots WHERE latin = $1',
        [latin]
      )

      const root_id = root?.rows?.[0]?.id || null
      if (!root_id) {
        return { data: { error: 'invalid-latin-char' } }
      } else {
        const getCount = await fastify.pg.query(
          'SELECT COUNT(*) AS result_count FROM acikkuran_verseparts WHERE root_id = $1;',
          [root_id]
        )

        const result_count = getCount?.rows?.[0]?.result_count || 0

        const lastResponse = await fastify.pg.query(
          'SELECT vp.id as versepart_id, vp.rootdiff_id, vp.sort_number, vp.surah_id, vp.verse_number, vp.arabic as versepart_arabic, vp.transcription_tr as versepart_transcription_tr, vp.transcription_en as versepart_transcription_en, vp.translation_tr as versepart_translation_tr, vp.translation_en as versepart_translation_en, vp.details as versepart_details, ' +
            'r.id, r.arabic as root_arabic, r.latin, ' +
            'a.id as author_id, a.name as author_name, a.description as author_description, a.language as author_language, a.url as author_url, ' +
            's.id as surah_id, s.name_original, s.name, s.name_en, s.slug, s.verse_count, s.page_number, s.audio, s.duration, s.audio_en, s.duration_en, ' +
            'v.id as verse_id, v.page as verse_page, v.verse_number as verse_number, v.verse as verse, v.verse_simplified, v.verse_without_vowel, v.transcription as verse_transcription_tr, v.transcription_en as verse_transcription_en, v.juz_number as verse_juz_number, ' +
            'at.id as translation_id, at.text as translation_text, ' +
            "jsonb_build_object('id', at.id, 'author', jsonb_build_object('id', a.id, 'name', a.name, 'description', a.description, 'language', a.language),'text', at.text, 'footnotes', CASE WHEN COUNT(f.id) > 0 THEN jsonb_agg(jsonb_build_object('id', f.id,'number', f.number,'text', f.text)) ELSE 'null'::jsonb END) AS translation " +
            'FROM acikkuran_verseparts vp ' +
            'LEFT JOIN acikkuran_surahs s ON s.id = vp.surah_id ' +
            'LEFT JOIN acikkuran_roots r ON r.id = vp.root_id ' +
            'LEFT JOIN acikkuran_verses v ON v.surah_id = vp.surah_id AND v.verse_number = vp.verse_number ' +
            'LEFT JOIN acikkuran_translations at ON at.verse_id = v.id AND at.author_id = $4 ' +
            'LEFT JOIN acikkuran_authors a ON a.id = at.author_id ' +
            'LEFT JOIN acikkuran_footnotes f ON f.verse_id = v.id AND f.author_id = $4 ' +
            'WHERE vp.root_id = $1 GROUP BY s.id, v.id, at.id, a.id, vp.id, r.id ORDER BY vp.verse_id ASC, vp.sort_number ASC OFFSET $3 LIMIT $2;',
          [root_id, limit, offset, author_id]
        )

        if (lastResponse.rows.length > 0) {
          const data = lastResponse?.rows?.map((item) => {
            const mergedDetails = mergeObjects(
              item.versepart_details,
              wordDetails
            )

            if (!item.translation_id) {
              return { data: { error: 'invalid-author' } }
            }
            return {
              id: item.versepart_id,
              rootdiff_id: item.rootdiff_id,
              root: {
                id: item.id,
                latin: item.latin,
                arabic: item.root_arabic,
              },
              surah: {
                id: item.surah_id,
                name: item.name,
                name_en: item.name_en,
                slug: item.slug,
                verse_count: item.verse_count,
                page_number: item.page_number,
                name_original: item.name_original,
                audio: {
                  mp3: `https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/${item.audio}.mp3`,
                  duration: item.duration,
                  mp3_en: `https://archive.org/download/QURANITE-COM/${item.audio_en}.mp3`,
                  duration_en: item.duration_en,
                },
              },
              verse: {
                id: item.verse_id,
                page: item.verse_page,
                surah_id: item.surah_id,
                verse_number: item.verse_number,
                verse: item.verse,
                verse_simplified: item.verse_simplified,
                transcription_tr: item.verse_transcription_tr,
                transcription_en: item.verse_transcription_en,
                juz_number: item.verse_juz_number,
                translation: {
                  id: item.translation_id,
                  author: {
                    id: item.author_id,
                    name: item.author_name,
                    description: item.author_description,
                    language: item.author_language,
                    url: item.author_url,
                  },
                  text: item.translation_text,
                  footnotes: item.translation.footnotes,
                },
              },
              sort_number: item.sort_number,
              arabic: item.versepart_arabic,
              transcription_en: item.versepart_transcription_en,
              transcription_tr: item.versepart_transcription_tr,
              translation_tr: item.versepart_translation_tr,
              translation_en: item.versepart_translation_en,
              details: mergedDetails,
            }
          })
          const meta_info = {
            links: {
              first: `/root/latin/${latin}/verseparts?author=${author_id}&page=1`,
              prev:
                page > 1
                  ? `/root/latin/${latin}/verseparts?author=${author_id}&page=${
                      page - 1
                    }`
                  : null,
              next:
                offset + limit < result_count
                  ? `/root/latin/${latin}/verseparts?author=${author_id}&page=${
                      page + 1
                    }`
                  : null,
              last: `/root/latin/${latin}/verseparts?author=${author_id}&page=${Math.ceil(
                result_count / limit
              )}`,
            },
            meta: {
              current_page: +page,
              from: offset,
              last_page: Math.ceil(result_count / limit),
              path: `/root/latin/${latin}/verseparts?page=${page}&author=${author_id}`,
              per_page: limit,
              to: offset + limit,
              total: +result_count,
            },
          }

          return { ...meta_info, data }
        } else {
          return { data: [] }
        }
      }
    }

    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })
}

module.exports = routes
