<template>
  <div class="cal">
    <div class="chapter-head">
      <h1>日历 · 待办</h1>
      <p class="sub">按月看日程，格子里带农历与节日，点某一天在右侧记下要做的事。待办只存在这台浏览器里，可以备份成 JSON、换机器再导入。</p>
    </div>

    <div class="cal-bar">
      <div class="cal-nav">
        <button class="nav-btn" type="button" title="上个月" @click="shift(-1)">‹</button>
        <span class="cal-title">
          <b class="mn">{{ vm + 1 }}</b>
          <span class="mt"><em>{{ vy }}</em><i>月</i></span>
        </span>
        <button class="nav-btn" type="button" title="下个月" @click="shift(1)">›</button>
        <button class="btn today-btn" type="button" @click="goToday">回到今天</button>
      </div>
      <div class="cal-tools">
        <span class="stat"><b>{{ monthLeft }}</b> 本月未完成</span>
        <span class="stat"><b>{{ allLeft }}</b> 全部未完成</span>
        <span class="sep" />
        <button class="btn" type="button" title="把全部待办导出成 JSON" @click="doExport">⇪ 备份</button>
        <button class="btn" type="button" title="从备份文件导入，同 id 以文件为准" @click="pickImport">⇩ 导入</button>
        <input ref="fileEl" class="hide-file" type="file" accept="application/json,.json" @change="doImport" />
      </div>
    </div>

    <div class="cal-main">
      <section class="cal-grid-wrap">
        <div class="cal-week">
          <span v-for="(w, i) in WEEKS" :key="w" :class="{ we: i >= 5 }">{{ w }}</span>
        </div>
        <div class="cal-grid">
          <button v-for="c in cells" :key="c.key" class="cal-cell" type="button"
            :class="{ out: !c.cur, today: c.isToday, sel: c.key === sel, we: c.we, has: c.total > 0 }"
            :title="c.tip" @click="sel = c.key">
            <span class="cd">{{ c.day }}</span>
            <span v-if="c.lunar" class="cl" :class="{ fest: c.fest, first: c.first }">{{ c.lunar }}</span>
            <span v-if="c.total" class="dots">
              <i v-for="n in Math.min(c.total, 3)" :key="n" class="dot" :class="{ done: n <= c.done }" />
              <b v-if="c.total > 3" class="more">+{{ c.total - 3 }}</b>
            </span>
          </button>
        </div>
        <p class="cal-legend">
          <i class="dot" /> 未完成　<i class="dot done" /> 已完成　·　橙字为节日　·　点格子切换右侧日程，双击任务文字可改
        </p>
      </section>

      <aside class="cal-side">
        <div class="side-head">
          <span class="sd-num">{{ selNum }}</span>
          <span class="sd-meta">
            <b>{{ selYm }}</b>
            <em>周{{ selWd }}</em>
          </span>
          <span v-if="sel === today" class="tag-today">今天</span>
        </div>
        <div class="side-lunar">
          <span class="sl-txt">{{ selLu ? selLu.full : '农历不可用' }}</span>
          <em v-if="selLu">{{ selLu.gz }}{{ selLu.zodiac }}年</em>
          <b v-for="f in selFests" :key="f" class="sl-fest">{{ f }}</b>
        </div>
        <div class="side-stat">
          <span v-if="leftCount"><b>{{ leftCount }}</b> 项未完成</span>
          <span v-else-if="doneCount" class="all-done">都做完了</span>
          <span v-else>还没有安排</span>
        </div>

        <form class="add-row" @submit.prevent="submit">
          <input v-model="draft" class="add-in" type="text" maxlength="200"
            placeholder="写一条待办，回车添加" />
          <button class="add-btn" type="submit" :disabled="!draft.trim()" title="添加">＋</button>
        </form>

        <TransitionGroup v-if="dayTodos.length" tag="ul" class="todo-list" name="todo">
          <li v-for="t in dayTodos" :key="t.id" class="todo" :class="{ done: t.done }">
            <label class="chk">
              <input type="checkbox" :checked="t.done" @change="toggleTodo(t.id)" />
              <i />
            </label>
            <input v-if="editing === t.id" v-model="editVal" class="edit-in" type="text" maxlength="200"
              @keydown.enter.prevent="commitEdit" @keydown.esc.prevent="cancelEdit" @blur="commitEdit" />
            <span v-else class="tx" title="双击修改" @dblclick="startEdit(t)">{{ t.text }}</span>
            <button class="del" type="button" title="删除这条" @click="removeTodo(t.id)">×</button>
          </li>
        </TransitionGroup>
        <p v-else class="empty">
          <span class="em-ic">🗓</span>
          这一天还没有安排，在上面写一条。
        </p>

        <div class="side-foot">
          <button class="clear-btn" type="button" :disabled="!doneCount" @click="clearDoneToday">清除已完成</button>
        </div>

        <div v-if="nextUp.length" class="next-up">
          <div class="nu-head">接下来</div>
          <button v-for="u in nextUp" :key="u.date" class="nu-row" type="button" @click="jumpTo(u.date)">
            <span>{{ shortDate(u.date) }}</span><b>{{ u.n }}</b>
          </button>
        </div>
      </aside>
    </div>

    <Transition name="toast">
      <div v-if="toastMsg" class="cal-toast" :class="toastKind">{{ toastMsg }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import {
  TODO_SAVE, byDate, countsFor, addTodo, toggleTodo, removeTodo, setTodoText,
  clearDone, dateKey, todayKey, undoneTotal, undoneInMonth, upcoming,
  exportTodos, importTodos, fromKey,
} from '../lib/todos.js';
import { lunarOfDate } from '../lib/lunar.js';

const WEEKS = ['一', '二', '三', '四', '五', '六', '日'];
const WD = ['日', '一', '二', '三', '四', '五', '六'];
const today = todayKey();

const now = new Date();
const vy = ref(now.getFullYear());
const vm = ref(now.getMonth());
const sel = ref(today);
const draft = ref('');
const editing = ref('');
const editVal = ref('');
const fileEl = ref(null);

/* ---------- 弹出提示：页面右下角一条，2.6 秒自隐 ---------- */
const toastMsg = ref('');
const toastKind = ref('ok');
let toastTimer = 0;
const toast = (text, kind = 'ok') => {
  toastMsg.value = text;
  toastKind.value = kind;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastMsg.value = ''; }, 2600);
};
onBeforeUnmount(() => clearTimeout(toastTimer));

