/* 农历与节日：公历日期 → 农历（含干支、生肖、闰月），以及常用节日。
   数据是 1900–2100 的「年表」：每年一个十六进制数，
   - bit0–3：闰月月份，0 表示这一年没有闰月；
   - bit15–bit4 依次是正月到十二月的月长（1 = 30 天，0 = 29 天）；
   - bit16：闰月的月长（1 = 30 天，0 = 29 天）。
   年份对应表值与道听途说的记忆核对过：2023 闰二月、2025 闰六月（且为小月）、2028 闰五月、2026 无闰月。
   节日分三类：公历定日、农历定日、按第几个星期几（母亲节一类），另加清明（节气，按寿星公式推）。 */

const INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520, // 2100
];

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

const MONTH_NAMES = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
const DAY_NAMES = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

const leapMonth = y => INFO[y - MIN_YEAR] & 0xf;
const leapDays = y => (leapMonth(y) ? ((INFO[y - MIN_YEAR] & 0x10000) ? 30 : 29) : 0);
const monthDays = (y, m) => ((INFO[y - MIN_YEAR] & (0x10000 >> m)) ? 30 : 29);
const yearDays = y => {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) sum += (INFO[y - MIN_YEAR] & i) ? 1 : 0;
  return sum + leapDays(y);
};

/* ---------- 节日表 ---------- */
// 公历定日
const SOLAR_FEST = {
  '1-1': '元旦', '2-14': '情人节', '3-8': '妇女节', '3-12': '植树节', '4-1': '愚人节',
  '5-1': '劳动节', '5-4': '青年节', '6-1': '儿童节', '7-1': '建党节', '8-1': '建军节',
  '9-10': '教师节', '10-1': '国庆节', '12-24': '平安夜', '12-25': '圣诞节',
};
// 农历定日（闰月不算，闰月的初一只当普通初一）
const LUNAR_FEST = {
  '1-1': '春节', '1-15': '元宵节', '2-2': '龙抬头', '5-5': '端午节', '7-7': '七夕',
  '7-15': '中元节', '8-15': '中秋节', '9-9': '重阳节', '12-8': '腊八节', '12-23': '小年',
};
// 第 n 个星期几：[月, 第几个, 星期几(0 日), 名称]
const WEEK_FEST = [
  [5, 2, 0, '母亲节'],
  [6, 3, 0, '父亲节'],
  [11, 4, 4, '感恩节'],
];

/* 清明：寿星通式 D = floor(Y×0.2422 + C) − floor(Y/4)，Y 是年份后两位，
   20 世纪 C = 5.59、21 世纪 C = 4.81。核过 2023（4 月 5 日）、2024（4 月 4 日）、
   2025（4 月 4 日）、2026（4 月 5 日）、2027（4 月 5 日）。 */
function qingmingDay(y) {
  const Y = y % 100;
  const C = y >= 2000 ? 4.81 : 5.59;
  return Math.floor(Y * 0.2422 + C) - Math.floor(Y / 4);
}

/** 公历 y 年 m 月 d 日 → 农历 */
export function solar2lunar(y, m, d) {
  if (y < MIN_YEAR || y > MAX_YEAR) return null;
  let offset = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000);
  if (offset < 0) return null;

  let i, temp = 0;
  for (i = MIN_YEAR; i <= MAX_YEAR && offset > 0; i++) {
    temp = yearDays(i);
    offset -= temp;
  }
  if (offset < 0) { offset += temp; i--; }
  const year = i;
  const leap = leapMonth(year);
  let isLeap = false;

  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === leap + 1 && !isLeap) {
      --i;
      isLeap = true;
      temp = leapDays(year);
    } else {
      temp = monthDays(year, i);
    }
    if (isLeap && i === leap + 1) isLeap = false;
    offset -= temp;
  }
  // 正好落在闰月与下一月的交界：offset 归零时月份还没定下来
  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) isLeap = false;
    else { isLeap = true; --i; }
  }
  if (offset < 0) { offset += temp; --i; }

  return { year, month: i, day: offset + 1, isLeap };
}

/** 这一天要显示的节日（可能有多个），顺序：农历 > 公历 > 按星期 */
function festivalsOf(y, m, d, lu) {
  const out = [];
  if (lu && !lu.isLeap) {
    const k = `${lu.month}-${lu.day}`;
    if (LUNAR_FEST[k]) out.push(LUNAR_FEST[k]);
    // 除夕：第二天就是正月初一
    const nx = solar2lunar(y, m, d + 1);
    if (nx && nx.month === 1 && nx.day === 1) out.push('除夕');
  }
  if (SOLAR_FEST[`${m}-${d}`]) out.push(SOLAR_FEST[`${m}-${d}`]);
  const wd = new Date(y, m - 1, d).getDay();
  for (const [fm, fnth, fwd, name] of WEEK_FEST) {
    if (fm === m && fwd === wd && Math.ceil(d / 7) === fnth) out.push(name);
  }
  if (m === 4 && d === qingmingDay(y)) out.push('清明节');
  return out;
}

const memo = new Map();

/** Date 或 {y,m,d} → 展示用的农历信息；超出 1900–2100 返回 null */
export function lunarOfDate(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const key = `${y}-${m}-${d}`;
  const hit = memo.get(key);
  if (hit) return hit;

  const lu = solar2lunar(y, m, d);
  if (!lu) return null;
  const gz = GAN[(lu.year - 4) % 10] + ZHI[(lu.year - 4) % 12];
  const info = {
    year: lu.year,
    month: lu.month,
    day: lu.day,
    isLeap: lu.isLeap,
    leap: leapMonth(lu.year),
    monthName: (lu.isLeap ? '闰' : '') + MONTH_NAMES[lu.month - 1],
    dayName: DAY_NAMES[lu.day - 1],
    gz,
    zodiac: ZODIAC[(lu.year - 4) % 12],
    festivals: festivalsOf(y, m, d, lu),
  };
  info.festival = info.festivals[0] || '';
  info.text = info.festival || (lu.day === 1 ? info.monthName : info.dayName);
  info.full = `农历${info.monthName}${info.dayName}`;
  if (memo.size > 3000) memo.clear();
  memo.set(key, info);
  return info;
}
