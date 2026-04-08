import type { LanguageId } from '../../languages/config'
import type { LessonItem, LessonUnit } from '../lessons'
import extraVocabRaw from './extraVocab.txt?raw'
import { buildMirroredUnits, dictFromLessonCores, type NonHindi } from './internationalMirror'

function row(script: string, transliteration: string, english: string, imageUrl?: string): LessonItem {
  return imageUrl
    ? { hindi: script, transliteration, english, imageUrl }
    : { hindi: script, transliteration, english }
}

function parseExtraVocab(raw: string): Record<NonHindi, Record<string, { script: string; rom: string }>> {
  const buckets: Partial<Record<NonHindi, Record<string, { script: string; rom: string }>>> = {}
  let lang: NonHindi | '' = ''
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t) continue
    if (t.startsWith('SECTION ')) {
      lang = t.slice(8).trim() as NonHindi
      buckets[lang] = {}
      continue
    }
    const first = t.indexOf('|')
    const second = t.indexOf('|', first + 1)
    if (first === -1 || second === -1 || !lang) continue
    const en = t.slice(0, first)
    const script = t.slice(first + 1, second)
    const rom = t.slice(second + 1)
    buckets[lang]![en] = { script, rom }
  }
  return buckets as Record<NonHindi, Record<string, { script: string; rom: string }>>
}

const extraByLang = parseExtraVocab(extraVocabRaw)

function mergeLessonDict(
  extra: Record<string, { script: string; rom: string }>,
  cores: LessonItem[][],
): Record<string, { script: string; rom: string }> {
  return { ...extra, ...dictFromLessonCores(cores) }
}

/* ——— Chinese ——— */
const grammarZh: LessonItem[] = [
  row('这是', 'zhè shì', 'This is'),
  row('那是', 'nà shì', 'That is'),
  row('我是', 'wǒ shì', 'I am'),
  row('你是', 'nǐ shì', 'You are'),
  row('我的名字是___', 'wǒ de míngzi shì ___', 'My name is ___'),
  row('这是我的', 'zhè shì wǒ de', 'This is mine'),
]

