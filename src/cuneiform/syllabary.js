/**
 * Cuneiform Syllabary - Neo-Assyrian standard values
 * Maps syllabic values (V, CV, VC, CVC) to Unicode code points
 * Source: Wikipedia Cuneiform article, Unicode block U+12000-U+123FF,
 *         Borger sign list, Labat syllabary
 *
 * Each sign can have multiple readings; we use the primary Neo-Assyrian value.
 * Alternate signs are included for visual variety where available.
 */

export const SYLLABARY = {
  // ─── VOWELS (V) ───
  'a':  '\u{12000}',  // 𒀀 A
  'e':  '\u{1208A}',  // 𒂊 E
  'i':  '\u{1213F}',  // 𒄿 I
  'u':  '\u{12303}',  // 𒌋 U (also used for U₂)

  // Alternate vowel signs for variety
  'a2': '\u{12009}',  // 𒀉 A2
  'a3': '\u{12038}',  // 𒀸 AŠ = a₃
  'e2': '\u{1208D}',  // 𒂍 E2
  'i2': '\u{1214A}',  // 𒅊 I2
  'u2': '\u{12304}',  // 𒌌 U2/U₃

  // ─── CV: B series ───
  'ba': '\u{12040}',  // 𒁀 BA
  'be': '\u{12042}',  // 𒁂 BE/BI₂
  'bi': '\u{12049}',  // 𒁉 BI
  'bu': '\u{1204D}',  // 𒁍 BU

  // ─── CV: D series ───
  'da': '\u{12054}',  // 𒁔 DA
  'de': '\u{12055}',  // 𒁕 DE/DI
  'di': '\u{12055}',  // 𒁕 DI (same sign as DE in Neo-Assyrian)
  'du': '\u{1207A}',  // 𒁺 DU

  // ─── CV: G series ───
  'ga': '\u{12006}',  // 𒀆 GA
  'ge': '\u{12076}',  // 𒁶 GE₂/GI₄
  'gi': '\u{12100}',  // 𒄀 GI
  'gu': '\u{12112}',  // 𒄒 GU

  // ─── CV: Ḫ series ───
  'ḫa': '\u{120E8}',  // 𒃨 ḪA
  'ḫe': '\u{120EA}',  // 𒃪 ḪE
  'ḫi': '\u{120EB}',  // 𒃫 ḪI
  'ḫu': '\u{120EC}',  // 𒃬 ḪU

  // ─── CV: K series ───
  'ka': '\u{12157}',  // 𒅗 KA
  'ke': '\u{12018}',  // 𒀘 KE/KEŠ
  'ki': '\u{121A0}',  // 𒆠 KI
  'ku': '\u{121AA}',  // 𒆪 KU

  // ─── CV: L series ───
  'la': '\u{121EE}',  // 𒇮 LA
  'le': '\u{121EF}',  // 𒇯 LE/LI
  'li': '\u{121EF}',  // 𒇯 LI (same as LE)
  'lu': '\u{121F4}',  // 𒇴 LU

  // ─── CV: M series ───
  'ma': '\u{120A4}',  // 𒂤 MA
  'me': '\u{120A9}',  // 𒂩 ME
  'mi': '\u{12245}',  // 𒉅 MI
  'mu': '\u{1225C}',  // 𒉜 MU

  // ─── CV: N series ───
  'na': '\u{12058}',  // 𒁘 NA
  'ne': '\u{12029}',  // 𒀩 NE
  'ni': '\u{12250}',  // 𒉐 NI
  'nu': '\u{122C0}',  // 𒋀 NU

  // ─── CV: P series ───
  'pa': '\u{12198}',  // 𒆘 PA
  'pe': '\u{12122}',  // 𒄢 PE/PI₂
  'pi': '\u{12128}',  // 𒄨 PI
  'pu': '\u{12164}',  // 𒅤 PU

  // ─── CV: R series ───
  'ra': '\u{12070}',  // 𒁰 RA
  're': '\u{12291}',  // 𒊑 RE/RI
  'ri': '\u{12291}',  // 𒊑 RI (same as RE)
  'ru': '\u{12211}',  // 𒈑 RU

  // ─── CV: S series ───
  'sa': '\u{120C8}',  // 𒃈 SA
  'se': '\u{122DC}',  // 𒋜 SE
  'si': '\u{122E0}',  // 𒋠 SI
  'su': '\u{122EB}',  // 𒋫 SU (also ZU)

  // ─── CV: Š series ───
  'ša': '\u{1202A}',  // 𒀪 ŠA
  'še': '\u{122CA}',  // 𒋊 ŠE
  'ši': '\u{122CA}',  // 𒋊 ŠI (context-dependent reading)
  'šu': '\u{122F6}',  // 𒋶 ŠU

  // ─── CV: T series ───
  'ta': '\u{122EB}',  // 𒋫 TA
  'te': '\u{122F0}',  // 𒋰 TE/TI
  'ti': '\u{122F0}',  // 𒋰 TI
  'tu': '\u{1230C}',  // 𒌌 TU (also U₃)

  // ─── CV: Z series ───
  'za': '\u{12088}',  // 𒂈 ZA
  'ze': '\u{12074}',  // 𒁴 ZE/ZI₂
  'zi': '\u{12260}',  // 𒉠 ZI
  'zu': '\u{122EB}',  // 𒋫 ZU (same sign as SU)

  // ─── CV: Ŋ/Ṣ/Ṭ series (less common) ───
  'ṣa': '\u{12180}',  // 𒆀 ṢA
  'ṭa': '\u{12054}',  // 𒁔 ṬA (uses DA sign in Neo-Assyrian)

  // ─── VC: vowel + B ───
  'ub': '\u{12050}',  // 𒁐 UB
  'ib': '\u{12146}',  // 𒅆 IB (also IGI)

  // ─── VC: vowel + D ───
  'ad': '\u{1201D}',  // 𒀝 AD (also AK)
  'id': '\u{12009}',  // 𒀉 ID (also A₂)
  'ud': '\u{12313}',  // 𒌓 UD

  // ─── VC: vowel + G ───
  'ag': '\u{1201D}',  // 𒀝 AG (same as AK/AD)
  'ig': '\u{1206C}',  // 𒁬 IG

  // ─── VC: vowel + Ḫ ───
  'aḫ': '\u{12014}',  // 𒀔 AḪ
  'eḫ': '\u{12014}',  // 𒀔 EḪ (same sign)
  'iḫ': '\u{12014}',  // 𒀔 IḪ (same sign)
  'uḫ': '\u{12014}',  // 𒀔 UḪ (same sign)

  // ─── VC: vowel + K ───
  'ak': '\u{1201D}',  // 𒀝 AK
  'ek': '\u{1201D}',  // 𒀝 EK (same sign)
  'ik': '\u{1201D}',  // 𒀝 IK (same sign)
  'uk': '\u{1201D}',  // 𒀝 UK (same sign)

  // ─── VC: vowel + L ───
  'al': '\u{12010}',  // 𒀐 AL
  'il': '\u{12088}',  // 𒂈 IL (shares with ZA in some traditions)
  'ul': '\u{1230B}',  // 𒌋 UL

  // ─── VC: vowel + M ───
  'am': '\u{1202C}',  // 𒀬 AM
  'im': '\u{12052}',  // 𒁒 IM
  'um': '\u{12072}',  // 𒁲 UM

  // ─── VC: vowel + N ───
  'an': '\u{1202D}',  // 𒀭 AN (also DINGIR determinative)
  'en': '\u{12097}',  // 𒂗 EN
  'in': '\u{12144}',  // 𒅄 IN
  'un': '\u{12110}',  // 𒄐 UN

  // ─── VC: vowel + R ───
  'ar': '\u{12034}',  // 𒀴 AR
  'er': '\u{1207E}',  // 𒁾 ER/IR
  'ir': '\u{1207E}',  // 𒁾 IR
  'ur': '\u{12337}',  // 𒌷 UR (also URU)

  // ─── VC: vowel + S/Š ───
  'aš': '\u{12038}',  // 𒀸 AŠ
  'iš': '\u{12114}',  // 𒄔 IŠ
  'uš': '\u{12302}',  // 𒌂 UŠ

  // ─── VC: vowel + T ───
  'at': '\u{12060}',  // 𒁠 AT
  'it': '\u{12299}',  // 𒊙 IT
  'ut': '\u{12313}',  // 𒌓 UT (also UD)

  // ─── CVC: common signs ───
  'bal': '\u{12044}', // 𒁄 BAL
  'kur': '\u{121B3}', // 𒆳 KUR
  'lugal': '\u{12217}', // 𒆗 LUGAL
  'kal': '\u{12028}', // 𒀨 KAL
  'nam': '\u{120A0}', // 𒂠 NAM
  'sar': '\u{1228A}', // 𒊊 SAR
  'dar': '\u{12056}', // 𒁖 DAR
  'gal': '\u{12038}', // 𒀸 GAL (also AŠ)
  'dur': '\u{12058}', // 𒁘 DUR (shares with NA)
  'nim': '\u{12254}', // 𒉔 NIM
  'tir': '\u{122F0}', // 𒋰 TIR (shares with TE)
  'dim': '\u{12057}', // 𒁗 DIM
  'kin': '\u{12100}', // 𒄀 KIN (shares with GI)
  'dim': '\u{12057}', // 𒁗 DIM
  'tam': '\u{122EB}', // 𒋫 TAM (shares with TA/SU/ZU)
  'dan': '\u{12054}', // 𒁔 DAN (shares with DA)
  'kan': '\u{12157}', // 𒅗 KAN (shares with KA)
  'man': '\u{120A4}', // 𒂤 MAN (shares with MA)
  'rab': '\u{12070}', // 𒁰 RAB (shares with RA)
  'šar': '\u{1202A}', // 𒀪 ŠAR (shares with ŠA)
  'tan': '\u{122EB}', // 𒋫 TAN (shares with TA)

  // ─── DETERMINATIVES (used before names) ───
  'dingir': '\u{1202D}', // 𒀭 DINGIR (deity determinative, same as AN)
  'lú':     '\u{121FD}', // 𒇽 LÚ (person/man determinative)
  'munus':  '\u{122A9}', // 𒊩 MUNUS (woman determinative)
};

