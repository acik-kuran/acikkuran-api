const quranInfo = require('../data/quranInfo.json')
const { clearDelimiters, isNumeric } = require('../utils/funcs')
const defaultAuthors = require('../data/defaultAuthors.json')
require('dotenv').config()

async function routes(fastify) {
  // ------------------------------
  // GET /random-search
  // ------------------------------

  fastify.get('/random-search', (req, reply) => {
    let lang = req.query.lang || 'tr'

    if (lang !== 'tr' && lang !== 'en') {
      reply.code(404).send({ data: { error: 'invalid-language' } })
      return
    }

    let randomFilters = []

    function getRandomVerse(surahId) {
      const surah = quranInfo.find((s) => s.id === surahId)
      if (surah) {
        const verseNumber = Math.floor(Math.random() * surah.verse_count) + 1
        randomFilters.push(
          `surah.id = ${surahId} AND verse.verse_number = ${verseNumber}`
        )
      }
    }

    // generate 10 random verses
    for (let i = 0; i < 10; i++) {
      const randomSurahId = Math.floor(Math.random() * quranInfo.length) + 1
      getRandomVerse(randomSurahId)
    }

    const { MeiliSearch } = require('meilisearch')
    const client = new MeiliSearch({
      host: process.env.MEILI_HOST,
      apiKey: process.env.MEILI_API_KEY,
    })

    client
      .index('translations')
      .search('', {
        filter: [`author.id = ${defaultAuthors[lang]}`, [...randomFilters]],
        limit: 10,
      })
      .then((res) => {
        reply.send({ data: res })
      })
  })

  // ------------------------------
  // GET /search
  // ------------------------------

  fastify.get('/search', (req, reply) => {
    let q = req.query.q?.trim() || ''
    const page = req.query.page || 1
    let lang = req.query.lang || 'tr'
    let type = req.query.type || 'search'

    if (type !== 'quick' && type !== 'search') {
      type = 'search'
    }

    if (lang !== 'tr' && lang !== 'en') {
      reply.code(404).send({ data: { error: 'invalid-language' } })
      return
    }

    if (+page < 1) {
      reply.code(404).send({ data: { error: 'invalid-page-number' } })
      return
    }

    q = q.replace('.', ' ')

    if (q == '' || q == '{q}') {
      q = '30:30'
    }

    let verses = []
    let surahs = []
    surahs = Object.values(quranInfo).filter((surah) =>
      surah.names.some((name) => name.toLowerCase().includes(q.toLowerCase()))
    )

    // If there is a delimiter in the query, it splits it into pieces and sends it to the relevant place
    const regex = /(\d|\S)(:|\/| |-|,)(\d)/

    if (regex.test(q)) {
      const array = q.split(/[-:|\/ ,]/)
      const firstArr = array[0].trim()
      const secondArr = array[1].trim()

      // if the first element is a number and the second element is a number
      // and the first element is between 1 and 114, then it is related to the surah.
      if (isNumeric(firstArr) && isNumeric(secondArr)) {
        const surah =
          typeof +firstArr === 'number' &&
          firstArr >= 1 &&
          firstArr <= 114 &&
          firstArr
        if (surah) {
          const verse =
            +secondArr <= quranInfo.find((i) => surah == i.id)?.verse_count &&
            +secondArr
          if (verse) {
            type === 'quick' &&
              verses.push({
                surah_id: quranInfo.find((i) => surah == i.id).id,
                surah_name: quranInfo.find((i) => surah == i.id).names[0],
                verse_number: verse,
              })
            if (type === 'search') {
              reply.send({
                data: {
                  route: `/[surah_id]/[verse_number]`,
                  redirect: `/${surah}/${verse}`,
                  error: null,
                },
              })
              return
            }
          } else {
            type === 'quick' &&
              surahs.push(quranInfo.filter((i) => surah == i.id))
            if (type === 'search') {
              reply.send({
                data: {
                  route: `/[surah_id]`,
                  redirect: `/${surah}`,
                  error: null,
                },
              })
              return
            }
          }
        } else {
          if (type === 'search') {
            reply.send({
              data: { route: null, redirect: null, error: 'surah-not-found' },
            })
            return
          }
        }
      }

      // if the first element is a string and the second element is a number
      // and the second element is between 1 and 286, then it is related to the surah/verse.
      if (
        !isNumeric(firstArr) &&
        isNumeric(secondArr) &&
        secondArr > 0 &&
        secondArr <= 286
      ) {
        const surah =
          Object.values(quranInfo).find((surah) =>
            surah.names.some(
              (name) => name.toLowerCase() === firstArr.toLowerCase()
            )
          )?.id || null
        if (surah) {
          // if the verse number in the second element is greater than the verseCount of the surah,
          // only the surah comes.
          if (secondArr > quranInfo.find((i) => surah == i.id)?.verse_count) {
            type === 'quick' && surahs.push(surah)
            if (type === 'search') {
              reply.send({
                data: {
                  route: `/[surah_id]`,
                  redirect: `/${surah}`,
                  error: null,
                },
              })
              return
            }
          } else {
            const verse = +secondArr
            if (verse) {
              type === 'quick' &&
                verses.push({
                  surah_id: quranInfo.find((i) => surah == i.id).id,
                  surah_name: quranInfo.find((i) => surah == i.id).names[0],
                  verse_number: verse,
                })
              if (type === 'search') {
                reply.send({
                  data: {
                    route: `/[surah_id]/[verse_number]`,
                    redirect: `/${surah}/${verse}`,
                    error: null,
                  },
                })
                return
              }
            }
          }
        }
      }
    }

    if (
      (typeof +q === 'number' && q > 0 && q <= 114) ||
      /\d(:|\/| |-|,)$/.test(q)
    ) {
      q = clearDelimiters(q)

      type === 'quick' &&
        quranInfo.filter((i) => q == i.id).map((i) => surahs.push(i))
      if (type === 'search') {
        reply.send({
          data: { route: '/[surah_id]', redirect: `/${q}`, error: null },
        })
        return
      }
    }

    if (q.length < 3) {
      if (type === 'search') {
        reply.send({
          data: {
            error: 'min-char',
          },
        })
        return
      }
      reply.send({
        data: {
          route: null,
          surahs,
          verses,
          redirect: null,
        },
      })
      return
    }

    if (verses.length == 0) {
      const { MeiliSearch } = require('meilisearch')
      const client = new MeiliSearch({
        host: process.env.MEILI_HOST,
        apiKey: process.env.MEILI_API_KEY,
      })

      let filterQuery = ''

      if (process.env.EXLUDED_AUTHOR_IDS) {
        const exlcudedAuthors = process.env.EXLUDED_AUTHOR_IDS.split(',')

        exlcudedAuthors.map((id, index) => {
          const prefix = index === 0 ? '' : ' AND '
          filterQuery = `${filterQuery} ${prefix}author.id != ${id}`
        })
      }

      client
        .index('translations')
        .search(q, {
          filter: [filterQuery, `language = ${lang}`],
          sort: ['verse_id:asc', 'author.id:desc'],
          hitsPerPage: type === 'quick' ? 10 : 30,
          page: +page,
          attributesToSearchOn: ['verse.transcription', 'text', 'verse.verse'],
          attributesToHighlight: ['text', 'verse.transcription', 'verse.verse'],
          showRankingScore: true,
        })
        .then((res) => {
          // get only text and verse properties inside _formatted
          const formattedHits = res.hits.map((hit) => ({
            ...hit,
            _formatted: {
              text: hit._formatted.text.trim(),
              verse: {
                verse: hit._formatted.verse.verse.trim(),
                transcription: hit._formatted.verse.transcription.trim(),
              },
            },
          }))

          const modifiedSearchResult = {
            surahs,
            verses,
            ...res,
            hits: formattedHits,
          }

          reply.send({ data: modifiedSearchResult })
        })
    } else {
      reply.send({ data: { surahs, verses, hits: [] } })
    }
  })
}

module.exports = routes