const coreZh: LessonItem[][] = [
  [
    row('你好', 'nǐ hǎo', 'Hello'),
    row('你好吗？', 'nǐ hǎo ma?', 'How are you?'),
    row('我很好', 'wǒ hěn hǎo', "I'm fine"),
    row('谢谢', 'xièxie', 'Thank you'),
    row('请', 'qǐng', 'Please'),
    row('再见', 'zàijiàn', 'Goodbye'),
  ],
  [
    row('一', 'yī', 'One'),
    row('二', 'èr', 'Two'),
    row('三', 'sān', 'Three'),
    row('四', 'sì', 'Four'),
    row('五', 'wǔ', 'Five'),
    row('六', 'liù', 'Six'),
    row('七', 'qī', 'Seven'),
    row('八', 'bā', 'Eight'),
    row('九', 'jiǔ', 'Nine'),
    row('十', 'shí', 'Ten'),
    row('这是一', 'zhè shì yī', 'This is one'),
    row('这是二', 'zhè shì èr', 'This is two'),
  ],
  [
    row('我要这个', 'wǒ yào zhège', 'I want this'),
    row('这是什么？', 'zhè shì shénme?', 'What is this?'),
    row('我不懂', 'wǒ bù dǒng', "I didn't understand"),
    row('在哪里？', 'zài nǎlǐ?', 'Where is it?'),
    row('多少钱？', 'duōshao qián?', 'How much is it?'),
    row('对不起', 'duìbuqǐ', 'Excuse me / Sorry'),
  ],
  [
    row('水', 'shuǐ', 'Water'),
    row('茶', 'chá', 'Tea'),
    row('牛奶', 'niúnǎi', 'Milk'),
    row('面包', 'miànbāo', 'Bread'),
    row('米饭', 'mǐfàn', 'Rice'),
    row('水果', 'shuǐguǒ', 'Fruit'),
    row('我要水', 'wǒ yào shuǐ', 'I want water'),
  ],
  [
    row('红', 'hóng', 'Red', '/images/colors/red.svg'),
    row('蓝', 'lán', 'Blue', '/images/colors/blue.svg'),
    row('绿', 'lǜ', 'Green', '/images/colors/green.svg'),
    row('黄', 'huáng', 'Yellow', '/images/colors/yellow.svg'),
    row('橙', 'chéng', 'Orange', '/images/colors/orange.svg'),
    row('紫', 'zǐ', 'Purple', '/images/colors/purple.svg'),
    row('粉', 'fěn', 'Pink', '/images/colors/red.svg'),
    row('棕', 'zōng', 'Brown', '/images/colors/orange.svg'),
    row('黑', 'hēi', 'Black', '/images/colors/black.svg'),
    row('白', 'bái', 'White', '/images/colors/white.svg'),
    row('这是红色', 'zhè shì hóngsè', 'This is red'),
  ],
  [
    row('妈妈', 'māma', 'Mother'),
    row('爸爸', 'bàba', 'Father'),
    row('哥哥', 'gēge', 'Brother'),
    row('姐姐', 'jiějie', 'Sister'),
    row('家庭', 'jiātíng', 'Family'),
    row('朋友', 'péngyou', 'Friend'),
    row('这是我妈妈', 'zhè shì wǒ māma', 'This is my mother'),
  ],
  [
    row('学校', 'xuéxiào', 'School'),
    row('书', 'shū', 'Book'),
    row('笔', 'bǐ', 'Pen'),
    row('教室', 'jiàoshì', 'Classroom'),
    row('老师', 'lǎoshī', 'Teacher'),
    row('学生', 'xuéshēng', 'Student'),
    row('这是我的书', 'zhè shì wǒ de shū', 'This is my book'),
  ],
  [
    row('今天', 'jīntiān', 'Today'),
    row('明天', 'míngtiān', 'Tomorrow'),
    row('后天', 'hòutiān', 'The day after tomorrow'),
    row('星期', 'xīngqī', 'Week'),
    row('月', 'yuè', 'Month'),
    row('年', 'nián', 'Year'),
    row('今天是星期一', 'jīntiān shì xīngqī yī', 'Today is Monday'),
  ],
  [
    row('这里', 'zhèlǐ', 'Here'),
    row('那里', 'nàlǐ', 'There'),
    row('家', 'jiā', 'Home'),
    row('市场', 'shìchǎng', 'Market'),
    row('车站', 'chēzhàn', 'Station'),
    row('酒店', 'jiǔdiàn', 'Hotel'),
    row('市场在哪里？', 'shìchǎng zài nǎlǐ?', 'Where is the market?'),
  ],
  [
    row('时间', 'shíjiān', 'Time'),
    row('现在', 'xiànzài', 'Now'),
    row('以后', 'yǐhòu', 'Later'),
    row('早上', 'zǎoshang', 'Morning'),
    row('下午', 'xiàwǔ', 'Afternoon'),
    row('晚上', 'wǎnshang', 'Night'),
    row('现在几点？', 'xiànzài jǐ diǎn?', 'What time is it now?'),
  ],
]

/* ——— Arabic ——— */
const grammarAr: LessonItem[] = [
  row('هذا', 'hadha', 'This is'),
  row('ذلك', 'dhalik', 'That is'),
  row('أنا', 'ana', 'I am'),
  row('أنت', 'anta', 'You are'),
  row('اسمي ___', 'ismee ___', 'My name is ___'),
  row('هذا لي', 'hadha lee', 'This is mine'),
]

