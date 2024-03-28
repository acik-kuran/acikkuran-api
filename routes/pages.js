const cacheOrFetch = require('../utils/cacheOrFetch')
const defaultAuthors = require('../data/defaultAuthors')
const { isNumeric } = require('../utils/funcs')

async function routes(fastify) {
  // ------------------------------
  // GET /page/:page_number
  // ------------------------------

  fastify.get('/page/:page_number', async (req, reply) => {
    const page_number = req.params.page_number || 0
    const author_id = req.query.author || defaultAuthors['tr']

    const cacheKey = `pg${page_number}-a${author_id}`

    const fetchAndReply = async () => {
      // validate page number
      if (+page_number > 604 || !isNumeric(+page_number) || +page_number < 0) {
        return { data: { error: 'invalid-page-number' } }
      }

      // validate author id
      if (!author_id || !isNumeric(+author_id) || +author_id < 0) {
        return { data: { error: 'invalid-author' } }
      }

      let page_ids =
        page_number % 2 === 0
          ? [+page_number - 1, +page_number]
          : [+page_number, +page_number + 1]

      // fetch the first verse
      let zero = null
      const resultZero = await fastify.pg.query(
        'SELECT v.surah_id, v.id as verse_id, v.verse_number, v.juz_number, v.verse, v.verse_simplified, v.page, v.transcription, v.transcription_en, at.id as translation_id, at.verse_id, at.author_id, at.text ' +
          'FROM acikkuran_verses v ' +
          'LEFT JOIN acikkuran_translations at ON v.id = at.verse_id AND at.author_id = $1 WHERE v.id = 1',
        [author_id]
      )
      zero = resultZero.rows.length > 0 ? resultZero.rows[0] : null

      // main query to fetch page data
      const mainResult = await fastify.pg.query(
        'SELECT a.id as author_id, a.name as author_name, a.description as author_description, a.language as author_language, a.url as author_url, ' +
          's.id as surah_id, s.name_original,  s.name, s.name_en, s.slug, s.verse_count, s.page_number, s.audio, s.duration, s.audio_en, s.duration_en, ' +
          'v.id as verse_id, v.page as verse_page, v.verse_number as verse_number, v.verse as verse, v.verse_simplified, v.verse_without_vowel, v.transcription as verse_transcription, v.transcription_en as verse_transcription_en, v.juz_number as verse_juz_number, ' +
          'at.id as translation_id, at.text as translation_text, ' +
          "jsonb_build_object('id', at.id, 'author', jsonb_build_object('id', a.id, 'name', a.name, 'description', a.description, 'language', a.language),'text', at.text, 'footnotes', CASE WHEN COUNT(f.id) > 0 THEN jsonb_agg(jsonb_build_object('id', f.id,'number', f.number,'text', f.text)) ELSE 'null'::jsonb END) AS translation " +
          'FROM acikkuran_verses v ' +
          'LEFT JOIN acikkuran_surahs s ON s.id = v.surah_id ' +
          'LEFT JOIN acikkuran_translations at ON at.verse_id = v.id AND at.author_id = $1 ' +
          'LEFT JOIN acikkuran_authors a ON a.id = at.author_id ' +
          'LEFT JOIN acikkuran_footnotes f ON f.verse_id = v.id AND f.author_id = $1 ' +
          'WHERE v.page = ANY($2) ' +
          'GROUP BY a.id, s.id, v.id, at.id ' +
          'ORDER BY v.surah_id ASC, v.verse_number ASC',
        [author_id, page_ids]
      )

      if (mainResult.rows?.[0].translation_id === null) {
        return { data: { error: 'invalid-author' } }
      }

      if (mainResult.rows.length === 0) {
        return { data: { error: 'no-data-found' } }
      } else {
        const finalResult = await mainResult.rows.map((row) => {
          // Belirtilen yapıya uygun olarak sonuçları dönüştür
          let isZeroVisible = false
          if (
            row.verse_number === 1 &&
            row.surah_id != 1 &&
            row.surah_id != 9
          ) {
            isZeroVisible = true
          }

          return {
            id: row.verse_id,
            surah: {
              id: row.surah_id,
              name: row.name,
              name_en: row.name_en,
              slug: row.slug,
              verse_count: row.verse_count,
              page_number: row.page_number,
              name_original: row.name_original,
              audio: {
                mp3: `https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/${row.audio}.mp3`,
                duration: row.duration,
                mp3_en: `https://archive.org/download/QURANITE-COM/${row.audio_en}.mp3`,
                duration_en: row.duration_en,
              },
            },
            verse_number: row.verse_number,
            verse: row.verse,
            verse_simplified: row.verse_simplified,
            zero: isZeroVisible
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
                      id: row.author_id,
                      name: row.author_name,
                      description: row.author_description,
                      language: row.author_language,
                      url: row.author_url,
                    },
                    text: zero.text,
                    footnotes: null,
                  },
                }
              : null,
            page: row.verse_page,
            juz_number: row.verse_juz_number,
            verse_without_vowel: row.verse_without_vowel,
            transcription: row.verse_transcription,
            transcription_en: row.verse_transcription_en,
            translation: {
              id: row.translation_id,
              author: {
                id: row.author_id,
                name: row.author_name,
                description: row.author_description,
                language: row.author_language,
                url: row.author_url,
              },
              text: row.translation_text,
              footnotes: row.translation.footnotes,
            },
          }
        })

        return { data: finalResult }
      }
    }

    await cacheOrFetch({ fastify, cacheKey, fetchAndReply, reply })
  })
}

module.exports = routes
