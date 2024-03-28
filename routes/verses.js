const cacheOrFetch = require('../utils/cacheOrFetch')
const defaultAuthors = require('../data/defaultAuthors')
const { isNumeric } = require('../utils/funcs')

async function routes(fastify) {
  // ------------------------------
  // GET /surah/:surah_id/verse/:verse_number
  // ------------------------------

  fastify.get('/surah/:surah_id/verse/:verse_number', async (req, reply) => {
    const surah_id = req.params.surah_id
    const verse_number = req.params.verse_number
    const author_id = req.query.author || defaultAuthors['tr']

    const cacheKey = `s${surah_id}v${verse_number}a${author_id}`

    const fetchAndReply = async () => {
      if (
        !surah_id ||
        !isNumeric(+surah_id) ||
        +surah_id < 1 ||
        +surah_id > 114
      ) {
        return { data: { error: 'invalid-surah-id' } }
      }

      if (!verse_number || !isNumeric(+verse_number) || +verse_number < 1) {
        return { data: { error: 'invalid-verse-number' } }
      }

      if (!author_id || !isNumeric(+author_id) || +author_id < 0) {
        return { data: { error: 'invalid-author' } }
      }

      const verseResult = await fastify.pg.query(
        'SELECT a.id as author_id, a.name as author_name, a.description as author_description, a.language as author_language, a.url as author_url, ' +
          's.id as surah_id, s.name_original, s.name, s.name_en, s.slug, s.verse_count, s.page_number, s.audio, s.duration, s.audio_en, s.duration_en, ' +
          'v.id as verse_id, v.page as verse_page, v.verse_number as verse_number, v.verse as verse, v.verse_simplified, v.verse_without_vowel, v.transcription as verse_transcription, v.transcription_en as verse_transcription_en, v.juz_number as verse_juz_number,' +
          'at.id as translation_id, at.text as translation_text, ' +
          "jsonb_build_object('id', at.id, 'author', jsonb_build_object('id', a.id, 'name', a.name, 'description', a.description, 'language', a.language),'text', at.text, 'footnotes', CASE WHEN COUNT(f.id) > 0 THEN jsonb_agg(jsonb_build_object('id', f.id,'number', f.number,'text', f.text)) ELSE 'null'::jsonb END) AS translation " +
          'FROM acikkuran_surahs s ' +
          'LEFT JOIN acikkuran_verses v ON s.id = v.surah_id AND v.verse_number = $3 ' +
          'LEFT JOIN acikkuran_translations at ON v.id = at.verse_id AND at.author_id = $1 ' +
          'LEFT JOIN acikkuran_authors a ON at.author_id = a.id ' +
          'LEFT JOIN acikkuran_footnotes f ON v.id = f.verse_id AND f.author_id = $1 ' +
          'WHERE s.id = $2 ' +
          'GROUP BY s.id, v.id, at.id, a.id ORDER BY v.verse_number',
        [author_id, surah_id, verse_number]
      )

      const response = verseResult?.rows?.[0]
      if (!response.surah_id) {
        return { data: { error: 'invalid-surah-id' } }
      }
      if (!response.verse_id) {
        return { data: { error: 'invalid-verse-number' } }
      }
      if (!response.translation_id) {
        return { data: { error: 'invalid-author' } }
      }
      return {
        data: {
          id: response.verse_id,
          surah: {
            id: response.surah_id,
            name: response.name,
            name_en: response.name_en,
            slug: response.slug,
            verse_count: response.verse_count,
            page_number: response.page_number,
            name_original: response.name_original,
            audio: {
              mp3: `https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/${response.audio}.mp3`,
              duration: response.duration,
              mp3_en: `https://archive.org/download/QURANITE-COM/${response.audio_en}.mp3`,
              duration_en: response.duration_en,
            },
          },
          verse_number: response.verse_number,
          verse: response.verse,
          verse_simplified: response.verse_simplified,
          page: response.verse_page,
          juz_number: response.verse_juz_number,
          verse_without_vowel: response.verse_without_vowel,
          transcription: response.verse_transcription,
          transcription_en: response.verse_transcription_en,
          translation: {
            id: response.translation_id,
            author: {
              id: response.author_id,
              name: response.author_name,
              description: response.author_description,
              language: response.author_language,
              url: response.author_url,
            },
            text: response.translation_text,
            footnotes: response.translation.footnotes,
          },
        },
      }
    }

    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })

  // ------------------------------
  // GET /surah/:surah_id/verse/:verse_number/translations
  // ------------------------------

  fastify.get(
    '/surah/:surah_id/verse/:verse_number/translations',
    async (req, reply) => {
      const surah_id = req.params.surah_id
      const verse_number = req.params.verse_number

      const cacheKey = `s${surah_id}v${verse_number}t`

      const fetchAndReply = async () => {
        if (
          !surah_id ||
          !isNumeric(+surah_id) ||
          +surah_id < 1 ||
          +surah_id > 114
        ) {
          return { data: { error: 'invalid-surah-id' } }
        }

        if (!verse_number || !isNumeric(+verse_number) || +verse_number < 1) {
          return { data: { error: 'invalid-verse-number' } }
        }

        const verseTranslationsResult = await fastify.pg.query(
          'SELECT a.id as author_id, a.name as author_name, a.description as author_description, a.language as author_language, ' +
            't.id as translation_id, t.text as translation_text, ' +
            "jsonb_build_object('id', a.id, 'name', a.name, 'description', a.description, 'language', a.language, 'url', a.url) as author, " +
            "(CASE WHEN COUNT(f.id) > 0 THEN jsonb_agg(jsonb_build_object('id', f.id,'number', f.number,'text', f.text)) ELSE 'null'::jsonb END) as footnotes " +
            'FROM acikkuran_translations t ' +
            'LEFT JOIN acikkuran_authors a ON t.author_id = a.id ' +
            'LEFT JOIN acikkuran_footnotes f ON t.verse_id = f.verse_id AND t.author_id = f.author_id ' +
            'WHERE t.surah_id = $1 AND t.verse_number = $2 ' +
            'GROUP BY t.id, a.id;',
          [surah_id, verse_number]
        )

        const results = verseTranslationsResult.rows.map((translation) => {
          return {
            id: translation.translation_id,
            text: translation.translation_text,
            author: translation.author,
            footnotes: translation.footnotes,
          }
        })
        if (results.length) {
          return { data: results }
        } else {
          return { data: { error: 'invalid-verse-number' } }
        }
      }

      await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
    }
  )

  // ------------------------------
  // GET /surah/:surah_id/verse/:verse_number/words
  // ------------------------------
  // This endpoint is no longer supported due to structural changes.
  // The data may be outdated and will soon be deprecated.
  // Please use the GET /surah/:surah_id/verse/:verse_number/verseparts endpoint instead.
  // ----------------------------

  fastify.get(
    '/surah/:surah_id/verse/:verse_number/words',
    async (req, reply) => {
      const surah_id = req.params.surah_id
      const verse_number = req.params.verse_number

      const cacheKey = `s${surah_id}v${verse_number}w`

      const fetchAndReply = async () => {
        if (
          !surah_id ||
          !isNumeric(+surah_id) ||
          +surah_id < 1 ||
          +surah_id > 114
        ) {
          return { data: { error: 'invalid-surah-id' } }
        }

        if (!verse_number || !isNumeric(+verse_number) || +verse_number < 1) {
          return { data: { error: 'invalid-verse-number' } }
        }

        const verseWordsResult = await fastify.pg.query(
          'SELECT rw.id, rw.sort_number, rw.transcription, rw.arabic, rw.turkish, rw.root_id, r.latin as root_latin, r.arabic as root_arabic ' +
            'FROM acikkuran_rootwords rw ' +
            'LEFT JOIN acikkuran_roots r ON rw.root_id = r.id ' +
            'WHERE rw.surah_id = $1 AND rw.verse_number = $2 ORDER BY rw.sort_number',
          [surah_id, verse_number]
        )
        const results = verseWordsResult?.rows?.map((word) => {
          return {
            id: word.id,
            sort_number: word.sort_number,
            transcription: word.transcription,
            arabic: word.arabic,
            turkish: word.turkish,
            root: word.root_id
              ? {
                  id: word.root_id,
                  latin: word.root_latin,
                  arabic: word.root_arabic,
                }
              : null,
          }
        })
        return results?.length
          ? { data: results }
          : { data: { error: 'invalid-verse-number' } }
      }

      await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
    }
  )

  // ------------------------------
  // GET /surah/:surah_id/verse/:verse_number/verseparts
  // ------------------------------

  fastify.get(
    '/surah/:surah_id/verse/:verse_number/verseparts',
    async (req, reply) => {
      const surah_id = req.params.surah_id
      const verse_number = req.params.verse_number

      const cacheKey = `s${surah_id}v${verse_number}vp`

      const fetchAndReply = async () => {
        if (
          !surah_id ||
          !isNumeric(+surah_id) ||
          +surah_id < 1 ||
          +surah_id > 114
        ) {
          return { data: { error: 'invalid-surah-id' } }
        }

        if (!verse_number || !isNumeric(+verse_number) || +verse_number < 1) {
          return { data: { error: 'invalid-verse-number' } }
        }

        const verseWordsResult = await fastify.pg.query(
          'SELECT rw.id, rw.sort_number, rw.transcription_en, rw.transcription_tr, rw.arabic, rw.translation_tr, rw.translation_en, rw.root_id, r.latin as root_latin, r.arabic as root_arabic ' +
            'FROM acikkuran_verseparts rw ' +
            'LEFT JOIN acikkuran_roots r ON rw.root_id = r.id ' +
            'WHERE rw.surah_id = $1 AND rw.verse_number = $2 ORDER BY rw.sort_number',
          [surah_id, verse_number]
        )
        const results = verseWordsResult?.rows?.map((word) => {
          return {
            id: word.id,
            sort_number: word.sort_number,
            transcription_tr: word.transcription_tr,
            transcription_en: word.transcription_en,
            arabic: word.arabic,
            translation_tr: word.translation_tr,
            translation_en: word.translation_en,
            root: word.root_id
              ? {
                  id: word.root_id,
                  latin: word.root_latin,
                  arabic: word.root_arabic,
                }
              : null,
          }
        })
        return { data: results }
      }

      await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
    }
  )
}

module.exports = routes