/* ---------- 月份切换 ---------- */
const shift = d => {
  const t = vy.value * 12 + vm.value + d;
  vy.value = Math.floor(t / 12);
  vm.value = ((t % 12) + 12) % 12;
  // 选中的那天不在新月份里就落到 1 号，免得右侧还在改上个月的日程
  if (sel.value.slice(0, 7) !== mKey.value) sel.value = `${mKey.value}-01`;
};
const goToday = () => {
  const d = new Date();
  vy.value = d.getFullYear();
  vm.value = d.getMonth();
  sel.value = todayKey();
};

/* ---------- 日历格 ---------- */
const mKey = computed(() => `${vy.value}-${String(vm.value + 1).padStart(2, '0')}`);

const cells = computed(() => {
  const first = new Date(vy.value, vm.value, 1);
  const off = (first.getDay() + 6) % 7;             // 周一当第一列
  const out = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(vy.value, vm.value, 1 - off + i);
    const key = dateKey(d);
    const { total, done } = countsFor(key);
    // 农历与节日：格子里一行小字，有节日优先显示节日，否则初几；初一换成月份名，方便定位农历月
    const lu = lunarOfDate(d);
    out.push({
      key, day: d.getDate(), cur: d.getMonth() === vm.value,
      we: ((d.getDay() + 6) % 7) >= 5,
      isToday: key === today, total, done,
      lunar: lu ? lu.text : '',
      fest: !!(lu && lu.festival),
      first: !!(lu && !lu.festival && lu.day === 1),
      tip: [key, lu ? lu.full : '', lu ? lu.festivals.join(' ') : '',
        total ? `${total} 条待办` : ''].filter(Boolean).join(' · '),
    });
  }
  // 第六行整行都属于下个月就不铺了
  return out.slice(35).every(c => !c.cur) ? out.slice(0, 35) : out;
});