const coreAr: LessonItem[][] = [
  [
    row('مرحبا', 'marhaba', 'Hello'),
    row('كيف حالك؟', 'kayfa haluk?', 'How are you?'),
    row('أنا بخير', 'ana bikhair', "I'm fine"),
    row('شكرا', 'shukran', 'Thank you'),
    row('من فضلك', 'min fadlik', 'Please'),
    row('مع السلامة', 'ma3 salama', 'Goodbye'),
  ],
  [
    row('واحد', 'wahid', 'One'),
    row('اثنان', 'ithnan', 'Two'),
    row('ثلاثة', 'thalatha', 'Three'),
    row('أربعة', 'arba3a', 'Four'),
    row('خمسة', 'khamsa', 'Five'),
    row('ستة', 'sitta', 'Six'),
    row('سبعة', 'sab3a', 'Seven'),
    row('ثمانية', 'thamaniya', 'Eight'),
    row('تسعة', 'tis3a', 'Nine'),
    row('عشرة', '3ashara', 'Ten'),
    row('هذا واحد', 'hadha wahid', 'This is one'),
    row('هذا اثنان', 'hadha ithnan', 'This is two'),
  ],
  [
    row('أريد هذا', 'ureed hadha', 'I want this'),
    row('ما هذا؟', 'ma hadha?', 'What is this?'),
    row('لم أفهم', 'lam afham', "I didn't understand"),
    row('أين هو؟', 'ayn huwa?', 'Where is it?'),
    row('كم الثمن؟', 'kam aththaman?', 'How much is it?'),
    row('آسف', 'asif', 'Excuse me / Sorry'),
  ],
  [
    row('ماء', 'ma', 'Water'),
    row('شاي', 'shay', 'Tea'),
    row('حليب', 'haleeb', 'Milk'),
    row('خبز', 'khubz', 'Bread'),
    row('أرز', 'aruzz', 'Rice'),
    row('فاكهة', 'fakaha', 'Fruit'),
    row('أريد ماء', 'ureed ma', 'I want water'),
  ],
  [
    row('أحمر', 'ahmar', 'Red', '/images/colors/red.svg'),
    row('أزرق', 'azraq', 'Blue', '/images/colors/blue.svg'),
    row('أخضر', 'akhdar', 'Green', '/images/colors/green.svg'),
    row('أصفر', 'asfar', 'Yellow', '/images/colors/yellow.svg'),
    row('برتقالي', 'burtuqali', 'Orange', '/images/colors/orange.svg'),
    row('بنفسجي', 'banafsaji', 'Purple', '/images/colors/purple.svg'),
    row('وردي', 'wardi', 'Pink', '/images/colors/red.svg'),
    row('بني', 'bunni', 'Brown', '/images/colors/orange.svg'),
    row('أسود', 'aswad', 'Black', '/images/colors/black.svg'),
    row('أبيض', 'abyd', 'White', '/images/colors/white.svg'),
    row('هذا أحمر', 'hadha ahmar', 'This is red'),
  ],
  [
    row('أم', 'umm', 'Mother'),
    row('أب', 'ab', 'Father'),
    row('أخ', 'akh', 'Brother'),
    row('أخت', 'ukht', 'Sister'),
    row('عائلة', '3aila', 'Family'),
    row('صديق', 'sadeeq', 'Friend'),
    row('هذه أمي', 'hadhihi umee', 'This is my mother'),
  ],
  [
    row('مدرسة', 'madrasa', 'School'),
    row('كتاب', 'kitab', 'Book'),
    row('قلم', 'qalam', 'Pen'),
    row('صف', 'saff', 'Classroom'),
    row('معلم', 'mu3allim', 'Teacher'),
    row('طالب', 'talib', 'Student'),
    row('هذا كتابي', 'hadha kitabee', 'This is my book'),
  ],
  [
    row('اليوم', 'alyawm', 'Today'),
    row('غدا', 'ghadan', 'Tomorrow'),
    row('بعد غد', 'ba3d ghad', 'The day after tomorrow'),
    row('أسبوع', 'usbu3', 'Week'),
    row('شهر', 'shahr', 'Month'),
    row('سنة', 'sana', 'Year'),
    row('اليوم الاثنين', 'alyawm al-ithnayn', 'Today is Monday'),
  ],
  [
    row('هنا', 'huna', 'Here'),
    row('هناك', 'hunaka', 'There'),
    row('منزل', 'manzil', 'Home'),
    row('سوق', 'suq', 'Market'),
    row('محطة', 'mahatta', 'Station'),
    row('فندق', 'funduq', 'Hotel'),
    row('أين السوق؟', 'ayn as-suq?', 'Where is the market?'),
  ],
  [
    row('وقت', 'waqt', 'Time'),
    row('الآن', 'al-aan', 'Now'),
    row('لاحقا', 'lahiqan', 'Later'),
    row('صباح', 'sabah', 'Morning'),
    row('بعد الظهر', 'ba3d adh-duhr', 'Afternoon'),
    row('ليل', 'layl', 'Night'),
    row('كم الساعة؟', 'kam as-saa3a?', 'What time is it now?'),
  ],
]

