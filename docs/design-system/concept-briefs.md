# 三案設計簡報

這份是給**延伸開發**用的：要在某一案的語彙下新增一個頁面或區塊時，先讀對應的一節。
每一節都描述「這個案在做什麼決定」，而不只是列出數值——數值在
[`tokens.md`](tokens.md) 與 [`typography.md`](typography.md)。

三案共用同一份內容與資訊架構（`src/app/core/site-content.ts`），只改變視覺語言。
新增內容時**先加進 `site-content.ts`，三案一起長**，不要只長在一案裡。

---

## A 案 — 學術典雅風（Editorial Minimalism）

### 在說什麼

台灣微生物學會深耕逾一甲子，核心資產是**信任**與**同儕審查的嚴謹性**。
這一案用近乎留白的版面、細線分隔與序號系統，模仿 ASM、Nature Portfolio
等國際學會官網的語彙，讓會員與投稿者第一眼感受到「這是一個被認真對待的學術機構」，
而不是行銷網站。

適合的時機：學會把網站當成**長期服務的基礎設施**，預期十年持續更新內容而不希望退流行。

### 視覺規則

| 面向 | 決定 |
|---|---|
| 字體 | 系統 sans（`ui-sans-serif, system-ui, …`），**刻意不載 Inter** |
| 主文字 | `--tsm-color-ink` `#223033`——不是純黑，帶青灰，降低對比的攻擊性 |
| 線條 | `--tsm-color-line` `#c5dce3`，細、淺、大量使用 |
| 圓角 | 12 / 18 / 28px，柔但不圓潤 |
| 字重 | 650（標題）、700、750、900（序號）——高對比的字重階層 |
| Hero | 左文右圖分欄，不做滿版 |
| 區塊標頭 | `.section-code` 英文小標（`TAIWAN · MICROBIOLOGY · 1968`）+ 中文 `h2` |
| 快速入口 | `.quick-grid` 卡片，每張帶 `.item-number` 序號 |

### 延伸開發時

- 新區塊一律 `<section class="section-shell">` 包住，取得一致的左右留白與垂直節奏。
- 標頭固定用 `.section-code` + `h2` 的組合，序號用兩位數（`01`、`02`）。
- **不要加陰影**。A 案靠線條與留白分層，不靠 elevation。
- 新的強調色請用 `--tsm-color-accent`，不要引入第二個強調色——單一節制色是這案的骨架。

### ⚠️ A 案的陷阱

`.theme-a` 的 `font-family` 是**刻意釘死**的。C 案導入 Inter 之前，`:root` 的堆疊把
`Inter` 排在最前但從未真的載入，A 案一直以 system-ui fallback 渲染。Inter 成為可載入
字體後若不釘死 A 案，它的字體會整個位移。`_tokens.scss` 中該註解不可刪。

---

## B 案 — 親和科技風（Soft Biotech）

### 在說什麼

若學會現階段的優先目標是**擴大招募新會員、爭取年輕研究者與大眾關注**，這一案最有效。
柔和漸層與圓角語彙降低學術網站常見的距離感，真人研究者照片建立「有溫度的人在做這件事」
的第一印象，插畫化的 DNA 與培養皿圖像讓非本科的一般民眾不會被拒於門外。

三案中調性最年輕、最有朝氣，也是最適合拉近與公眾距離的一案。

### 視覺規則

| 面向 | 決定 |
|---|---|
| 字體 | `Noto Sans TC`（繼承 `:root`） |
| 主文字 | `--tsm-color-ink` `#082a45` 深藍，不是黑 |
| 表面 | 三層：`surface` 白 / `surface-sunken` `#eaf6f9` / `surface-accent` `#e8f6fe` |
| 文字階層 | 四階 ink：`ink` → `ink-muted` `#4d7477` → `ink-subtle` `#587887` → `ink-faint` `#6a8ea1` |
| 線條 | 三階：`line` `#c5dce3` / `line-soft` `#d3e8ed` / `line-subtle` `#cfe4e9` |
| 圓角 | **999 / 22 / 30px**——按鈕是膠囊 |
| 字重 | **幾乎只有 600**（18 處中的 18）。B 案不靠字重拉對比，靠顏色與留白 |
| Hero | 拼貼式：主照 + 研究者 + DNA + 數據 + 儀器五塊絕對定位 |
| 陰影 | 有，`box-shadow` 帶品牌色的柔和投影 |

### 延伸開發時