/* ---------- 侧栏 ---------- */
const dayTodos = computed(() => byDate(sel.value));
const leftCount = computed(() => dayTodos.value.reduce((n, t) => n + (t.done ? 0 : 1), 0));
const doneCount = computed(() => dayTodos.value.reduce((n, t) => n + (t.done ? 1 : 0), 0));
const monthLeft = computed(() => undoneInMonth(mKey.value));
const allLeft = computed(() => undoneTotal());
const selDate = computed(() => fromKey(sel.value));
const selLu = computed(() => lunarOfDate(selDate.value));
const selFests = computed(() => (selLu.value ? selLu.value.festivals : []));
const selNum = computed(() => String(selDate.value.getDate()).padStart(2, '0'));
const selYm = computed(() => `${selDate.value.getFullYear()} 年 ${selDate.value.getMonth() + 1} 月`);
const selWd = computed(() => WD[selDate.value.getDay()]);
const shortDate = k => {
  const d = fromKey(k);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日 · 周${WD[d.getDay()]}`;
};
const nextUp = computed(() => upcoming(today, 6).filter(u => u.date !== sel.value).slice(0, 4));
const jumpTo = k => {
  const d = fromKey(k);
  vy.value = d.getFullYear();
  vm.value = d.getMonth();
  sel.value = k;
};

/* ---------- 增删改 ---------- */
const submit = () => {
  const t = addTodo(sel.value, draft.value);
  if (t) draft.value = '';
  else if (draft.value.trim()) toast(TODO_SAVE.err || '没存上，先备份再清理', 'err');
};
const startEdit = t => { editing.value = t.id; editVal.value = t.text; };
const commitEdit = () => {
  if (!editing.value) return;
  setTodoText(editing.value, editVal.value);
  editing.value = '';
};
const cancelEdit = () => { editing.value = ''; };
const clearDoneToday = () => {
  const n = clearDone(sel.value);
  if (n) toast(`清掉了 ${n} 条已完成`);
};

/* ---------- 备份 / 导入 ---------- */
const doExport = () => {
  const blob = new Blob([exportTodos()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `待办备份-${dateKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('已导出备份文件');
};
const pickImport = () => fileEl.value && fileEl.value.click();
const doImport = async e => {
  const f = e.target.files && e.target.files[0];
  e.target.value = '';
  if (!f) return;
  try {
    const { added, updated } = importTodos(await f.text());
    toast(`导入完成：新增 ${added} 条、覆盖 ${updated} 条`);
  } catch (err) {
    toast(`导入失败：${err && err.message ? err.message : '文件读不出来'}`, 'err');
  }
};
</script>

<style scoped>
.cal { padding-bottom: 48px; }

/* ---------- 工具条 ---------- */
.cal-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
  margin: 16px 0 14px; padding: 10px 14px;
  border-radius: 16px; border: 1px solid var(--line);
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--card) 88%, transparent),
    color-mix(in srgb, var(--bg2) 55%, transparent));
}
.cal-nav { display: flex; align-items: center; gap: 10px; }
.cal-title { display: inline-flex; align-items: baseline; gap: 8px; }
.cal-title .mn {
  font-size: 30px; font-weight: 700; line-height: 1; letter-spacing: -.5px;
  background: linear-gradient(135deg, var(--blue), var(--cyan));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  font-variant-numeric: tabular-nums;
}
.cal-title .mt { display: inline-flex; align-items: baseline; gap: 3px; color: var(--mut); }
.cal-title .mt em { font-style: normal; font-size: 14px; font-variant-numeric: tabular-nums; }
.cal-title .mt i { font-style: normal; font-size: 12.5px; color: var(--faint); }
.nav-btn {
  width: 32px; height: 32px; border-radius: 10px; cursor: pointer;
  background: color-mix(in srgb, var(--bg2) 70%, transparent);
  border: 1px solid var(--line); color: var(--ink);
  font-size: 18px; line-height: 1; padding: 0 0 2px;
  transition: border-color .14s ease, color .14s ease, background .14s ease;
}
.nav-btn:hover { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 12%, transparent); }
.today-btn { padding: 5px 12px; font-size: 13px; border-radius: 99px; }