/* ——— Hebrew ——— */
const grammarHe: LessonItem[] = [
  row('זה', 'ze', 'This is'),
  row('זאת', 'zot', 'That is'),
  row('אני', 'ani', 'I am'),
  row('אתה', 'ata', 'You are'),
  row('השם שלי ___', 'hashem sheli ___', 'My name is ___'),
  row('זה שלי', 'ze sheli', 'This is mine'),
]

const coreHe: LessonItem[][] = [
  [
    row('שלום', 'shalom', 'Hello'),
    row('מה שלומך؟', 'ma shlomcha?', 'How are you?'),
    row('אני בסדר', 'ani beseder', "I'm fine"),
    row('תודה', 'toda', 'Thank you'),
    row('בבקשה', 'bevakasha', 'Please'),
    row('להתראות', 'lehitraot', 'Goodbye'),
  ],
  [
    row('אחת', 'achat', 'One'),
    row('שתיים', 'shtayim', 'Two'),
    row('שלוש', 'shalosh', 'Three'),
    row('ארבע', 'arba', 'Four'),
    row('חמש', 'chamesh', 'Five'),
    row('שש', 'shesh', 'Six'),
    row('שבע', 'sheva', 'Seven'),
    row('שמונה', 'shmone', 'Eight'),
    row('תשע', 'tesha', 'Nine'),
    row('עשר', 'eser', 'Ten'),
    row('זה אחת', 'ze achat', 'This is one'),
    row('זה שתיים', 'ze shtayim', 'This is two'),
  ],
  [
    row('אני רוצה את זה', 'ani rotze et ze', 'I want this'),
    row('מה זה?', 'ma ze?', 'What is this?'),
    row('לא הבנתי', 'lo hevanti', "I didn't understand"),
    row('איפה זה?', 'eifo ze?', 'Where is it?'),
    row('כמה זה עולה?', 'kama ze ole?', 'How much is it?'),
    row('סליחה', 'slicha', 'Excuse me / Sorry'),
  ],
  [
    row('מים', 'mayim', 'Water'),
    row('תה', 'te', 'Tea'),
    row('חלב', 'chalav', 'Milk'),
    row('לחם', 'lechem', 'Bread'),
    row('אורז', 'orez', 'Rice'),
    row('פרי', 'pri', 'Fruit'),
    row('אני רוצה מים', 'ani rotze mayim', 'I want water'),
  ],
  [
    row('אדום', 'adom', 'Red', '/images/colors/red.svg'),
    row('כחול', 'kachol', 'Blue', '/images/colors/blue.svg'),
    row('ירוק', 'yarok', 'Green', '/images/colors/green.svg'),
    row('צהוב', 'tsahov', 'Yellow', '/images/colors/yellow.svg'),
    row('כתום', 'katom', 'Orange', '/images/colors/orange.svg'),
    row('סגול', 'sagol', 'Purple', '/images/colors/purple.svg'),
    row('ורוד', 'varod', 'Pink', '/images/colors/red.svg'),
    row('חום', 'chum', 'Brown', '/images/colors/orange.svg'),
    row('שחור', 'shachor', 'Black', '/images/colors/black.svg'),
    row('לבן', 'lavan', 'White', '/images/colors/white.svg'),
    row('זה אדום', 'ze adom', 'This is red'),
  ],
  [
    row('אמא', 'ima', 'Mother'),
    row('אבא', 'aba', 'Father'),
    row('אח', 'ach', 'Brother'),
    row('אחות', 'achot', 'Sister'),
    row('משפחה', 'mishpacha', 'Family'),
    row('חבר', 'chaver', 'Friend'),
    row('זאת אמא שלי', 'zot ima sheli', 'This is my mother'),
  ],
  [
    row('בית ספר', 'beit sefer', 'School'),
    row('ספר', 'sefer', 'Book'),
    row('עט', 'et', 'Pen'),
    row('כיתה', 'kita', 'Classroom'),
    row('מורה', 'more', 'Teacher'),
    row('תלמיד', 'talmid', 'Student'),
    row('זה הספר שלי', 'ze ha-sefer sheli', 'This is my book'),
  ],
  [
    row('היום', 'hayom', 'Today'),
    row('מחר', 'machar', 'Tomorrow'),
    row('מחרתיים', 'macharataim', 'The day after tomorrow'),
    row('שבוע', 'shavua', 'Week'),
    row('חודש', 'chodesh', 'Month'),
    row('שנה', 'shana', 'Year'),
    row('היום יום שני', 'hayom yom sheni', 'Today is Monday'),
  ],
  [
    row('כאן', 'kan', 'Here'),
    row('שם', 'sham', 'There'),
    row('בית', 'bayit', 'Home'),
    row('שוק', 'shuk', 'Market'),
    row('תחנת רכבת', 'tachanat rakevet', 'Station'),
    row('מלון', 'malon', 'Hotel'),
    row('איפה השוק?', 'eifo ha-shuk?', 'Where is the market?'),
  ],
  [
    row('זמן', 'zman', 'Time'),
    row('עכשיו', 'achshav', 'Now'),
    row('אחר כך', 'achar kach', 'Later'),
    row('בוקר', 'boker', 'Morning'),
    row('אחר הצהריים', 'achar ha-tzohorayim', 'Afternoon'),
    row('לילה', 'layla', 'Night'),
    row('מה השעה?', 'ma ha-sha-a?', 'What time is it now?'),
  ],
]

