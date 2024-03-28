# Açık Kuran API

[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

<img src="https://raw.githubusercontent.com/ziegfiroyt/acikkuran-api/main/logo.png" width="100" alt="Apaçık Kur'an'a andolsun!">

[https://acikkuran.com](https://acikkuran.com)

O mankind: there has come to you evidence from your Lord; and We have sent down to you a clear light. — [Qur'an 4:174](https://en.acikkuran.com/4/174)

## Contributing Guideline

Soon..

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

## Routes List:

- [GET `/authors`](#get-authors)
- [GET `/surahs`](#get-surahs)
- [GET `/surah/[surah_id]?author=[author_id]`](#get-surah-id)
- [GET `/surah/[surah_id]/verse/[verse_number]?author=[author_id]`](#get-verse)
- [GET `/surah/[surah_id]/verse/[verse_number]/translations`](#get-verse-translations)
- [GET `/surah/[surah_id]/verse/[verse_number]/words`](#get-verse-words)
- [GET `/surah/[surah_id]/verse/[verse_number]/verseparts`](#get-verse-verseparts)
- [GET `/root/latin/[latin_chars]`](#get-root-latin)
- [GET `/root/latin/[latin_char]/verses?page=[page_number]&author=[author_id]`](#get-root-latin-verses)
- [GET `/root/latin/[latin_char]/verseparts?page=[page_number]&author=[author_id]`](#get-root-latin-verseparts)
- [GET `/root/[id]`](#get-root)
- [GET `/rootchars`](#get-rootchars)
- [GET `/rootchar/[id]`](#get-rootchar)
- [GET `/page/[page_number]?author_id=[author_id]`](#get-page)

### <a id="get-authors"></a> GET `/authors`

> Lists all authors.

Example: `https://api.acikkuran.com/authors`

Response body:

```json
{
    "data": [
      {
        "id": 50,
        "name": "Erhan Aktaş",
        "description": "Kerim Kur'an",
        "language": "tr",
        "url": null
      }
      {
        "id": 102,
        "name": "The Monotheist Group",
        "description": "The Quran: A Monotheist Translation",
        "language": "en",
        "url": null
      }
    ]
}
```

### <a id="get-surahs"></a> GET `/surahs`

> Lists all surahs.

Example: `https://api.acikkuran.com/surahs`

Response body:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Fatiha",
      "name_en": "Al-Fatihah",
      "slug": "fatiha",
      "verse_count": 7,
      "page_number": 0,
      "name_original": "سُورَةُ ٱلْفَاتِحَةِ",
      "audio": {
        "mp3": "https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/05-fatiha.mp3",
        "duration": 38,
        "mp3_en": "https://archive.org/download/QURANITE-COM/001.mp3",
        "duration_en": 29
      }
    },
    {
      "id": 2,
      "name": "Bakara",
      "name_en": "Al-Baqarah",
      "slug": "bakara",
      "verse_count": 286,
      "page_number": 1,
      "name_original": "سورة البقرة",
      "audio": {
        "mp3": "https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/87-bakara.mp3",
        "duration": 5982,
        "mp3_en": "https://archive.org/download/QURANITE-COM/002.mp3",
        "duration_en": 5503
      }
    }
  ]
}
```

### <a id="get-surah-id"></a> GET `/surah/[surah_id]?author=[author_id]`

> Gets surah's detail and lists verses of this surah.

Example 1: `https://api.acikkuran.com/surah/6` Default translation

Example 2: `https://api.acikkuran.com/surah/6?author=8` Author can be select with `author` parameter

Response body:

```json
{
  "data": {
    "id": 6,
    "name": "Enam",
    "name_en": "Al-An'am",
    "name_original": "سورة الأنعام",
    "name_translation_tr": "Enam",
    "name_translation_en": "The Cattle",
    "slug": "enam",
    "verse_count": 165,
    "page_number": 127,
    "audio": {
      "mp3": "https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/55-enam.mp3",
      "duration": 2995,
      "mp3_en": "https://archive.org/download/QURANITE-COM/006.mp3",
      "duration_en": 2837
    },
    "zero": {
      "id": 1,
      "surah_id": 1,
      "verse_number": 1,
      "verse": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ",
      "verse_simplified": "بِسْمِ اللّهِ الرَّحْمَنِ الرَّحِيمِ",
      "page": 0,
      "juz_number": 1,
      "transcription": "Bismillahir rahmanir rahim.",
      "transcription_en": "Bismi Allahi arrahmani arraheem",
      "translation": {
        "id": 149675,
        "author": {
          "id": 105,
          "name": "Erhan Aktaş",
          "description": "Kerim Kur'an",
          "language": "tr",
          "url": null
        },
        "text": "Rahmeti Bol ve Kesintisiz Olan Allah'ın Adıyla",
        "footnotes": null
      }
    },
    "verses": [
      {
        "id": 790,
        "surah_id": 6,
        "verse_number": 1,
        "verse": "اَلْحَمْدُ لِلّٰهِ الَّذ۪ي خَلَقَ السَّمٰوَاتِ وَالْاَرْضَ وَجَعَلَ الظُّلُمَاتِ وَالنُّورَۜ  ثُمَّ الَّذ۪ينَ كَفَرُوا بِرَبِّهِمْ يَعْدِلُونَ",
        "verse_simplified": "الْحَمْدُ لِلّهِ الَّذِي خَلَقَ السَّمَاوَاتِ وَالأَرْضَ وَجَعَلَ الظُّلُمَاتِ وَالنُّورَ ثُمَّ الَّذِينَ كَفَرُواْ بِرَبِّهِم يَعْدِلُونَ",
        "page": 127,
        "juz_number": 7,
        "transcription": "Elhamdu lillahillezi halakas semavati vel arda ve cealez zulumati ven nur, summellezine keferu bi rabbihim ya'dilun.",
        "transcription_en": "Alhamdu lillahi allatheekhalaqa assamawati wal-ardawajaAAala aththulumati wannoorathumma allatheena kafaroo birabbihim yaAAdiloon",
        "translation": {
          "id": 150470,
          "text": "Hamd[1],  gökleri ve yeri yaratan,  karanlıkları ve aydınlığı var eden Allah'a özgüdür. Yine de  Kafirler[2] ilahlarını Rabb'leriyle denk tutuyorlar.",
          "author": {
            "id": 105,
            "name": "Erhan Aktaş",
            "language": "tr",
            "description": "Kerim Kur'an"
          },
          "footnotes": [
            {
              "id": 12192,
              "text": "Övgüye ve teşekküre layık yegane varlık. Bir nimetin ve güzelliğin kaynağı ve sahibi olan gücü, övgü ve yüceltme sözleriyle anmaktır. Bu anlamıyla \"hamd\", verilen bir nimetten yararlanma veya yapılan bir yardımla feraha çıkma karşılığı olmaktan çok, o nimeti veren yaratıcının sonsuz güç ve kuvvetine duyulan hayranlık sebebiyle dile getirilen bir övgüdür.",
              "number": 1
            },
            {
              "id": 12193,
              "text": "Kafir: İnançsız, inanmayan, gerçeğin üzerini örten, gerçeği kabul etmeyen, nankör. Allah'ı ve vahyi reddeden. Küfr, İman'ın karşıtıdır.",
              "number": 2
            }
          ]
        }
      }
    ]
  }
}
```

### <a id="get-verse"></a> GET `/surah/[surah_id]/verse/[verse_number]?author=[author_id]`

> Gets verse's detail.

Example 1: `https://api.acikkuran.com/surah/6/verse/1` Default translation

Example 2: `https://api.acikkuran.com/surah/6/verse/1?author=8` Author can be select with `author` parameter

Response body:

```json
{
  "data": {
    "id": 790,
    "surah": {
      "id": 6,
      "name": "Enam",
      "name_en": "Al-An'am",
      "slug": "enam",
      "verse_count": 165,
      "page_number": 127,
      "name_original": "سورة الأنعام",
      "audio": {
        "mp3": "https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/55-enam.mp3",
        "duration": 2995,
        "mp3_en": "https://archive.org/download/QURANITE-COM/006.mp3",
        "duration_en": 2837
      }
    },
    "verse_number": 1,
    "verse": "اَلْحَمْدُ لِلّٰهِ الَّذ۪ي خَلَقَ السَّمٰوَاتِ وَالْاَرْضَ وَجَعَلَ الظُّلُمَاتِ وَالنُّورَۜ  ثُمَّ الَّذ۪ينَ كَفَرُوا بِرَبِّهِمْ يَعْدِلُونَ",
    "verse_simplified": "الْحَمْدُ لِلّهِ الَّذِي خَلَقَ السَّمَاوَاتِ وَالأَرْضَ وَجَعَلَ الظُّلُمَاتِ وَالنُّورَ ثُمَّ الَّذِينَ كَفَرُواْ بِرَبِّهِم يَعْدِلُونَ",
    "page": 127,
    "juz_number": 7,
    "verse_without_vowel": "الحمد لله الذي خلق السماوات والأرض وجعل الظلمات والنور ثم الذين كفروا بربهم يعدلون",
    "transcription": "Elhamdu lillahillezi halakas semavati vel arda ve cealez zulumati ven nur, summellezine keferu bi rabbihim ya'dilun.",
    "transcription_en": "Alhamdu lillahi allatheekhalaqa assamawati wal-ardawajaAAala aththulumati wannoorathumma allatheena kafaroo birabbihim yaAAdiloon",
    "translation": {
      "id": 150470,
      "author": {
        "id": 105,
        "name": "Erhan Aktaş",
        "description": "Kerim Kur'an",
        "language": "tr",
        "url": null
      },
      "text": "Hamd[1],  gökleri ve yeri yaratan,  karanlıkları ve aydınlığı var eden Allah'a özgüdür. Yine de Kafirler[2] ilahlarını Rabb'leriyle denk tutuyorlar.",
      "footnotes": [
        {
          "id": 12192,
          "text": "Övgüye ve teşekküre layık yegane varlık. Bir nimetin ve güzelliğin kaynağı ve sahibi olan gücü, övgü ve yüceltme sözleriyle anmaktır. Bu anlamıyla \"hamd\", verilen bir nimetten yararlanma veya yapılan bir yardımla feraha çıkma karşılığı olmaktan çok, o nimeti veren yaratıcının sonsuz güç ve kuvvetine duyulan hayranlık sebebiyle dile getirilen bir övgüdür.",
          "number": 1
        },
        {
          "id": 12193,
          "text": "Kafir: İnançsız, inanmayan, gerçeğin üzerini örten, gerçeği kabul etmeyen, nankör. Allah'ı ve vahyi reddeden. Küfr, İman'ın karşıtıdır.",
          "number": 2
        }
      ]
    }
    }
  }
}
```

### <a id="get-verse-translations"></a> GET `/surah/[surah_id]/verse/[verse_number]/translations`

> Lists all translations of this verse.

Example: `https://api.acikkuran.com/surah/6/verse/1/translations`

Response body:

```json
{
  "data": [
    {
      "id": 13410,
      "text": "Her türlü övgü, gökleri ve yeri yaratan, karanlıkları ve aydınlığı var eden Allah'a aittir. Bunca delilden sonra hakikati inkar edenler, başka güçleri Rabbleri ile denk tutarlar.",
      "author": {
        "id": 8,
        "url": null,
        "name": "Bayraktar Bayraklı",
        "language": "tr",
        "description": "Yeni Bir Anlayışın Işığında Kur'an Meali"
      },
      "footnotes": null
    },
    {
      "id": 175035,
      "text": "Hamd (övgü), gökleri ve yeri yaratan, karanlıkları ve aydınlığı var eden Allah içindir. (Bunca delilden) sonra kâfir olanlar (hâlâ putları) Rableri ile denk tutuyorlar.[1]",
      "author": {
        "id": 107,
        "url": null,
        "name": "Mehmet Okuyan",
        "language": "tr",
        "description": "Kur’an Meal-Tefsir"
      },
      "footnotes": [
        {
          "id": 19751,
          "text": "Burada geçen [ya‘dilûne] fiili \"adaletli davranmak\" değil, putperestlerin putlarını Yüce Allah'a denk tutmaları yani şirk koşmaları anlamındadır.",
          "number": 1
        }
      ]
    }
  ]
}
```

### <a id="get-verse-words"></a> GET `/surah/[surah_id]/verse/[verse_number]/words`

> ### This endpoint is no longer supported due to structural changes.
>
> The data may be outdated and will soon be deprecated.  
> Please use the GET /surah/:surah_id/verse/:verse_number/verseparts endpoint instead.

> Lists all words of this verse along with descriptions and root infos.

Example: `https://api.acikkuran.com/surah/6/verse/1/words`

Response body:

```json
{
  "data": [
    {
      "id": 15996,
      "sort_number": 1,
      "transcription": "el-hamdu",
      "arabic": "الْحَمْدُ",
      "turkish": "hamdolsun",
      "root": {
        "id": 3,
        "latin": "Hmd",
        "arabic": "حمد"
      }
    },
    {
      "id": 15997,
      "sort_number": 2,
      "transcription": "lillahi",
      "arabic": "لِلَّهِ",
      "turkish": "o Allah'a",
      "root": null
    }
  ]
}
```

### <a id="get-verse-verseparts"></a> GET `/surah/[surah_id]/verse/[verse_number]/verseparts`

> Lists all verseparts of this verse along with descriptions and root infos.

Example: `https://api.acikkuran.com/surah/6/verse/1/verseparts`

Response body:

```json
{
  "data": [
    {
      "id": 16187,
      "sort_number": 1,
      "transcription_tr": "el-hamdu",
      "transcription_en": "al-ḥamdu",
      "arabic": "ٱلْحَمْدُ",
      "translation_tr": "hamdolsun",
      "translation_en": "(All) the praises and thanks",
      "root": {
        "id": 3,
        "latin": "Hmd",
        "arabic": "حمد"
      }
    },
    {
      "id": 16184,
      "sort_number": 2,
      "transcription_tr": "lillahi",
      "transcription_en": "lillahi",
      "arabic": "لِلَّهِ",
      "translation_tr": "o Allah'a",
      "translation_en": "(be) to Allah",
      "root": null
    }
  ]
}
```

### <a id="get-root-latin"></a> GET `/root/latin/[latin_chars]`

> Gets detail of this root with latin chars and lists all differentiations.

Example: `https://api.acikkuran.com/root/latin/Hmd`

Response body:

```json
{
  "data": {
    "id": 3,
    "latin": "Hmd",
    "arabic": "حمد",
    "transcription": "Ha-Mim-Dal",
    "transcription_en": "Ha-Mim-Dal",
    "mean": "Birini övmek veya yüceltmek veya takdir etmek, birisinden olumlu olarak bahsetmek, bir şeyi onaylamak, birine hakkını ödemek/vermek, övgüye değer veya takdire şayan olmak.",
    "mean_en": "To praise or eulogize or commend someone, speak well of someone, mention someone with approbation, approve of a thing, recompense/pay someone his due, to be praiseworthy or commendable.",
    "diffs": [
      {
        "id": 28,
        "diff": "حَمْد",
        "count": 43
      },
      {
        "id": 29,
        "diff": "حَمِيد",
        "count": 17
      },
      {
        "id": 30,
        "diff": "حَٰمِدُون",
        "count": 1
      },
      {
        "id": 31,
        "diff": "مَّحْمُود",
        "count": 1
      },
      {
        "id": 32,
        "diff": "يُحْمَدُ",
        "count": 1
      }
    ],
    "rootchar_id": 3
  }
}
```

### <a id="get-root-latin-verses"></a> GET `/root/latin/[latin_char]/verses?page=[page_number]&author=[author_id]`

> ### This endpoint is no longer supported due to structural changes.
>
> The data may be outdated and will soon be deprecated.  
> Please use the GET /root/latin/:latin/verseparts endpoint instead.

> Gets verses of this root with latin char, author and page parameters and repsonse them with pagination meta.

Example: `https://api.acikkuran.com/root/latin/Hmd/verses`

Response body:

```json
{
  "links": {
    "first": "/root/latin/Hmd/verses?page=1",
    "prev": "/root/latin/Hmd/verses?page=1",
    "next": "/root/latin/Hmd/verses?page=3",
    "last": "/root/latin/Hmd/verses?page=4"
  },
  "meta": {
    "current_page": 2,
    "from": 20,
    "last_page": 4,
    "path": "/root/latin/Hmd/verses",
    "per_page": 20,
    "to": 40,
    "total": 63
  },
  "data": [
    {
      "id": 835,
      "rootdiff_id": 28,
      "root": {
        "id": 3,
        "latin": "Hmd",
        "arabic": "حمد"
      },
      "surah": {
        "id": 17,
        "name": "İsra",
        "slug": "isra",
        "verse_count": 111,
        "page_number": 281,
        "name_original": "سورة الإسراء",
        "audio": {
          "mp3": "https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/50-isra.mp3",
          "duration": 1423
        }
      },
      "verse": {
        "id": 2140,
        "page": 292,
        "surah_id": 17,
        "verse_number": 111,
        "verse": "وَقُلِ الْحَمْدُ لِلّهِ الَّذِي لَمْ يَتَّخِذْ وَلَدًا وَلَم يَكُن لَّهُ شَرِيكٌ فِي الْمُلْكِ وَلَمْ يَكُن لَّهُ وَلِيٌّ مِّنَ الذُّلَّ وَكَبِّرْهُ تَكْبِيرًا",
        "transcription": "Ve kulil hamdu lillahillezi lem yettehız veleden ve lem yekun lehu şerikun fil mulki ve lem yekun lehu veliyyun minez zulli ve kebbirhu tekbira.",
        "juz_number": 15,
        "translation": {
          "id": 182621,
          "author": {
            "id": 105,
            "name": "Erhan Aktaş",
            "description": "Kerim Kur'an",
            "language": "tr"
          },
          "text": "Ve de ki: \"Hamd[1],  çocuk edinmeyen Allah'a özgüdür. O'nun mülkte[2] ortağı yoktur. O'nun acizlikten dolayı bir veliye[3] de ihtiyacı yoktur.\" O'nu tam bir yüceltme ile yücelt.",
          "footnotes": [
            {
              "id": 25287,
              "text": "Yandaş, yardımcı, destekçi.",
              "number": 3
            },
            {
              "id": 25286,
              "text": "Egemenlikte.",
              "number": 2
            },
            {
              "id": 25285,
              "text": "Bütün övgüler.",
              "number": 1
            }
          ]
        }
      },
      "sort_number": 2,
      "arabic": "حمد",
      "transcription": "l-hamdu",
      "turkish": "hamdolsun",
      "prop_1": "isim",
      "prop_2": "",
      "prop_3": "",
      "prop_4": "",
      "prop_5": "eril",
      "prop_6": "",
      "prop_7": "merfu` isim",
      "prop_8": ""
    }
  ]
}
```

### <a id="get-root-latin-verseparts"></a> GET `/root/latin/[latin_char]/verseparts?page=[page_number]&author=[author_id]`

> Gets verses of this root with latin char, author and page parameters and repsonse them with pagination meta.

Example: `https://api.acikkuran.com/root/latin/Hmd/verseparts`

Response body:

```json
{
  "links": {
    "first": "/root/latin/Hmd/verseparts?author=105&page=1",
    "prev": null,
    "next": "/root/latin/Hmd/verseparts?author=105&page=2",
    "last": "/root/latin/Hmd/verseparts?author=105&page=4"
  },
  "meta": {
    "current_page": 1,
    "from": 0,
    "last_page": 4,
    "path": "/root/latin/Hmd/verseparts?page=1&author=105",
    "per_page": 20,
    "to": 20,
    "total": 63
  },
  "data": [
    {
      "id": 8,
      "rootdiff_id": 28,
      "root": {
        "id": 3,
        "latin": "Hmd",
        "arabic": "حمد"
      },
      "surah": {
        "id": 1,
        "name": "Fatiha",
        "name_en": "Al-Fatihah",
        "slug": "fatiha",
        "verse_count": 7,
        "page_number": 0,
        "name_original": "سُورَةُ ٱلْفَاتِحَةِ",
        "audio": {
          "mp3": "https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/05-fatiha.mp3",
          "duration": 38,
          "mp3_en": "https://archive.org/download/QURANITE-COM/001.mp3",
          "duration_en": 29
        }
      },
      "verse": {
        "id": 2,
        "page": 0,
        "surah_id": 1,
        "verse_number": 2,
        "verse": "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَم۪ينَۙ",
        "verse_simplified": "الْحَمْدُ للّهِ رَبِّ الْعَالَمِينَ",
        "transcription_tr": "El hamdu lillahi rabbil alemin .",
        "transcription_en": "Alhamdu lillahi rabbi alAAalameen",
        "juz_number": 1,
        "translation": {
          "id": 149676,
          "author": {
            "id": 105,
            "name": "Erhan Aktaş",
            "description": "Kerim Kur'an",
            "language": "tr",
            "url": null
          },
          "text": "Övülmeye değer olan yalnızca alemlerin Rabb'i Allah'tır.",
          "footnotes": null
        }
      },
      "sort_number": 1,
      "arabic": "ٱلْحَمْدُ",
      "transcription_en": "al-ḥamdu",
      "transcription_tr": "el-hamdu",
      "translation_tr": "hamdolsun",
      "translation_en": "All praises and thanks",
      "details": [
        [
          {
            "tr": "isim",
            "en": "noun"
          }
        ],
        [],
        [],
        [],
        [
          {
            "tr": "eril",
            "en": "masculine"
          }
        ],
        [],
        [
          {
            "tr": "merfu` isim",
            "en": "nominative case"
          }
        ],
        []
      ]
    }
  ]
}
```

### <a id="get-root"></a> GET `/root/[id]`

> Gets detail of this root and lists all differentiations.

Example: `https://api.acikkuran.com/root/3`

Response body:

```json
{
  "data": {
    "id": 3,
    "latin": "Hmd",
    "arabic": "حمد",
    "transcription": "Ha-Mim-Dal",
    "transcription_en": "Ha-Mim-Dal",
    "mean": "Birini övmek veya yüceltmek veya takdir etmek, birisinden olumlu olarak bahsetmek, bir şeyi onaylamak, birine hakkını ödemek/vermek, övgüye değer veya takdire şayan olmak.",
    "mean_en": "To praise or eulogize or commend someone, speak well of someone, mention someone with approbation, approve of a thing, recompense/pay someone his due, to be praiseworthy or commendable.",
    "diffs": [
      {
        "id": 28,
        "diff": "حَمْد",
        "count": 43
      },
      {
        "id": 29,
        "diff": "حَمِيد",
        "count": 17
      }
    ]
  }
}
```

### <a id="get-rootchars"></a> GET `/rootchars`

> Lists all Arabic letters.

Example: `https://api.acikkuran.com/rootchars`

Response body:

```json
{
  "data": [
    {
      "id": 1,
      "arabic": "س",
      "latin": "s"
    },
    {
      "id": 2,
      "arabic": "ر",
      "latin": "r"
    },
    {
      "id": 3,
      "arabic": "ح",
      "latin": "H"
    }
  ]
}
```

### <a id="get-rootchar"></a> GET `/rootchar/[id]`

> Lists all roots which begins with this letter.

Example: `https://api.acikkuran.com/rootchar/1`

Response body:

```json
{
  "data": [
    {
      "id": 1,
      "latin": "smw",
      "arabic": "سمو"
    },
    {
      "id": 32,
      "latin": "swy",
      "arabic": "سوي"
    },
    {
      "id": 36,
      "latin": "smE",
      "arabic": "سمع"
    }
  ]
}
```

### <a id="get-page"></a> GET `/page/[page_number]?author_id=[author_id]`

> List page verses of The Quran with page number and author id parameters

Example 1: `https://api.acikkuran.com/page/1` Default translation
Example 2: `https://api.acikkuran.com/page/1?author=8` With author parameter

Response body:

```json
{
  data: {
    {
      "id": 6208,
      "surah": {
        "id": 109,
        "name": "Kafirun",
        "name_en": "Al-Kafirun",
        "slug": "kafirun",
        "verse_count": 6,
        "page_number": 603,
        "name_original": "سورة الكافرون",
        "audio": {
          "mp3": "https://archive.org/download/INDIRILIS_SIRASINA_GORE_SESLI_KURAN_MEALI/18-kafirun.mp3",
          "duration": 32,
          "mp3_en": "https://archive.org/download/QURANITE-COM/109.mp3",
          "duration_en": 27
        }
      },
      "verse_number": 1,
      "verse": "قُلْ يَٓا اَيُّهَا الْـكَافِرُونَۙ",
      "verse_simplified": "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "zero": {
        "id": 1,
        "surah_id": 1,
        "verse_number": 1,
        "verse": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ",
        "verse_simplified": "بِسْمِ اللّهِ الرَّحْمَنِ الرَّحِيمِ",
        "page": 0,
        "juz_number": 1,
        "transcription": "Bismillahir rahmanir rahim.",
        "transcription_en": "Bismi Allahi arrahmani arraheem",
        "translation": {
          "id": 149675,
          "author": {
            "id": 105,
            "name": "Erhan Aktaş",
            "description": "Kerim Kur'an",
            "language": "tr",
            "url": null
          },
          "text": "Rahmeti Bol ve Kesintisiz Olan Allah'ın Adıyla",
          "footnotes": null
        }
      },
      "page": 603,
      "juz_number": 30,
      "verse_without_vowel": "قل يا أيها الكافرون",
      "transcription": "Kul ya eyyuhel kafirun.",
      "transcription_en": "Qul ya ayyuha alkafiroon",
      "translation": {
        "id": 155867,
        "author": {
          "id": 105,
          "name": "Erhan Aktaş",
          "description": "Kerim Kur'an",
          "language": "tr",
          "url": null
        },
        "text": "De ki: \"Ey kafirler.[1]\"",
        "footnotes": [
          {
            "id": 15679,
            "text": "Kafir, örten demektir. Gerçeğin üzerini örten, nankörlük eden,  vahye inanmayan, güvenmeyen ve kabul etmeyen; Allah'ı ve vahyi reddeden kimse. Küfr, İman'ın, emin olmanın, güvenmenin, onaylamanın karşıtıdır.  Kafir, Kefere fiilinin ism-i failidir. Kafir/Küfr aynı kökten türemişlerdir. Kur'an, Kafir sözcüğünü daha çok birincil anlamı olan \"gerçeğin üzerini örtmek\" ve \"gerçeğe karşı nankörlük etmek anlamında kullanmaktadır. Karanlığı ile her şeyi örttüğü için geceye de kafir denmiştir. Tohumu ektikten sonra üzerini toprakla örttükleri için çiftçiye de kafir denmektedir. (57:20).",
            "number": 1
          }
        ]
      }
    },
  }
}
```