.cal-tools { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.stat { font-size: 13px; color: var(--mut); }
.stat b { color: var(--ink); font-size: 15px; margin-right: 2px; font-variant-numeric: tabular-nums; }
.sep { width: 1px; height: 18px; background: var(--line); }
.hide-file { display: none; }
.btn:disabled { opacity: .42; cursor: not-allowed; }

.cal-main { display: grid; grid-template-columns: minmax(0, 1fr) 348px; gap: 16px; align-items: start; }

/* ---------- 月历 ---------- */
.cal-grid-wrap {
  position: relative; overflow: hidden;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--card) 82%, transparent),
    color-mix(in srgb, var(--bg2) 52%, transparent));
  border: 1px solid var(--line); border-radius: 18px; padding: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .10);
}
.cal-grid-wrap::before {
  content: ''; position: absolute; inset: 0 18% auto; height: 2px;
  background: linear-gradient(90deg, transparent, var(--blue), var(--cyan), transparent);
  opacity: .65;
}
.cal-week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 8px; }
.cal-week span {
  text-align: center; font-size: 12px; color: var(--faint);
  letter-spacing: .16em; padding-bottom: 2px;
}
.cal-week span.we { color: color-mix(in srgb, var(--orange) 65%, var(--mut)); }
.cal-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; }
.cal-cell {
  position: relative; min-height: 84px; padding: 8px 9px; text-align: left; cursor: pointer;
  font: inherit;
  display: flex; flex-direction: column; gap: 6px;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--bg2) 78%, transparent),
    color-mix(in srgb, var(--bg2) 46%, transparent));
  border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
  border-radius: 12px; color: var(--ink);
  transition: border-color .15s ease, background .15s ease, transform .15s ease, box-shadow .15s ease;
}
.cal-cell:hover {
  border-color: color-mix(in srgb, var(--blue) 52%, var(--line));
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, .16);
}
.cal-cell .cd {
  font-size: 14px; font-variant-numeric: tabular-nums; letter-spacing: .2px;
  width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%;
  transition: background .15s ease, color .15s ease;
}
/* 日号下面一行小字：节日优先，其次初几；初一是月份名 */
.cal-cell .cl {
  font-size: 10.5px; line-height: 1.3; letter-spacing: .1px; color: var(--faint);
  margin-top: -3px; max-width: 100%;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cal-cell .cl.first { color: var(--mut); font-weight: 600; }
.cal-cell .cl.fest { color: var(--orange); font-weight: 600; }
.cal-cell.today .cl { color: var(--mut); }
.cal-cell.today .cl.fest { color: var(--orange); }
.cal-cell.sel .cl { color: color-mix(in srgb, var(--ink) 60%, transparent); }
.cal-cell.sel .cl.first { color: var(--ink); }
.cal-cell.sel .cl.fest { color: var(--orange); }
.cal-cell.we .cd { color: var(--mut); }
.cal-cell.has { border-color: color-mix(in srgb, var(--line) 55%, var(--blue)); }
.cal-cell.out { opacity: .34; }
.cal-cell.out:hover { opacity: .7; }
.cal-cell.today { border-color: var(--orange); background: color-mix(in srgb, var(--orange) 8%, var(--bg2)); }
.cal-cell.today .cd { background: var(--orange); color: #201404; font-weight: 700; }
.cal-cell.sel {
  border-color: var(--blue);
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--blue) 20%, var(--bg2)),
    color-mix(in srgb, var(--blue) 8%, var(--bg2)));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--blue) 16%, transparent);
}
.cal-cell.sel .cd { background: var(--blue); color: #06121f; font-weight: 700; }
.cal-cell.sel.today .cd { background: var(--orange); color: #201404; }
.dots { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; margin-top: auto; }
.dot {
  width: 7px; height: 7px; border-radius: 50%; display: inline-block;
  background: var(--blue); opacity: .85; box-shadow: 0 0 6px color-mix(in srgb, var(--blue) 45%, transparent);
}
.dot.done { background: var(--green); box-shadow: 0 0 6px color-mix(in srgb, var(--green) 40%, transparent); }
.more { font-size: 10.5px; color: var(--mut); margin-left: 1px; font-variant-numeric: tabular-nums; }
.cal-legend {
  margin: 12px 2px 2px; font-size: 12px; color: var(--faint);
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}

/* ---------- 侧栏 ---------- */
.cal-side {
  position: sticky; top: 64px;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--card) 86%, transparent),
    color-mix(in srgb, var(--bg2) 50%, transparent));
  border: 1px solid var(--line); border-radius: 18px; padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .10);
}
.side-head { display: flex; align-items: center; gap: 10px; }
.sd-num {
  font-size: 34px; font-weight: 700; line-height: 1; letter-spacing: -1px;
  background: linear-gradient(135deg, var(--blue), var(--cyan));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  font-variant-numeric: tabular-nums;
}
.sd-meta { display: flex; flex-direction: column; gap: 1px; line-height: 1.25; }
.sd-meta b { font-size: 13px; color: var(--ink); font-weight: 600; }
.sd-meta em { font-style: normal; font-size: 12px; color: var(--mut); }
.tag-today {
  margin-left: auto; font-size: 11.5px; padding: 2px 9px; border-radius: 99px;
  color: var(--orange); border: 1px solid color-mix(in srgb, var(--orange) 45%, transparent);
  background: color-mix(in srgb, var(--orange) 10%, transparent);
}
/* 农历一行：农历日期 + 干支生肖 + 节日 */
.side-lunar {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  margin-top: 7px; font-size: 12.5px; color: var(--mut); line-height: 1.5;
}
.side-lunar .sl-txt { color: var(--ink); }
.side-lunar em { font-style: normal; font-size: 11.5px; color: var(--faint); }
.side-lunar .sl-fest {
  font-size: 11.5px; font-weight: 600; padding: 1px 8px; border-radius: 99px;
  color: var(--orange); border: 1px solid color-mix(in srgb, var(--orange) 42%, transparent);
  background: color-mix(in srgb, var(--orange) 10%, transparent);
}
.side-stat { margin-top: 8px; font-size: 12.5px; color: var(--mut); }
.side-stat b { color: var(--ink); font-size: 14px; margin-right: 2px; font-variant-numeric: tabular-nums; }
.all-done { color: var(--green); }