// ─── ALTERNATE SIGNS ───
// For visual variety, some syllables have alternate signs.
// The translator can randomly choose among alternates.
export const ALTERNATE_SIGNS = {
  'a':  ['\u{12000}', '\u{12009}', '\u{12038}'],
  'e':  ['\u{1208A}', '\u{1208D}'],
  'i':  ['\u{1213F}', '\u{1214A}'],
  'u':  ['\u{12303}', '\u{12304}'],
  'aḫ': ['\u{12014}', '\u{12015}'],
  'an': ['\u{1202D}', '\u{1202E}'],
  'ka': ['\u{12157}', '\u{12158}'],
  'ki': ['\u{121A0}', '\u{121A1}'],
};

/**
 * Look up a syllable in the syllabary.
 * Returns the Unicode character or null if not found.
 * @param {string} syllable - The syllabic value (e.g., 'ba', 'kur')
 * @param {boolean} useAlternate - Whether to try alternate signs
 * @returns {string|null}
 */
export function lookupSign(syllable, useAlternate = false) {
  if (useAlternate && ALTERNATE_SIGNS[syllable]) {
    const alts = ALTERNATE_SIGNS[syllable];
    return alts[Math.floor(Math.random() * alts.length)];
  }
  return SYLLABARY[syllable] || null;
}

/**
 * Check if a syllable exists in the syllabary.
 * @param {string} syllable
 * @returns {boolean}
 */
export function hasSign(syllable) {
  return syllable in SYLLABARY;
}
