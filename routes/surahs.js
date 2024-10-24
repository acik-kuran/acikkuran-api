const cacheOrFetch = require('../utils/cacheOrFetch')
const defaultAuthors = require('../data/defaultAuthors')
const { isNumeric } = require('../utils/funcs')

async function routes(fastify) {
  // ------------------------------
  // GET /surahs
  // ------------------------------

  fastify.get('/surahs', async (_req, reply) => {
    const cacheKey = `s`

    const fetchAndReply = async () => {
      const surahsResult = await fastify.pg.query(
        'SELECT id, name, slug, verse_count, page_number, name_original, name_en, audio, audio_en, duration, duration_en FROM acikkuran_surahs ORDER by id asc'
      )

      if (surahsResult?.rows?.length > 0) {
        const results = surahsResult.rows.map((surah) => {
          return {
            id: surah.id,
            name: surah.name,
            name_en: surah.name_en,
            slug: surah.slug,
            verse_count: surah.verse_count,
            page_number: surah.page_number,
            name_original: surah.name_original,
            audio: {
              mp3: `https://audio.acikkuran.com/tr/${surah.audio}.mp3`,
              duration: surah.duration,
              mp3_en: `https://audio.acikkuran.com/en/${surah.audio_en}.mp3`,
              duration_en: surah.duration_en,
            },
          }
        })
        return { data: results }
      } else {
        return { data: { error: 'no-surahs' } }
      }
    }

    // Proceed with cache operations otherwise
    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })

  // ------------------------------
  // GET /surah/[surah_id]?author=[author_id]
  // ------------------------------

  fastify.get('/surah/:id', async (req, reply) => {
    const surah_id = req.params.id
    const author_id = req.query.author || defaultAuthors['tr']

    const cacheKey = `s${surah_id}-${author_id}`

    const fetchAndReply = async () => {
      if (
        !surah_id ||
        +surah_id > 114 ||
        !isNumeric(+surah_id) ||
        +surah_id < 1
      ) {
        return { data: { error: 'invalid-surah-id' } }
      }

      if (!author_id || !isNumeric(+author_id) || +author_id < 0) {
        return { data: { error: 'invalid-author' } }
      }

      let zero = null

      // 1 and 9 are special cases
      // 1 and 9 have no verse zero
      if (surah_id !== '1' && surah_id !== '9') {
        const resultZero = await fastify.pg.query(
          'SELECT v.surah_id, v.id as verse_id, v.verse_number, v.juz_number, v.verse, v.verse_simplified, v.page, v.transcription, v.transcription_en, at.id as translation_id, at.verse_id, at.author_id, at.text ' +
            'FROM acikkuran_verses v ' +
            'LEFT JOIN acikkuran_translations at ON v.id = at.verse_id AND at.author_id = $1 WHERE v.id = 1',
          [author_id]
        )
        zero = resultZero.rows[0]
      }

      const resultSurah = await fastify.pg.query(
        'SELECT a.id as author_id, a.name as author_name, a.description as author_description, a.language as author_language, a.url as author_url, ' +
          's.id as surah_id, s.name, s.name_en, s.name_original, s.name_translation_tr, s.name_translation_en, s.slug, s.verse_count, s.page_number, s.audio, s.duration, s.audio_en, s.duration_en, ' +
          'v.id as verse_id, v.page as verse_page, v.verse_number as verse_number, v.verse as verse, v.verse_simplified, v.transcription as verse_transcription, v.transcription_en as verse_transcription_en, v.juz_number as verse_juz_number,' +
          'at.id as translation_id, at.text as translation_text, ' +
          "jsonb_build_object('id', at.id, 'author', jsonb_build_object('id', a.id, 'name', a.name, 'description', a.description, 'language', a.language),'text', at.text, 'footnotes', CASE WHEN COUNT(f.id) > 0 THEN jsonb_agg(jsonb_build_object('id', f.id,'number', f.number,'text', f.text)) ELSE 'null'::jsonb END) AS translation " +
          'FROM acikkuran_surahs s ' +
          'LEFT JOIN acikkuran_verses v ON s.id = v.surah_id ' +
          'LEFT JOIN acikkuran_translations at ON v.id = at.verse_id AND at.author_id = $1 ' +
          'LEFT JOIN acikkuran_authors a ON at.author_id = a.id ' +
          'LEFT JOIN acikkuran_footnotes f ON v.id = f.verse_id AND f.author_id = $1 ' +
          'WHERE s.id = $2 ' +
          'GROUP BY s.id, v.id, at.id, a.id ORDER BY v.verse_number',
        [author_id, surah_id]
      )

      const response = resultSurah.rows[0]

      if (!response.surah_id) {
        return { data: { error: 'invalid-surah-id' } }
      }

      if (!resultSurah.rows[0].translation.id) {
        return { data: { error: 'invalid-author' } }
      }

      const verses = resultSurah.rows.map((verse) => {
        return {
          id: verse.verse_id,
          surah_id: verse.surah_id,
          verse_number: verse.verse_number,
          verse: verse.verse,
          verse_simplified: verse.verse_simplified,
          page: verse.verse_page,
          juz_number: verse.verse_juz_number,
          transcription: verse.verse_transcription,
          transcription_en: verse.verse_transcription_en,
          translation: verse.translation,
        }
      })

      const result = {
        id: response.surah_id,
        name: response.name,
        name_en: response.name_en,
        name_original: response.name_original,
        name_translation_tr: response.name_translation_tr,
        name_translation_en: response.name_translation_en,
        slug: response.slug,
        verse_count: response.verse_count,
        page_number: response.page_number,
        audio: {
          mp3: `https://audio.acikkuran.com/tr/${response.audio}.mp3`,
          duration: response.duration,
          mp3_en: `https://audio.acikkuran.com/en/${response.audio_en}.mp3`,
          duration_en: response.duration_en,
        },
        zero: zero
          ? {
              id: zero.verse_id,
              surah_id: zero.surah_id,
              verse_number: zero.verse_number,
              verse: zero.verse,
              verse_simplified: zero.verse_simplified,
              page: zero.page,
              juz_number: zero.juz_number,
              transcription: zero.transcription,
              transcription_en: zero.transcription_en,
              translation: {
                id: zero.translation_id,
                author: {
                  id: response.author_id,
                  name: response.author_name,
                  description: response.author_description,
                  language: response.author_language,
                  url: response.author_url,
                },
                text: zero.text,
                footnotes: null,
              },
            }
          : null,
        verses: verses,
      }

      return { data: result }
    }

    // Proceed with cache operations otherwise
    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })
}

module.exports = routes
