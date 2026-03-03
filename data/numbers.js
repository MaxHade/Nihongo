var DATA_NUMBERS = [
  // ============================================================
  // sub: "basic" — Numbers 0–1,000,000
  // ============================================================
  {id: "num_01", front: "いち", back: "1", romaji: "ichi", category: "numbers", sub: "basic"},
  {id: "num_02", front: "に", back: "2", romaji: "ni", category: "numbers", sub: "basic"},
  {id: "num_03", front: "さん", back: "3", romaji: "san", category: "numbers", sub: "basic"},
  {id: "num_04", front: "よん", back: "4", romaji: "yon", hint: "auch し (shi)", category: "numbers", sub: "basic"},
  {id: "num_05", front: "ご", back: "5", romaji: "go", category: "numbers", sub: "basic"},
  {id: "num_06", front: "ろく", back: "6", romaji: "roku", category: "numbers", sub: "basic"},
  {id: "num_07", front: "なな", back: "7", romaji: "nana", hint: "auch しち (shichi)", category: "numbers", sub: "basic"},
  {id: "num_08", front: "はち", back: "8", romaji: "hachi", category: "numbers", sub: "basic"},
  {id: "num_09", front: "きゅう", back: "9", romaji: "kyuu", hint: "auch く (ku)", category: "numbers", sub: "basic"},
  {id: "num_10", front: "じゅう", back: "10", romaji: "juu", category: "numbers", sub: "basic"},
  {id: "num_11", front: "じゅういち", back: "11", romaji: "juuichi", category: "numbers", sub: "basic"},
  {id: "num_12", front: "じゅうに", back: "12", romaji: "juuni", category: "numbers", sub: "basic"},
  {id: "num_13", front: "じゅうさん", back: "13", romaji: "juusan", category: "numbers", sub: "basic"},
  {id: "num_14", front: "じゅうよん", back: "14", romaji: "juuyon", category: "numbers", sub: "basic"},
  {id: "num_15", front: "じゅうご", back: "15", romaji: "juugo", category: "numbers", sub: "basic"},
  {id: "num_16", front: "じゅうろく", back: "16", romaji: "juuroku", category: "numbers", sub: "basic"},
  {id: "num_17", front: "じゅうなな", back: "17", romaji: "juunana", category: "numbers", sub: "basic"},
  {id: "num_18", front: "じゅうはち", back: "18", romaji: "juuhachi", category: "numbers", sub: "basic"},
  {id: "num_19", front: "じゅうきゅう", back: "19", romaji: "juukyuu", category: "numbers", sub: "basic"},
  {id: "num_20", front: "にじゅう", back: "20", romaji: "nijuu", category: "numbers", sub: "basic"},
  {id: "num_21", front: "さんじゅう", back: "30", romaji: "sanjuu", category: "numbers", sub: "basic"},
  {id: "num_22", front: "よんじゅう", back: "40", romaji: "yonjuu", category: "numbers", sub: "basic"},
  {id: "num_23", front: "ごじゅう", back: "50", romaji: "gojuu", category: "numbers", sub: "basic"},
  {id: "num_24", front: "ろくじゅう", back: "60", romaji: "rokujuu", category: "numbers", sub: "basic"},
  {id: "num_25", front: "ななじゅう", back: "70", romaji: "nanajuu", category: "numbers", sub: "basic"},
  {id: "num_26", front: "はちじゅう", back: "80", romaji: "hachijuu", category: "numbers", sub: "basic"},
  {id: "num_27", front: "きゅうじゅう", back: "90", romaji: "kyuujuu", category: "numbers", sub: "basic"},
  {id: "num_28", front: "ひゃく", back: "100", romaji: "hyaku", category: "numbers", sub: "basic"},
  {id: "num_29", front: "にひゃく", back: "200", romaji: "nihyaku", category: "numbers", sub: "basic"},
  {id: "num_30", front: "さんびゃく", back: "300", romaji: "sanbyaku", category: "numbers", sub: "basic"},
  {id: "num_31", front: "よんひゃく", back: "400", romaji: "yonhyaku", category: "numbers", sub: "basic"},
  {id: "num_32", front: "ごひゃく", back: "500", romaji: "gohyaku", category: "numbers", sub: "basic"},
  {id: "num_33", front: "ろっぴゃく", back: "600", romaji: "roppyaku", category: "numbers", sub: "basic"},
  {id: "num_34", front: "ななひゃく", back: "700", romaji: "nanahyaku", category: "numbers", sub: "basic"},
  {id: "num_35", front: "はっぴゃく", back: "800", romaji: "happyaku", category: "numbers", sub: "basic"},
  {id: "num_36", front: "きゅうひゃく", back: "900", romaji: "kyuuhyaku", category: "numbers", sub: "basic"},
  {id: "num_37", front: "せん", back: "1.000", romaji: "sen", category: "numbers", sub: "basic"},
  {id: "num_38", front: "いちまん", back: "10.000", romaji: "ichiman", category: "numbers", sub: "basic"},
  {id: "num_39", front: "じゅうまん", back: "100.000", romaji: "juuman", category: "numbers", sub: "basic"},
  {id: "num_40", front: "ひゃくまん", back: "1.000.000", romaji: "hyakuman", category: "numbers", sub: "basic"},
  {id: "num_41", front: "れい", back: "0", romaji: "rei", hint: "auch ゼロ (zero)", category: "numbers", sub: "basic"},

  // ============================================================
  // sub: "counters" — Japanese counters
  // ============================================================

  // --- つ counter (general objects) ---
  {id: "num_42", front: "ひとつ", back: "1", romaji: "hitotsu", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},
  {id: "num_43", front: "ふたつ", back: "2", romaji: "futatsu", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},
  {id: "num_44", front: "みっつ", back: "3", romaji: "mittsu", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},
  {id: "num_45", front: "よっつ", back: "4", romaji: "yottsu", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},
  {id: "num_46", front: "いつつ", back: "5", romaji: "itsutsu", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},
  {id: "num_47", front: "むっつ", back: "6", romaji: "muttsu", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},
  {id: "num_48", front: "ななつ", back: "7", romaji: "nanatsu", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},
  {id: "num_49", front: "やっつ", back: "8", romaji: "yattsu", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},
  {id: "num_50", front: "ここのつ", back: "9", romaji: "kokonotsu", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},
  {id: "num_51", front: "とお", back: "10", romaji: "too", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},
  {id: "num_52", front: "いくつ", back: "wie viele?", romaji: "ikutsu", hint: "allgemeine Dinge (つ)", category: "numbers", sub: "counters"},

  // --- 人 counter (people) ---
  {id: "num_53", front: "ひとり", back: "1", romaji: "hitori", hint: "Menschen (人)", category: "numbers", sub: "counters"},
  {id: "num_54", front: "ふたり", back: "2", romaji: "futari", hint: "Menschen (人)", category: "numbers", sub: "counters"},
  {id: "num_55", front: "さんにん", back: "3", romaji: "sannin", hint: "Menschen (人)", category: "numbers", sub: "counters"},
  {id: "num_56", front: "よにん", back: "4", romaji: "yonin", hint: "Menschen (人)", category: "numbers", sub: "counters"},
  {id: "num_57", front: "ごにん", back: "5", romaji: "gonin", hint: "Menschen (人)", category: "numbers", sub: "counters"},
  {id: "num_58", front: "ろくにん", back: "6", romaji: "rokunin", hint: "Menschen (人)", category: "numbers", sub: "counters"},
  {id: "num_59", front: "しちにん", back: "7", romaji: "shichinin", hint: "Menschen (人)", category: "numbers", sub: "counters"},
  {id: "num_60", front: "はちにん", back: "8", romaji: "hachinin", hint: "Menschen (人)", category: "numbers", sub: "counters"},
  {id: "num_61", front: "きゅうにん", back: "9", romaji: "kyuunin", hint: "Menschen (人)", category: "numbers", sub: "counters"},
  {id: "num_62", front: "じゅうにん", back: "10", romaji: "juunin", hint: "Menschen (人)", category: "numbers", sub: "counters"},
  {id: "num_63", front: "なんにん", back: "wie viele?", romaji: "nannin", hint: "Menschen (人)", category: "numbers", sub: "counters"},

  // --- 枚 counter (flat objects) ---
  {id: "num_64", front: "いちまい", back: "1", romaji: "ichimai", hint: "flache Dinge (枚)", category: "numbers", sub: "counters"},
  {id: "num_65", front: "にまい", back: "2", romaji: "nimai", hint: "flache Dinge (枚)", category: "numbers", sub: "counters"},
  {id: "num_66", front: "さんまい", back: "3", romaji: "sanmai", hint: "flache Dinge (枚)", category: "numbers", sub: "counters"},
  {id: "num_67", front: "なんまい", back: "wie viele?", romaji: "nanmai", hint: "flache Dinge (枚)", category: "numbers", sub: "counters"},

  // --- 本 counter (long objects) ---
  {id: "num_68", front: "いっぽん", back: "1", romaji: "ippon", hint: "lange Dinge (本)", category: "numbers", sub: "counters"},
  {id: "num_69", front: "にほん", back: "2", romaji: "nihon", hint: "lange Dinge (本)", category: "numbers", sub: "counters"},
  {id: "num_70", front: "さんぼん", back: "3", romaji: "sanbon", hint: "lange Dinge (本)", category: "numbers", sub: "counters"},
  {id: "num_71", front: "なんぼん", back: "wie viele?", romaji: "nanbon", hint: "lange Dinge (本)", category: "numbers", sub: "counters"},

  // --- 匹 counter (small animals) ---
  {id: "num_72", front: "いっぴき", back: "1", romaji: "ippiki", hint: "kleine Tiere (匹)", category: "numbers", sub: "counters"},
  {id: "num_73", front: "にひき", back: "2", romaji: "nihiki", hint: "kleine Tiere (匹)", category: "numbers", sub: "counters"},
  {id: "num_74", front: "さんびき", back: "3", romaji: "sanbiki", hint: "kleine Tiere (匹)", category: "numbers", sub: "counters"},
  {id: "num_75", front: "なんびき", back: "wie viele?", romaji: "nanbiki", hint: "kleine Tiere (匹)", category: "numbers", sub: "counters"},

  // --- 台 counter (machines/vehicles) ---
  {id: "num_76", front: "いちだい", back: "1", romaji: "ichidai", hint: "Maschinen/Fahrzeuge (台)", category: "numbers", sub: "counters"},
  {id: "num_77", front: "にだい", back: "2", romaji: "nidai", hint: "Maschinen/Fahrzeuge (台)", category: "numbers", sub: "counters"},
  {id: "num_78", front: "さんだい", back: "3", romaji: "sandai", hint: "Maschinen/Fahrzeuge (台)", category: "numbers", sub: "counters"},
  {id: "num_79", front: "なんだい", back: "wie viele?", romaji: "nandai", hint: "Maschinen/Fahrzeuge (台)", category: "numbers", sub: "counters"},

  // --- 階 counter (floors) ---
  {id: "num_80", front: "いっかい", back: "1", romaji: "ikkai", hint: "Stockwerke (階)", category: "numbers", sub: "counters"},
  {id: "num_81", front: "にかい", back: "2", romaji: "nikai", hint: "Stockwerke (階)", category: "numbers", sub: "counters"},
  {id: "num_82", front: "さんがい", back: "3", romaji: "sangai", hint: "Stockwerke (階)", category: "numbers", sub: "counters"},
  {id: "num_83", front: "なんがい", back: "wie viele?", romaji: "nangai", hint: "Stockwerke (階)", category: "numbers", sub: "counters"},

  // --- 冊 counter (books) ---
  {id: "num_84", front: "いっさつ", back: "1", romaji: "issatsu", hint: "Bücher (冊)", category: "numbers", sub: "counters"},
  {id: "num_85", front: "にさつ", back: "2", romaji: "nisatsu", hint: "Bücher (冊)", category: "numbers", sub: "counters"},
  {id: "num_86", front: "さんさつ", back: "3", romaji: "sansatsu", hint: "Bücher (冊)", category: "numbers", sub: "counters"},
  {id: "num_87", front: "なんさつ", back: "wie viele?", romaji: "nansatsu", hint: "Bücher (冊)", category: "numbers", sub: "counters"},

  // --- 杯 counter (cups/glasses) ---
  {id: "num_88", front: "いっぱい", back: "1", romaji: "ippai", hint: "Tassen/Gläser (杯)", category: "numbers", sub: "counters"},
  {id: "num_89", front: "にはい", back: "2", romaji: "nihai", hint: "Tassen/Gläser (杯)", category: "numbers", sub: "counters"},
  {id: "num_90", front: "さんばい", back: "3", romaji: "sanbai", hint: "Tassen/Gläser (杯)", category: "numbers", sub: "counters"},
  {id: "num_91", front: "なんばい", back: "wie viele?", romaji: "nanbai", hint: "Tassen/Gläser (杯)", category: "numbers", sub: "counters"}
];
