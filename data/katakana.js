/* ==========================================================
   Katakana Flashcard Data
   - Strict Hepburn romanization
   - Two directions per character:
       1. Japanese -> Romaji  (kata_XX)
       2. Romaji -> Japanese  (kata_rev_XX)
   - Subcategories: gojuuon, dakuten, combo
   ========================================================== */

var DATA_KATAKANA = [

  // ============================================================
  //  GOJUUON  (46 basic katakana)
  // ============================================================

  // --- Vowels ---
  {id: "kata_01", front: "\u30A2", back: "a",   category: "katakana", sub: "gojuuon"},
  {id: "kata_02", front: "\u30A4", back: "i",   category: "katakana", sub: "gojuuon"},
  {id: "kata_03", front: "\u30A6", back: "u",   category: "katakana", sub: "gojuuon"},
  {id: "kata_04", front: "\u30A8", back: "e",   category: "katakana", sub: "gojuuon"},
  {id: "kata_05", front: "\u30AA", back: "o",   category: "katakana", sub: "gojuuon"},

  // --- Ka-row ---
  {id: "kata_06", front: "\u30AB", back: "ka",  category: "katakana", sub: "gojuuon"},
  {id: "kata_07", front: "\u30AD", back: "ki",  category: "katakana", sub: "gojuuon"},
  {id: "kata_08", front: "\u30AF", back: "ku",  category: "katakana", sub: "gojuuon"},
  {id: "kata_09", front: "\u30B1", back: "ke",  category: "katakana", sub: "gojuuon"},
  {id: "kata_10", front: "\u30B3", back: "ko",  category: "katakana", sub: "gojuuon"},

  // --- Sa-row ---
  {id: "kata_11", front: "\u30B5", back: "sa",  category: "katakana", sub: "gojuuon"},
  {id: "kata_12", front: "\u30B7", back: "shi", category: "katakana", sub: "gojuuon"},
  {id: "kata_13", front: "\u30B9", back: "su",  category: "katakana", sub: "gojuuon"},
  {id: "kata_14", front: "\u30BB", back: "se",  category: "katakana", sub: "gojuuon"},
  {id: "kata_15", front: "\u30BD", back: "so",  category: "katakana", sub: "gojuuon"},

  // --- Ta-row ---
  {id: "kata_16", front: "\u30BF", back: "ta",  category: "katakana", sub: "gojuuon"},
  {id: "kata_17", front: "\u30C1", back: "chi", category: "katakana", sub: "gojuuon"},
  {id: "kata_18", front: "\u30C4", back: "tsu", category: "katakana", sub: "gojuuon"},
  {id: "kata_19", front: "\u30C6", back: "te",  category: "katakana", sub: "gojuuon"},
  {id: "kata_20", front: "\u30C8", back: "to",  category: "katakana", sub: "gojuuon"},

  // --- Na-row ---
  {id: "kata_21", front: "\u30CA", back: "na",  category: "katakana", sub: "gojuuon"},
  {id: "kata_22", front: "\u30CB", back: "ni",  category: "katakana", sub: "gojuuon"},
  {id: "kata_23", front: "\u30CC", back: "nu",  category: "katakana", sub: "gojuuon"},
  {id: "kata_24", front: "\u30CD", back: "ne",  category: "katakana", sub: "gojuuon"},
  {id: "kata_25", front: "\u30CE", back: "no",  category: "katakana", sub: "gojuuon"},

  // --- Ha-row ---
  {id: "kata_26", front: "\u30CF", back: "ha",  category: "katakana", sub: "gojuuon"},
  {id: "kata_27", front: "\u30D2", back: "hi",  category: "katakana", sub: "gojuuon"},
  {id: "kata_28", front: "\u30D5", back: "fu",  category: "katakana", sub: "gojuuon"},
  {id: "kata_29", front: "\u30D8", back: "he",  category: "katakana", sub: "gojuuon"},
  {id: "kata_30", front: "\u30DB", back: "ho",  category: "katakana", sub: "gojuuon"},

  // --- Ma-row ---
  {id: "kata_31", front: "\u30DE", back: "ma",  category: "katakana", sub: "gojuuon"},
  {id: "kata_32", front: "\u30DF", back: "mi",  category: "katakana", sub: "gojuuon"},
  {id: "kata_33", front: "\u30E0", back: "mu",  category: "katakana", sub: "gojuuon"},
  {id: "kata_34", front: "\u30E1", back: "me",  category: "katakana", sub: "gojuuon"},
  {id: "kata_35", front: "\u30E2", back: "mo",  category: "katakana", sub: "gojuuon"},

  // --- Ya-row ---
  {id: "kata_36", front: "\u30E4", back: "ya",  category: "katakana", sub: "gojuuon"},
  {id: "kata_37", front: "\u30E6", back: "yu",  category: "katakana", sub: "gojuuon"},
  {id: "kata_38", front: "\u30E8", back: "yo",  category: "katakana", sub: "gojuuon"},

  // --- Ra-row ---
  {id: "kata_39", front: "\u30E9", back: "ra",  category: "katakana", sub: "gojuuon"},
  {id: "kata_40", front: "\u30EA", back: "ri",  category: "katakana", sub: "gojuuon"},
  {id: "kata_41", front: "\u30EB", back: "ru",  category: "katakana", sub: "gojuuon"},
  {id: "kata_42", front: "\u30EC", back: "re",  category: "katakana", sub: "gojuuon"},
  {id: "kata_43", front: "\u30ED", back: "ro",  category: "katakana", sub: "gojuuon"},

  // --- Wa-row + N ---
  {id: "kata_44", front: "\u30EF", back: "wa",  category: "katakana", sub: "gojuuon"},
  {id: "kata_45", front: "\u30F2", back: "wo",  category: "katakana", sub: "gojuuon"},
  {id: "kata_46", front: "\u30F3", back: "n",   category: "katakana", sub: "gojuuon"},

  // --- Gojuuon REVERSE (Romaji -> Katakana) ---
  {id: "kata_rev_01", front: "a",   back: "\u30A2", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_02", front: "i",   back: "\u30A4", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_03", front: "u",   back: "\u30A6", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_04", front: "e",   back: "\u30A8", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_05", front: "o",   back: "\u30AA", category: "katakana", sub: "gojuuon_rev"},

  {id: "kata_rev_06", front: "ka",  back: "\u30AB", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_07", front: "ki",  back: "\u30AD", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_08", front: "ku",  back: "\u30AF", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_09", front: "ke",  back: "\u30B1", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_10", front: "ko",  back: "\u30B3", category: "katakana", sub: "gojuuon_rev"},

  {id: "kata_rev_11", front: "sa",  back: "\u30B5", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_12", front: "shi", back: "\u30B7", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_13", front: "su",  back: "\u30B9", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_14", front: "se",  back: "\u30BB", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_15", front: "so",  back: "\u30BD", category: "katakana", sub: "gojuuon_rev"},

  {id: "kata_rev_16", front: "ta",  back: "\u30BF", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_17", front: "chi", back: "\u30C1", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_18", front: "tsu", back: "\u30C4", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_19", front: "te",  back: "\u30C6", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_20", front: "to",  back: "\u30C8", category: "katakana", sub: "gojuuon_rev"},

  {id: "kata_rev_21", front: "na",  back: "\u30CA", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_22", front: "ni",  back: "\u30CB", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_23", front: "nu",  back: "\u30CC", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_24", front: "ne",  back: "\u30CD", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_25", front: "no",  back: "\u30CE", category: "katakana", sub: "gojuuon_rev"},

  {id: "kata_rev_26", front: "ha",  back: "\u30CF", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_27", front: "hi",  back: "\u30D2", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_28", front: "fu",  back: "\u30D5", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_29", front: "he",  back: "\u30D8", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_30", front: "ho",  back: "\u30DB", category: "katakana", sub: "gojuuon_rev"},

  {id: "kata_rev_31", front: "ma",  back: "\u30DE", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_32", front: "mi",  back: "\u30DF", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_33", front: "mu",  back: "\u30E0", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_34", front: "me",  back: "\u30E1", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_35", front: "mo",  back: "\u30E2", category: "katakana", sub: "gojuuon_rev"},

  {id: "kata_rev_36", front: "ya",  back: "\u30E4", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_37", front: "yu",  back: "\u30E6", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_38", front: "yo",  back: "\u30E8", category: "katakana", sub: "gojuuon_rev"},

  {id: "kata_rev_39", front: "ra",  back: "\u30E9", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_40", front: "ri",  back: "\u30EA", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_41", front: "ru",  back: "\u30EB", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_42", front: "re",  back: "\u30EC", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_43", front: "ro",  back: "\u30ED", category: "katakana", sub: "gojuuon_rev"},

  {id: "kata_rev_44", front: "wa",  back: "\u30EF", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_45", front: "wo",  back: "\u30F2", category: "katakana", sub: "gojuuon_rev"},
  {id: "kata_rev_46", front: "n",   back: "\u30F3", category: "katakana", sub: "gojuuon_rev"},


  // ============================================================
  //  DAKUTEN  (25 voiced / semi-voiced katakana)
  // ============================================================

  // --- Ga-row ---
  {id: "kata_47", front: "\u30AC", back: "ga",  category: "katakana", sub: "dakuten"},
  {id: "kata_48", front: "\u30AE", back: "gi",  category: "katakana", sub: "dakuten"},
  {id: "kata_49", front: "\u30B0", back: "gu",  category: "katakana", sub: "dakuten"},
  {id: "kata_50", front: "\u30B2", back: "ge",  category: "katakana", sub: "dakuten"},
  {id: "kata_51", front: "\u30B4", back: "go",  category: "katakana", sub: "dakuten"},

  // --- Za-row ---
  {id: "kata_52", front: "\u30B6", back: "za",  category: "katakana", sub: "dakuten"},
  {id: "kata_53", front: "\u30B8", back: "ji",  category: "katakana", sub: "dakuten"},
  {id: "kata_54", front: "\u30BA", back: "zu",  category: "katakana", sub: "dakuten"},
  {id: "kata_55", front: "\u30BC", back: "ze",  category: "katakana", sub: "dakuten"},
  {id: "kata_56", front: "\u30BE", back: "zo",  category: "katakana", sub: "dakuten"},

  // --- Da-row ---
  {id: "kata_57", front: "\u30C0", back: "da",  category: "katakana", sub: "dakuten"},
  {id: "kata_58", front: "\u30C2", back: "ji",  category: "katakana", sub: "dakuten"},
  {id: "kata_59", front: "\u30C5", back: "zu",  category: "katakana", sub: "dakuten"},
  {id: "kata_60", front: "\u30C7", back: "de",  category: "katakana", sub: "dakuten"},
  {id: "kata_61", front: "\u30C9", back: "do",  category: "katakana", sub: "dakuten"},

  // --- Ba-row ---
  {id: "kata_62", front: "\u30D0", back: "ba",  category: "katakana", sub: "dakuten"},
  {id: "kata_63", front: "\u30D3", back: "bi",  category: "katakana", sub: "dakuten"},
  {id: "kata_64", front: "\u30D6", back: "bu",  category: "katakana", sub: "dakuten"},
  {id: "kata_65", front: "\u30D9", back: "be",  category: "katakana", sub: "dakuten"},
  {id: "kata_66", front: "\u30DC", back: "bo",  category: "katakana", sub: "dakuten"},

  // --- Pa-row ---
  {id: "kata_67", front: "\u30D1", back: "pa",  category: "katakana", sub: "dakuten"},
  {id: "kata_68", front: "\u30D4", back: "pi",  category: "katakana", sub: "dakuten"},
  {id: "kata_69", front: "\u30D7", back: "pu",  category: "katakana", sub: "dakuten"},
  {id: "kata_70", front: "\u30DA", back: "pe",  category: "katakana", sub: "dakuten"},
  {id: "kata_71", front: "\u30DD", back: "po",  category: "katakana", sub: "dakuten"},

  // --- Dakuten REVERSE (Romaji -> Katakana) ---
  {id: "kata_rev_47", front: "ga",  back: "\u30AC", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_48", front: "gi",  back: "\u30AE", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_49", front: "gu",  back: "\u30B0", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_50", front: "ge",  back: "\u30B2", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_51", front: "go",  back: "\u30B4", category: "katakana", sub: "dakuten_rev"},

  {id: "kata_rev_52", front: "za",  back: "\u30B6", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_53", front: "ji",  back: "\u30B8", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_54", front: "zu",  back: "\u30BA", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_55", front: "ze",  back: "\u30BC", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_56", front: "zo",  back: "\u30BE", category: "katakana", sub: "dakuten_rev"},

  {id: "kata_rev_57", front: "da",  back: "\u30C0", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_58", front: "ji",  back: "\u30C2", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_59", front: "zu",  back: "\u30C5", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_60", front: "de",  back: "\u30C7", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_61", front: "do",  back: "\u30C9", category: "katakana", sub: "dakuten_rev"},

  {id: "kata_rev_62", front: "ba",  back: "\u30D0", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_63", front: "bi",  back: "\u30D3", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_64", front: "bu",  back: "\u30D6", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_65", front: "be",  back: "\u30D9", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_66", front: "bo",  back: "\u30DC", category: "katakana", sub: "dakuten_rev"},

  {id: "kata_rev_67", front: "pa",  back: "\u30D1", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_68", front: "pi",  back: "\u30D4", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_69", front: "pu",  back: "\u30D7", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_70", front: "pe",  back: "\u30DA", category: "katakana", sub: "dakuten_rev"},
  {id: "kata_rev_71", front: "po",  back: "\u30DD", category: "katakana", sub: "dakuten_rev"},


  // ============================================================
  //  COMBO  (36 combination katakana - youon)
  // ============================================================

  // --- Ki-combos ---
  {id: "kata_72",  front: "\u30AD\u30E3", back: "kya", category: "katakana", sub: "combo"},
  {id: "kata_73",  front: "\u30AD\u30E5", back: "kyu", category: "katakana", sub: "combo"},
  {id: "kata_74",  front: "\u30AD\u30E7", back: "kyo", category: "katakana", sub: "combo"},

  // --- Shi-combos ---
  {id: "kata_75",  front: "\u30B7\u30E3", back: "sha", category: "katakana", sub: "combo"},
  {id: "kata_76",  front: "\u30B7\u30E5", back: "shu", category: "katakana", sub: "combo"},
  {id: "kata_77",  front: "\u30B7\u30E7", back: "sho", category: "katakana", sub: "combo"},

  // --- Chi-combos ---
  {id: "kata_78",  front: "\u30C1\u30E3", back: "cha", category: "katakana", sub: "combo"},
  {id: "kata_79",  front: "\u30C1\u30E5", back: "chu", category: "katakana", sub: "combo"},
  {id: "kata_80",  front: "\u30C1\u30E7", back: "cho", category: "katakana", sub: "combo"},

  // --- Ni-combos ---
  {id: "kata_81",  front: "\u30CB\u30E3", back: "nya", category: "katakana", sub: "combo"},
  {id: "kata_82",  front: "\u30CB\u30E5", back: "nyu", category: "katakana", sub: "combo"},
  {id: "kata_83",  front: "\u30CB\u30E7", back: "nyo", category: "katakana", sub: "combo"},

  // --- Hi-combos ---
  {id: "kata_84",  front: "\u30D2\u30E3", back: "hya", category: "katakana", sub: "combo"},
  {id: "kata_85",  front: "\u30D2\u30E5", back: "hyu", category: "katakana", sub: "combo"},
  {id: "kata_86",  front: "\u30D2\u30E7", back: "hyo", category: "katakana", sub: "combo"},

  // --- Mi-combos ---
  {id: "kata_87",  front: "\u30DF\u30E3", back: "mya", category: "katakana", sub: "combo"},
  {id: "kata_88",  front: "\u30DF\u30E5", back: "myu", category: "katakana", sub: "combo"},
  {id: "kata_89",  front: "\u30DF\u30E7", back: "myo", category: "katakana", sub: "combo"},

  // --- Ri-combos ---
  {id: "kata_90",  front: "\u30EA\u30E3", back: "rya", category: "katakana", sub: "combo"},
  {id: "kata_91",  front: "\u30EA\u30E5", back: "ryu", category: "katakana", sub: "combo"},
  {id: "kata_92",  front: "\u30EA\u30E7", back: "ryo", category: "katakana", sub: "combo"},

  // --- Gi-combos ---
  {id: "kata_93",  front: "\u30AE\u30E3", back: "gya", category: "katakana", sub: "combo"},
  {id: "kata_94",  front: "\u30AE\u30E5", back: "gyu", category: "katakana", sub: "combo"},
  {id: "kata_95",  front: "\u30AE\u30E7", back: "gyo", category: "katakana", sub: "combo"},

  // --- Ji-combos ---
  {id: "kata_96",  front: "\u30B8\u30E3", back: "ja",  category: "katakana", sub: "combo"},
  {id: "kata_97",  front: "\u30B8\u30E5", back: "ju",  category: "katakana", sub: "combo"},
  {id: "kata_98",  front: "\u30B8\u30E7", back: "jo",  category: "katakana", sub: "combo"},

  // --- Bi-combos ---
  {id: "kata_99",  front: "\u30D3\u30E3", back: "bya", category: "katakana", sub: "combo"},
  {id: "kata_100", front: "\u30D3\u30E5", back: "byu", category: "katakana", sub: "combo"},
  {id: "kata_101", front: "\u30D3\u30E7", back: "byo", category: "katakana", sub: "combo"},

  // --- Pi-combos ---
  {id: "kata_102", front: "\u30D4\u30E3", back: "pya", category: "katakana", sub: "combo"},
  {id: "kata_103", front: "\u30D4\u30E5", back: "pyu", category: "katakana", sub: "combo"},
  {id: "kata_104", front: "\u30D4\u30E7", back: "pyo", category: "katakana", sub: "combo"},

  // ---- Bi-combos (last item above has no trailing comma issue, but arrays allow it) ---

  // --- Combo REVERSE (Romaji -> Katakana) ---
  {id: "kata_rev_72",  front: "kya", back: "\u30AD\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_73",  front: "kyu", back: "\u30AD\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_74",  front: "kyo", back: "\u30AD\u30E7", category: "katakana", sub: "combo_rev"},

  {id: "kata_rev_75",  front: "sha", back: "\u30B7\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_76",  front: "shu", back: "\u30B7\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_77",  front: "sho", back: "\u30B7\u30E7", category: "katakana", sub: "combo_rev"},

  {id: "kata_rev_78",  front: "cha", back: "\u30C1\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_79",  front: "chu", back: "\u30C1\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_80",  front: "cho", back: "\u30C1\u30E7", category: "katakana", sub: "combo_rev"},

  {id: "kata_rev_81",  front: "nya", back: "\u30CB\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_82",  front: "nyu", back: "\u30CB\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_83",  front: "nyo", back: "\u30CB\u30E7", category: "katakana", sub: "combo_rev"},

  {id: "kata_rev_84",  front: "hya", back: "\u30D2\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_85",  front: "hyu", back: "\u30D2\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_86",  front: "hyo", back: "\u30D2\u30E7", category: "katakana", sub: "combo_rev"},

  {id: "kata_rev_87",  front: "mya", back: "\u30DF\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_88",  front: "myu", back: "\u30DF\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_89",  front: "myo", back: "\u30DF\u30E7", category: "katakana", sub: "combo_rev"},

  {id: "kata_rev_90",  front: "rya", back: "\u30EA\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_91",  front: "ryu", back: "\u30EA\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_92",  front: "ryo", back: "\u30EA\u30E7", category: "katakana", sub: "combo_rev"},

  {id: "kata_rev_93",  front: "gya", back: "\u30AE\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_94",  front: "gyu", back: "\u30AE\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_95",  front: "gyo", back: "\u30AE\u30E7", category: "katakana", sub: "combo_rev"},

  {id: "kata_rev_96",  front: "ja",  back: "\u30B8\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_97",  front: "ju",  back: "\u30B8\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_98",  front: "jo",  back: "\u30B8\u30E7", category: "katakana", sub: "combo_rev"},

  {id: "kata_rev_99",  front: "bya", back: "\u30D3\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_100", front: "byu", back: "\u30D3\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_101", front: "byo", back: "\u30D3\u30E7", category: "katakana", sub: "combo_rev"},

  {id: "kata_rev_102", front: "pya", back: "\u30D4\u30E3", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_103", front: "pyu", back: "\u30D4\u30E5", category: "katakana", sub: "combo_rev"},
  {id: "kata_rev_104", front: "pyo", back: "\u30D4\u30E7", category: "katakana", sub: "combo_rev"}
];