/* ——— Japanese ——— */
const grammarJa: LessonItem[] = [
  row('これは', 'kore wa', 'This is'),
  row('それは', 'sore wa', 'That is'),
  row('私は', 'watashi wa', 'I am'),
  row('あなたは', 'anata wa', 'You are'),
  row('私の名前は___', 'watashi no namae wa ___', 'My name is ___'),
  row('これは私のです', 'kore wa watashi no desu', 'This is mine'),
]

const coreJa: LessonItem[][] = [
  [
    row('こんにちは', 'konnichiwa', 'Hello'),
    row('お元気ですか？', 'o-genki desu ka?', 'How are you?'),
    row('元気です', 'genki desu', "I'm fine"),
    row('ありがとう', 'arigatou', 'Thank you'),
    row('お願いします', 'onegaishimasu', 'Please'),
    row('さようなら', 'sayounara', 'Goodbye'),
  ],
  [
    row('一', 'ichi', 'One'),
    row('二', 'ni', 'Two'),
    row('三', 'san', 'Three'),
    row('四', 'yon', 'Four'),
    row('五', 'go', 'Five'),
    row('六', 'roku', 'Six'),
    row('七', 'nana', 'Seven'),
    row('八', 'hachi', 'Eight'),
    row('九', 'kyuu', 'Nine'),
    row('十', 'juu', 'Ten'),
    row('これは一です', 'kore wa ichi desu', 'This is one'),
    row('これは二です', 'kore wa ni desu', 'This is two'),
  ],
  [
    row('これが欲しいです', 'kore ga hoshii desu', 'I want this'),
    row('これは何ですか？', 'kore wa nan desu ka?', 'What is this?'),
    row('わかりませんでした', 'wakarimasen deshita', "I didn't understand"),
    row('どこですか？', 'doko desu ka?', 'Where is it?'),
    row('いくらですか？', 'ikura desu ka?', 'How much is it?'),
    row('すみません', 'sumimasen', 'Excuse me / Sorry'),
  ],
  [
    row('水', 'mizu', 'Water'),
    row('お茶', 'ocha', 'Tea'),
    row('牛乳', 'gyuunyuu', 'Milk'),
    row('パン', 'pan', 'Bread'),
    row('ご飯', 'gohan', 'Rice'),
    row('果物', 'kudamono', 'Fruit'),
    row('水が欲しいです', 'mizu ga hoshii desu', 'I want water'),
  ],
  [
    row('赤', 'aka', 'Red', '/images/colors/red.svg'),
    row('青', 'ao', 'Blue', '/images/colors/blue.svg'),
    row('緑', 'midori', 'Green', '/images/colors/green.svg'),
    row('黄', 'ki', 'Yellow', '/images/colors/yellow.svg'),
    row('橙', 'daidai', 'Orange', '/images/colors/orange.svg'),
    row('紫', 'murasaki', 'Purple', '/images/colors/purple.svg'),
    row('桃', 'momo', 'Pink', '/images/colors/red.svg'),
    row('茶', 'cha', 'Brown', '/images/colors/orange.svg'),
    row('黒', 'kuro', 'Black', '/images/colors/black.svg'),
    row('白', 'shiro', 'White', '/images/colors/white.svg'),
    row('これは赤です', 'kore wa aka desu', 'This is red'),
  ],
  [
    row('母', 'haha', 'Mother'),
    row('父', 'chichi', 'Father'),
    row('兄', 'ani', 'Brother'),
    row('姉', 'ane', 'Sister'),
    row('家族', 'kazoku', 'Family'),
    row('友達', 'tomodachi', 'Friend'),
    row('これは母です', 'kore wa haha desu', 'This is my mother'),
  ],
  [
    row('学校', 'gakkou', 'School'),
    row('本', 'hon', 'Book'),
    row('ペン', 'pen', 'Pen'),
    row('教室', 'kyoushitsu', 'Classroom'),
    row('先生', 'sensei', 'Teacher'),
    row('学生', 'gakusei', 'Student'),
    row('これは私の本です', 'kore wa watashi no hon desu', 'This is my book'),
  ],
  [
    row('今日', 'kyou', 'Today'),
    row('明日', 'ashita', 'Tomorrow'),
    row('明後日', 'asatte', 'The day after tomorrow'),
    row('週', 'shuu', 'Week'),
    row('月', 'tsuki', 'Month'),
    row('年', 'toshi', 'Year'),
    row('今日は月曜日です', 'kyou wa getsuyoubi desu', 'Today is Monday'),
  ],
  [
    row('ここ', 'koko', 'Here'),
    row('そこ', 'soko', 'There'),
    row('家', 'ie', 'Home'),
    row('市場', 'ichiba', 'Market'),
    row('駅', 'eki', 'Station'),
    row('ホテル', 'hoteru', 'Hotel'),
    row('市場はどこですか？', 'ichiba wa doko desu ka?', 'Where is the market?'),
  ],
  [
    row('時間', 'jikan', 'Time'),
    row('今', 'ima', 'Now'),
    row('後で', 'ato de', 'Later'),
    row('朝', 'asa', 'Morning'),
    row('午後', 'gogo', 'Afternoon'),
    row('夜', 'yoru', 'Night'),
    row('今何時ですか？', 'ima nan-ji desu ka?', 'What time is it now?'),
  ],
]