- 卡片底色用 `--tsm-color-surface-sunken`，特色卡片才用 `surface-accent`。
- 文字階層請照四階使用，不要隨手挑一階。meta 與日期用 `ink-faint`，
  但注意它對白底只有 **3.50:1，僅適用大字**（見下方警告）。
- 按鈕維持膠囊（`--tsm-radius-sm` 是 999px），不要在 B 案裡做直角按鈕。
- 字重維持 600。要強調請改用顏色或尺寸，不要跳到 700/900。
- B 案的區塊命名前綴是 `b-`（`.b-event-item`、`.b-member-featured`）。
  新增 B 專屬結構時沿用這個前綴，才不會和共用元件混淆。

### ⚠️ B 案的無障礙問題

`--tsm-color-ink-faint`（`#6a8ea1`）對白底 **3.50:1**，未達一般文字 AA 的 4.5:1。
目前用在 meta 與日期上，字級偏小。延伸開發時**不要再擴大它的使用範圍**，
改用 `ink-subtle`（4.72:1）。

---

## C 案 — 強黑實驗室風（Bold Dark Editorial）

### 在說什麼

適合學會想要**重新定義自己在台灣學術圈與媒體上的能見度**的時刻——爭取國際研討會主辦權、
對外募款、吸引產業合作與媒體報導。深色底、戲劇性微生物特寫與大字報式排版，
讓網站在同類學會網站中立即脫穎而出，傳遞「有審美高度、掌握話語權」的專業形象。

三案中視覺張力最強、記憶點最鮮明。

### 視覺規則

| 面向 | 決定 |
|---|---|
| 語彙 | 瑞士國際主義排版（Swiss International Typographic Style） |
| 字體 | `Inter` + `Noto Sans TC` |
| 顏色 | **純黑白**：`ink` `#000000`、`line` `#000000`、`surface` 白，加單一強調色 |
| 圓角 | **全部 0**——直角是這案的骨架 |
| 字重 | 900（標題）、600、200（超細對比） |
| Focus ring | 2px 實線（其他兩案是 3px），無光暈 |
| Hero | 滿版背景照 + 角落內容 + 底部溢出的 ghost text 浮水印 |
| 區塊編號 | `.swiss-number`（`01 — 快速入口`），取代 `.section-code` |
| 版面 | sticky 左欄標籤 + 右側列表（`.quick-split`、`.news-split`） |
| 質感 | 全頁極淡的 fractal-noise 顆粒膜（`.theme-c::before`） |

### 延伸開發時

- **不要加圓角**。`--tsm-radius-*` 在 C 案全是 0，硬寫圓角會破壞整案語彙。
- 區塊編號用 `.swiss-number`（中文），`.section-code`（英文）會被相鄰選擇器隱藏，
  兩者不會同時出現——這是刻意的，避免標籤重複。
- 新的滿版區塊請走 `.theme-c` 下的 full-bleed 模式：`.section-shell` 的
  左右留白要用負 margin 抵銷，參考 `.theme-c .events`。
- 大字排版請用 `display-2xl` / `headline-rail-*`，並記得三個斷點各有一階
  （`display-2xl` / `-md` / `-sm`）。
- 導覽列 hover 是「上捲換色」效果（`.nav-link-track`），新增導覽項目要沿用
  雙層 label 結構，否則 hover 會失效。

### ⚠️ C 案的命名歷史

`concept-page.scss` 中 `.theme-c` 的部分註解曾把 C 案寫成「concept B」，
已於本次重構修正。若在舊 commit 或舊文件看到「concept B hero」指的是滿版 hero，
那講的是 **C 案**。

---

## 給其他 session 的交接指引

要在某一案下新增頁面或區塊，最小的上手路徑：

1. 讀本文件對應的一節，取得設計意圖與該案的「不要做什麼」。
2. 讀 [`architecture.md`](architecture.md) 了解樣式放哪一層。
3. 讀 [`conventions.md`](conventions.md) 的反模式與 checklist。
4. 內容加進 `src/app/core/site-content.ts`（三案共用），不要寫死在模板。
5. 版面寫在 `concept-page.scss`；若是跨案重複使用的元件，寫進
   `src/styles/components/` 並在 `_components.scss` `@forward`。
6. 跑 `npm run check:styles` + `npm test -- --watch=false` + `npm run build`。
7. 三案 × 四斷點截圖比對，容差 0，任何差異都要能解釋。

**最重要的一條**：任何顏色、間距、字級都必須是 token。
`npm run check:styles` 會擋下 `font-size` 與固定 `gap` 的字面值，
顏色則以棘輪值守住——但它擋不了「用錯 token」，那要靠讀本文件。