.add-row { display: flex; gap: 8px; margin: 14px 0 12px; }
.add-in, .edit-in {
  flex: 1; min-width: 0; padding: 9px 13px; border-radius: 99px;
  background: color-mix(in srgb, var(--bg2) 72%, transparent);
  border: 1px solid var(--line); color: var(--ink); font-size: 13.5px;
  font-family: inherit; transition: border-color .14s ease, box-shadow .14s ease;
}
.add-in::placeholder { color: var(--faint); }
.add-in:focus, .edit-in:focus {
  outline: none; border-color: var(--blue);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--blue) 16%, transparent);
}
.edit-in { border-radius: 8px; padding: 4px 8px; }
.add-btn {
  flex: 0 0 auto; width: 38px; height: 38px; border-radius: 50%; cursor: pointer;
  font-size: 19px; line-height: 1; color: #0a1726; font-weight: 700;
  background: linear-gradient(135deg, var(--blue), var(--cyan));
  border: none; transition: transform .14s ease, filter .14s ease, opacity .14s ease;
}
.add-btn:hover:not(:disabled) { transform: translateY(-1px) scale(1.04); filter: brightness(1.08); }
.add-btn:disabled { opacity: .32; cursor: not-allowed; }

.todo-list { position: relative; list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
.todo {
  display: flex; align-items: center; gap: 10px; padding: 8px 8px; border-radius: 10px;
  border: 1px solid transparent; transition: background .13s ease, border-color .13s ease;
}
.todo:hover {
  background: color-mix(in srgb, var(--bg2) 76%, transparent);
  border-color: color-mix(in srgb, var(--line) 90%, transparent);
}
.chk { position: relative; display: flex; cursor: pointer; flex: 0 0 auto; }
.chk input { position: absolute; opacity: 0; width: 18px; height: 18px; margin: 0; cursor: pointer; }
.chk i {
  width: 18px; height: 18px; border-radius: 6px; border: 1.5px solid var(--mut);
  display: block; box-sizing: border-box;
  transition: background .13s ease, border-color .13s ease;
}
.chk input:checked + i {
  background: var(--green); border-color: var(--green);
  box-shadow: 0 0 8px color-mix(in srgb, var(--green) 40%, transparent);
}
.chk input:checked + i::after {
  content: ''; position: absolute; left: 6px; top: 2px; width: 4px; height: 9px;
  border: solid #06200f; border-width: 0 2px 2px 0; transform: rotate(42deg);
}
.tx { flex: 1; min-width: 0; font-size: 13.8px; line-height: 1.5; word-break: break-word; cursor: text; }
.todo.done .tx { color: var(--faint); text-decoration: line-through; }
.del {
  flex: 0 0 auto; width: 24px; height: 24px; border-radius: 7px; cursor: pointer;
  background: none; border: 1px solid transparent; color: var(--faint);
  font-size: 16px; line-height: 1; opacity: 0;
  transition: opacity .13s ease, color .13s ease, border-color .13s ease, background .13s ease;
}
.todo:hover .del { opacity: 1; }
.del:hover { color: var(--pink); border-color: color-mix(in srgb, var(--pink) 45%, transparent); background: color-mix(in srgb, var(--pink) 10%, transparent); }

.todo-enter-from, .todo-leave-to { opacity: 0; transform: translateX(10px); }
.todo-enter-active, .todo-leave-active { transition: opacity .18s ease, transform .18s ease; }
.todo-leave-active { position: absolute; left: 0; right: 0; }
.todo-move { transition: transform .18s ease; }

.empty {
  margin: 8px 0; padding: 22px 14px; border-radius: 12px; text-align: center;
  font-size: 12.8px; color: var(--faint); line-height: 1.7;
  border: 1px dashed color-mix(in srgb, var(--line) 90%, transparent);
  background: color-mix(in srgb, var(--bg2) 40%, transparent);
}
.em-ic { display: block; font-size: 20px; margin-bottom: 4px; opacity: .7; }

.side-foot { display: flex; align-items: center; justify-content: flex-end; margin-top: 12px; }
.clear-btn {
  padding: 5px 12px; border-radius: 99px; cursor: pointer; font-size: 12.5px;
  background: none; border: 1px solid var(--line); color: var(--mut);
  transition: color .13s ease, border-color .13s ease, background .13s ease;
}
.clear-btn:hover:not(:disabled) {
  color: var(--pink); border-color: color-mix(in srgb, var(--pink) 45%, transparent);
  background: color-mix(in srgb, var(--pink) 8%, transparent);
}
.clear-btn:disabled { opacity: .38; cursor: not-allowed; }

.next-up { margin-top: 14px; border-top: 1px dashed var(--line); padding-top: 12px; }
.nu-head { font-size: 11.5px; color: var(--faint); letter-spacing: .14em; margin-bottom: 6px; }
.nu-row {
  display: flex; align-items: center; justify-content: space-between; width: 100%;
  padding: 7px 10px; margin-bottom: 3px; border-radius: 9px; cursor: pointer;
  background: none; border: 1px solid transparent; color: var(--mut);
  font-size: 13px; font-family: inherit;
  transition: color .13s ease, border-color .13s ease, background .13s ease;
}
.nu-row:hover {
  border-color: color-mix(in srgb, var(--line) 90%, transparent);
  color: var(--ink); background: color-mix(in srgb, var(--bg2) 72%, transparent);
}
.nu-row b {
  min-width: 20px; height: 20px; padding: 0 6px; border-radius: 99px;
  display: grid; place-items: center; font-size: 11.5px;
  color: var(--blue); background: color-mix(in srgb, var(--blue) 14%, transparent);
}

/* ---------- 弹出提示 ---------- */
.cal-toast {
  position: fixed; left: 50%; bottom: 34px; transform: translateX(-50%);
  z-index: 300; max-width: min(560px, 88vw);
  padding: 10px 18px; border-radius: 99px; font-size: 13.5px; line-height: 1.5;
  color: var(--ink);
  background: color-mix(in srgb, var(--card) 94%, transparent);
  border: 1px solid color-mix(in srgb, var(--green) 45%, var(--line));
  box-shadow: 0 12px 34px rgba(0, 0, 0, .28);
  backdrop-filter: blur(10px);
}
.cal-toast.err {
  color: var(--ink);
  border-color: color-mix(in srgb, var(--pink) 55%, var(--line));
}
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 14px); }
.toast-enter-active, .toast-leave-active { transition: opacity .22s ease, transform .22s ease; }

@media (max-width: 1080px) {
  .cal-main { grid-template-columns: 1fr; }
  .cal-side { position: static; }
}
@media (max-width: 720px) {
  .cal-bar { padding: 9px 11px; }
  .cal-title .mn { font-size: 25px; }
  .cal-grid-wrap { padding: 10px; border-radius: 14px; }
  .cal-cell { min-height: 64px; padding: 5px 5px; border-radius: 10px; }
  .cal-cell .cd { font-size: 12.5px; width: 20px; height: 20px; }
  .cal-cell .cl { font-size: 9.5px; margin-top: -2px; }
  .cal-grid, .cal-week { gap: 5px; }
  .cal-legend { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .cal-cell, .add-btn, .todo-enter-active, .todo-leave-active, .todo-move,
  .toast-enter-active, .toast-leave-active { transition: none; }
}
</style>