/* ——— Korean ——— */
const grammarKo: LessonItem[] = [
  row('이것은', 'igeoseun', 'This is'),
  row('그것은', 'geugeoseun', 'That is'),
  row('나는', 'naneun', 'I am'),
  row('당신은', 'dangshineun', 'You are'),
  row('제 이름은 ___', 'je ireumeun ___', 'My name is ___'),
  row('이것은 제 것입니다', 'igeoseun je geosimnida', 'This is mine'),
]

const coreKo: LessonItem[][] = [
  [
    row('안녕하세요', 'annyeonghaseyo', 'Hello'),
    row('어떻게 지내세요?', 'eotteoke jinaeseyo?', 'How are you?'),
    row('잘 지내요', 'jal jinaeyo', "I'm fine"),
    row('감사합니다', 'gamsahamnida', 'Thank you'),
    row('제발', 'jebal', 'Please'),
    row('안녕히 가세요', 'annyeonghi gaseyo', 'Goodbye'),
  ],
  [
    row('하나', 'hana', 'One'),
    row('둘', 'dul', 'Two'),
    row('셋', 'set', 'Three'),
    row('넷', 'net', 'Four'),
    row('다섯', 'daseot', 'Five'),
    row('여섯', 'yeoseot', 'Six'),
    row('일곱', 'ilgop', 'Seven'),
    row('여덟', 'yeodeol', 'Eight'),
    row('아홉', 'ahop', 'Nine'),
    row('열', 'yeol', 'Ten'),
    row('이것은 하나입니다', 'igeoseun hanaimnida', 'This is one'),
    row('이것은 둘입니다', 'igeoseun durimnida', 'This is two'),
  ],
  [
    row('이것을 원해요', 'igeoseul wonhaeyo', 'I want this'),
    row('이것이 무엇이에요?', 'igeosi mueosieyo?', 'What is this?'),
    row('이해 못 했어요', 'ihae mot haesseoyo', "I didn't understand"),
    row('어디에 있어요?', 'eodie isseoyo?', 'Where is it?'),
    row('얼마예요?', 'eolmayeyo?', 'How much is it?'),
    row('죄송합니다', 'joesonghamnida', 'Excuse me / Sorry'),
  ],
  [
    row('물', 'mul', 'Water'),
    row('차', 'cha', 'Tea'),
    row('우유', 'uyu', 'Milk'),
    row('빵', 'ppang', 'Bread'),
    row('밥', 'bap', 'Rice'),
    row('과일', 'gwail', 'Fruit'),
    row('물을 원해요', 'mureul wonhaeyo', 'I want water'),
  ],
  [
    row('빨강', 'ppalgang', 'Red', '/images/colors/red.svg'),
    row('파랑', 'parang', 'Blue', '/images/colors/blue.svg'),
    row('초록', 'chorok', 'Green', '/images/colors/green.svg'),
    row('노랑', 'norang', 'Yellow', '/images/colors/yellow.svg'),
    row('주황', 'juhwang', 'Orange', '/images/colors/orange.svg'),
    row('보라', 'bora', 'Purple', '/images/colors/purple.svg'),
    row('분홍', 'bunhong', 'Pink', '/images/colors/red.svg'),
    row('갈색', 'galsaek', 'Brown', '/images/colors/orange.svg'),
    row('검정', 'geomjeong', 'Black', '/images/colors/black.svg'),
    row('하양', 'hayang', 'White', '/images/colors/white.svg'),
    row('이것은 빨강입니다', 'igeoseun ppalgangimnida', 'This is red'),
  ],
  [
    row('엄마', 'eomma', 'Mother'),
    row('아빠', 'appa', 'Father'),
    row('형/오빠', 'hyeong', 'Brother'),
    row('누나/언니', 'eonni', 'Sister'),
    row('가족', 'gajok', 'Family'),
    row('친구', 'chingu', 'Friend'),
    row('이분은 제 엄마입니다', 'ibun-eun je eommaimnida', 'This is my mother'),
  ],
  [
    row('학교', 'hakgyo', 'School'),
    row('책', 'chaek', 'Book'),
    row('펜', 'pen', 'Pen'),
    row('교실', 'gyosil', 'Classroom'),
    row('선생님', 'seonsaengnim', 'Teacher'),
    row('학생', 'haksaeng', 'Student'),
    row('이것은 제 책입니다', 'igeoseun je chaegimnida', 'This is my book'),
  ],
  [
    row('오늘', 'oneul', 'Today'),
    row('내일', 'naeil', 'Tomorrow'),
    row('모레', 'more', 'The day after tomorrow'),
    row('주', 'ju', 'Week'),
    row('월', 'wol', 'Month'),
    row('년', 'nyeon', 'Year'),
    row('오늘은 월요일입니다', 'oneureun woryoilimnida', 'Today is Monday'),
  ],
  [
    row('여기', 'yeogi', 'Here'),
    row('거기', 'geogi', 'There'),
    row('집', 'jip', 'Home'),
    row('시장', 'sijang', 'Market'),
    row('역', 'yeok', 'Station'),
    row('호텔', 'hotel', 'Hotel'),
    row('시장이 어디예요?', 'sijangi eodiyeyo?', 'Where is the market?'),
  ],
  [
    row('시간', 'sigan', 'Time'),
    row('지금', 'jigeum', 'Now'),
    row('나중에', 'najunge', 'Later'),
    row('아침', 'achim', 'Morning'),
    row('오후', 'ohu', 'Afternoon'),
    row('밤', 'bam', 'Night'),
    row('지금 몇 시예요?', 'jigeum myeot siyeyo?', 'What time is it now?'),
  ],
]

export const internationalLessonUnits: Record<Exclude<LanguageId, 'hi'>, LessonUnit[]> = {
  zh: buildMirroredUnits(grammarZh, mergeLessonDict(extraByLang.zh, coreZh)),
  ar: buildMirroredUnits(grammarAr, mergeLessonDict(extraByLang.ar, coreAr)),
  he: buildMirroredUnits(grammarHe, mergeLessonDict(extraByLang.he, coreHe)),
  ja: buildMirroredUnits(grammarJa, mergeLessonDict(extraByLang.ja, coreJa)),
  ko: buildMirroredUnits(grammarKo, mergeLessonDict(extraByLang.ko, coreKo)),
}
