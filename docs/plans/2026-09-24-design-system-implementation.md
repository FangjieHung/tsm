# TSM Design System 實作文件

> 目標讀者：接手的前端工程師、以及正式開發接 API 時的自己
> 對應分支：`claude/design-system-planning-3ehzlq`
> 撰寫日期：2026-09-24
>
> **這份是執行前的計畫書，保留原樣作為決策紀錄。** 實作過程中有幾項假設被
> 實際量測推翻（最主要是間距網格與 ink／line 階層），最終落地的規格以
> [`docs/design-system/`](../design-system/README.md) 為準；本文件末尾的
> 「§7 執行結果與計畫的落差」逐項說明哪裡改了、為什麼改。

---

## 0. TL;DR

把目前「一套 base + 兩套 override」的散裝樣式，重整成**三主題共用同一組語意 token 與元件層**的 design system，並新增 `/design-system` 路由，用專案**真實的樣式**渲染 live specimen（不是另寫一份副本）。

分四階段執行，風險由低到高：

| 階段 | 內容 | 視覺風險 | 可獨立交付 |
|---|---|---|---|
| P0 | 殘檔清理與命名修正 | 無 | ✅ |
| P1 | 建立 token 層，回收硬編碼色碼 | 低（近似色收斂） | ✅ |
| P2 | 元件樣式升至全域 `@layer components` | 中 | ✅ |
| P3 | `/design-system` live 展示頁 | 無（純新增） | ✅ |
| P4 | `docs/design-system/` 文件 | 無 | ✅ |

每階段結束都必須 `npm test -- --watch=false` + `npm run build` 綠燈，並完成三案截圖比對後才進下一階段。

---

## 1. 現況診斷

### 1.1 三案不是三套主題

| 主題 | `concept-page.scss` 中選擇器出現次數 |
|---|---|
| `.theme-a` | 6 |
| `.theme-b` | 212 |
| `.theme-c` | 109 |

**A 案等於「沒有前綴的 base 樣式」。** 這造成三個實際問題：

1. token 表格會有一欄是空的，無法對照。
2. 未來新增 D 案時，D 會無意間繼承 A 的殘留樣式。
3. 任何「修 base」的行為都會偷偷改到 A 案，沒有防護網。

### 1.2 Token 層是空殼

`src/styles.scss:36-88` 定義了三個主題，但：

```scss
.theme-a { --accent: #0f8db2; --surface: #ffffff; ... }
.theme-b { --accent: #0f8db2; --surface: #ffffff; ... }
.theme-c { --accent: #0f8db2; --surface: #ffffff; ... }
```

三案的 `--accent`、`--surface`、`--button-bg`、`--line`、`--link` **值完全相同**。真正的視覺差異全部寫死在 `concept-page.scss`：

| 色碼 | 出現次數 | 實際語意 |
|---|---|---|
| `#fff` | 38 | 表面色（應為 `--surface`） |
| `#0f8db2` | 21 | 品牌強調色（已有 token 卻沒用） |
| `#086a84` | 10 | 強調色深階（已有 `--accent-deep`） |
| `#eaf6f9` | 8 | B 案淺藍底（無 token） |
| `#587887` | 7 | B 案次要文字（無 token） |
| `#082a45` | 6 | B 案主文字（`.theme-b --ink` 已定義卻沒用） |
| `#d3e8ed` / `#cfe4e9` | 6 | B 案分隔線（無 token） |
| `#e8f6fe` | 3 | B 案會員卡底色（無 token） |
| `#6a8ea1` | 2 | B 案弱化文字（無 token） |

**結論：現在改 `--accent` 只會改到按鈕，B 案的淺藍完全不受控。** 若照現況寫 design system，寫出來的會是一份謊言。

### 1.3 沒有元件邊界

- `concept-page.scss` **2928 行**、`concept-page.html` **501 行**，靠 `@if concept() === 'b'` / `'c'` 在模板內分支。
- 真正的 Angular 元件只有四個：`site-header`、`site-footer`、`symbol`、`content-state`。
- `button`、`quick-item`、`event-item`、`news-card`、`member-action` 等只是 class，且樣式被 Angular 的 `ViewEncapsulation.Emulated` 綁在 `concept-page` 的 `_ngcontent` 屬性上。

**這是 live 展示頁的致命陷阱：** 新元件寫 `<a class="button button--primary">` 樣式不會生效，因為 `.button` 規則帶有 `[_ngcontent-xxx]` 屬性選擇器。這正是 P2 必須先做的原因。

### 1.4 命名腐爛

| 位置 | 問題 |
|---|---|
| `concept-page.scss:228`、`:131` 等 | `.theme-c` 的區塊註解寫「CONCEPT B hero」「concept-b redesign」 |
| `comparison.html:11,13,21,...` | class 為 `concept-bard`、`concept-bopy`（`card`→`bard`、`copy`→`bopy`，明顯是全域 a→b 取代事故） |
| repo 全域 | 24 個 `*.bak-20260902-*` 殘檔（含 `angular.json.bak`） |
| `README.md` | 標題寫「A／C 設計提案」，實際有 A/B/C 三案 |

### 1.5 系統性缺乏一致尺度

- **斷點**：全專案 11 種不同的 `max-width`（`520/640/720/860/900/1023/1180/1199/767` px…），沒有任何共識。
- **字級**：`font-size` 出現 30+ 種不同值，`clamp()` 各寫各的（`clamp(40px,4.2vw,62px)`、`clamp(42px,4.3vw,66px)`、`clamp(44px,5vw,70px)`…彼此差 2px，屬於無意義的變體）。
- **間距**：`32/22/20/18/16/14/10/9/8/6/4 px` 混用，非 4 的倍數者（9px、14px、18px、22px、30px）佔比高。

### 1.6 技術棧澄清（重要）

本專案**沒有 Tailwind CSS、沒有 Angular Material**。因此：

- 不套用 `--md-sys-*` token 命名（Material 專屬）。
- 不使用 Tailwind 斷點語法；斷點以 SCSS map + mixin 管理。
- 保留 Material Symbols 圖示（已由 `src/index.html` 載入 Google Fonts，透過 `<app-symbol>` 元件包裝）——這部分符合團隊規範，不動。
- `@layer reset, base, utilities` 已存在於 `src/styles.scss:1`，本次新增 `components` 層。

---

## 2. 目標架構

### 2.1 檔案結構

```
src/
├─ styles.scss                 ← 僅保留 @layer 宣告與 @use 進入點
└─ styles/
   ├─ _reset.scss              ← 現有 @layer reset 內容搬入
   ├─ _breakpoints.scss        ← SCSS map + mixin（media query 不能用 CSS var）
   ├─ _tokens.scss             ← 語意 token：:root 共用 + .theme-a/b/c 覆寫
   ├─ _typography.scss         ← 字級階層 class 與 token
   ├─ _components.scss         ← @forward 以下元件檔
   ├─ components/
   │  ├─ _button.scss
   │  ├─ _card.scss            ← quick-item / news-card / member-action 共通骨架
   │  ├─ _row.scss             ← quick-row / event-item 列表型
   │  ├─ _section.scss         ← section-shell / section-code / section-heading
   │  └─ _link.scss            ← text-link / *-arrow / *-cta
   └─ _utilities.scss          ← 現有 sr-only / skip-link 搬入
```

`styles.scss` 改為：

```scss
@layer reset, base, components, utilities;

@use './styles/reset';
@use './styles/tokens';
@use './styles/typography';
@use './styles/components';
@use './styles/utilities';
```

> ⚠️ 新增的 SCSS 檔一定要在 `styles.scss` 以 `@use` 引入，否則不會被 build 進去。
> ⚠️ 一律用 `@use` / `@forward`，不用已棄用的 `@import`。

### 2.2 Token 命名規範

採**單層語意 token**（不做 primitive 層——三案色相高度重疊，多一層只是增加維護面）。前綴 `--tsm-`，避免與未來引入的第三方樣式衝突。

#### 顏色

| Token | 語意 | A 案 | B 案 | C 案 |
|---|---|---|---|---|
| `--tsm-color-surface` | 頁面主表面 | `#ffffff` | `#ffffff` | `#ffffff` |
| `--tsm-color-surface-sunken` | 下凹區塊／卡片底 | `#ffffff` | `#eaf6f9` | `#ffffff` |
| `--tsm-color-surface-accent` | 強調區塊底 | `#ffffff` | `#e8f6fe` | `#000000` |
| `--tsm-color-ink` | 主文字 | `#223033` | `#082a45` | `#000000` |
| `--tsm-color-ink-muted` | 次要文字 | `#5a696d` | `#587887` | `#3a3a3a` |
| `--tsm-color-ink-subtle` | 弱化文字／序號 | `#5a696d` | `#6a8ea1` | `#3a3a3a` |
| `--tsm-color-ink-inverse` | 反白文字 | `#ffffff` | `#ffffff` | `#ffffff` |
| `--tsm-color-line` | 分隔線 | `#c5dce3` | `#d3e8ed` | `#000000` |
| `--tsm-color-line-subtle` | 弱分隔線 | `#c5dce3` | `#cfe4e9` | `#000000` |
| `--tsm-color-accent` | 品牌強調色 | `#0f8db2` | `#0f8db2` | `#0f8db2` |
| `--tsm-color-accent-deep` | 強調色深階（hover） | `#086a84` | `#086a84` | `#086a84` |
| `--tsm-color-accent-ink` | 強調色上的文字 | `#ffffff` | `#ffffff` | `#ffffff` |
| `--tsm-color-focus` | Focus ring | `#0f8db2` | `#0f8db2` | `#0f8db2` |

**色碼收斂表（P1 會造成的視覺 diff，逐一列出）：**

| 原色碼 | 收斂為 | 差異 | 判定 |
|---|---|---|---|
| `#eaf6f9` / `#eaf6fb` / `#e1f0f4` | `--tsm-color-surface-sunken` (`#eaf6f9`) | ΔE < 2 | 可收斂 |
| `#cfe4e9` / `#c9e5eb` / `#c9e0e7` | `--tsm-color-line-subtle` (`#cfe4e9`) | ΔE < 3 | 可收斂 |
| `#e8f6fe` | `--tsm-color-surface-accent` | 保留原值 | 無 diff |
| `#c9e5e2` / `#a9d5d2` | **不收斂** | 偏綠，與藍階不同色相 | 個案保留，於原處加註 |
| `#9ed4e0` / `#7f9aa9` / `#315b70` | **不收斂** | 單點使用，多為漸層節點 | 個案保留 |

> 收斂原則：**只合併 ΔE < 3 且語意相同的近似色**。不確定的一律保留原值並在原處加註解說明為何不進 token，寧可 token 表短一點，也不要製造看不出來的視覺回歸。

#### 圓角

沿用現有 `--radius-sm/md/lg`，改前綴並補齊三案（現況 A 案未定義，靠 `:root` 繼承）：

| Token | A | B | C |
|---|---|---|---|
| `--tsm-radius-sm` | `12px` | `999px` | `0` |
| `--tsm-radius-md` | `18px` | `22px` | `0` |
| `--tsm-radius-lg` | `28px` | `30px` | `0` |

#### 間距

4px 為基準單位：

```scss
--tsm-space-1: 4px;   --tsm-space-2: 8px;   --tsm-space-3: 12px;
--tsm-space-4: 16px;  --tsm-space-5: 20px;  --tsm-space-6: 24px;
--tsm-space-8: 32px;  --tsm-space-10: 40px; --tsm-space-12: 48px;
--tsm-space-16: 64px; --tsm-space-20: 80px;
```

> ⚠️ **間距收斂是 P1 的選擇性項目，預設不做。** 現況有 9px、14px、18px、22px、30px 等非 4 倍數值，強行收斂會產生大量 1–2px 位移，性價比極低。做法：token 先定義好供**新程式碼**使用，既有值等到該區塊因其他需求改動時再順手歸位。

#### 字級

三案字級策略不同（C 案 Swiss 風大字、B 案較保守），因此**字級 token 分主題賦值**：

| Token | 用途 | A | B | C |
|---|---|---|---|---|
| `--tsm-text-display` | Hero 標題 | `clamp(40px, 4.2vw, 62px)` | `clamp(42px, 4.3vw, 66px)` | `clamp(54px, 5.6vw, 84px)` |
| `--tsm-text-headline` | 區塊標題 h2 | `clamp(32px, 3vw, 44px)` | `clamp(32px, 3vw, 44px)` | `clamp(38px, 3.5vw, 54px)` |
| `--tsm-text-title` | 卡片標題 h3 | `clamp(21px, 1.8vw, 28px)` | `clamp(22px, 1.8vw, 29px)` | `clamp(22px, 1.8vw, 29px)` |
| `--tsm-text-body` | 內文 | `17px` | `17px` | `16px` |
| `--tsm-text-label` | 標籤／meta | `14px` | `14px` | `14px` |
| `--tsm-text-caption` | 序號／section-code | `13px` | `13px` | `13px` |

現況已有 `clamp(40px,4.2vw,62px)`、`clamp(42px,4.3vw,66px)`、`clamp(44px,5vw,70px)` 三個相差 2px 的變體。**P1 只收斂差距 ≤ 2px 的組，其餘保留。**

字重與字距在 `_typography.scss` 以 class 提供，**不在元件中另定字級**：

```scss
@layer base {
  .tsm-display  { font-size: var(--tsm-text-display);  line-height: 1.04; letter-spacing: -0.03em; }
  .tsm-headline { font-size: var(--tsm-text-headline); line-height: 1.12; letter-spacing: -0.02em; }
  .tsm-title    { font-size: var(--tsm-text-title);    line-height: 1.3; }
  .tsm-body     { font-size: var(--tsm-text-body);     line-height: 1.7; }
  .tsm-label    { font-size: var(--tsm-text-label);    line-height: 1.5; letter-spacing: 0.04em; }
  .tsm-caption  { font-size: var(--tsm-text-caption);  line-height: 1.4; letter-spacing: 0.12em; text-transform: uppercase; }
}
```

#### 字體家族

三案字體策略已在 `styles.scss` 就位，僅改前綴收進 token：

| 主題 | 字體 |
|---|---|
| A | `ui-sans-serif, system-ui, -apple-system, "Noto Sans TC", ...`（刻意不載 Inter，見 `styles.scss:40-45` 註解） |
| B | 繼承 `:root` 的 `"Noto Sans TC", "PingFang TC", ...` |
| C | `"Inter", "Noto Sans TC", ui-sans-serif, ...` |

> ⚠️ A 案的字體堆疊有**歷史包袱註解**（載入 Inter 後為避免 A 案渲染位移而刻意釘死）。搬遷時註解要一併帶走，不可刪。

#### 斷點

Media query 不能用 CSS 變數，因此用 SCSS map：

```scss
// _breakpoints.scss
$breakpoints: (sm: 640px, md: 900px, lg: 1200px);

@mixin below($key) {
  @media (max-width: map.get($breakpoints, $key) - 0.02px) { @content; }
}
```

現況 11 種斷點收斂對照：

| 現況 | 收斂為 |
|---|---|
| 520 / 640 | `sm` (640) |
| 720 / 767 / 860 / 900 | `md` (900) |
| 1023 / 1180 / 1199 | `lg` (1200) |

> ⚠️ **這會造成真實的版面位移**（例如 767px 的規則改在 900px 生效）。因此斷點收斂列為 **P2 的獨立 commit**，必須逐一在 375 / 768 / 1024 / 1440 四個寬度截圖比對。若某條規則確實需要非標準斷點，保留並在原處加註原因——有理由的例外好過假裝一致。

---

## 3. 實作階段

### P0：殘檔清理與命名修正（零視覺風險）

1. 刪除 24 個 `*.bak-20260902-*` 檔（含 `angular.json.bak-20260902-113455`）。歷史已在 git 中，殘檔只會污染 grep 結果與 IDE 搜尋。
2. 在 `.gitignore` 加入 `*.bak-*` 防止再犯。
3. `comparison.html` + `comparison.scss` 同步改名：`concept-bard` → `concept-card`、`concept-bopy` → `concept-body`。
   - 先確認 `comparison.spec.ts` 未依賴這些 class（已確認：只查 `a` 標籤，安全）。
4. 修正 `concept-page.scss` 中把 `.theme-c` 寫成「concept B」的誤導註解（至少 `:115`、`:131`、`:228` 三處，實作時全檔掃一次）。
5. 更新 `README.md` 標題與說明為 A／B／C 三案，補上 `/concept-b` 路由說明與 `public/media/b/` 素材路徑。

**驗收：** `npm test -- --watch=false` 綠燈、`npm run build` 成功、三案頁面截圖與 P0 前逐像素一致。

---

### P1：建立 Token 層

1. 建立 `src/styles/_tokens.scss`，內容為 §2.2 的 token 表，結構為：

   ```scss
   @layer base {
     :root { /* 三案共用：radius 預設、space、container */ }
     .theme-a { /* 完整 13 個顏色 token + 字級 + 字體 */ }
     .theme-b { /* 同上 */ }
     .theme-c { /* 同上 */ }
   }
   ```

2. **顯式化 A 案**：把 `styles.scss` 中原本屬於 A 的 base 值，明確寫進 `.theme-a`。`:root` 只留「三案真正共用」的值。
3. `styles.scss` 拆為 `_reset.scss` / `_utilities.scss` + `@use` 進入點。
4. 依 §2.2 收斂表，逐一把 `concept-page.scss`、`site-header.scss`、`site-footer.scss`、`comparison.scss` 的硬編碼色碼換成 `var(--tsm-color-*)`。
   - **一次換一個色碼、一個 commit**（例如「回收 #eaf6f9 → surface-sunken」），出問題可精準 revert。
   - 不在收斂表中的色碼**不要動**，並在原處加一行註解說明為何保留。
5. 舊 token（`--accent`、`--ink`、`--surface`…）以別名保留一個階段，避免大爆炸：

   ```scss
   /* 過渡別名 — P2 結束後移除 */
   --accent: var(--tsm-color-accent);
   --ink: var(--tsm-color-ink);
   ```

**驗收：**
- `npm test -- --watch=false` 綠燈、`npm run build` 成功。
- 三案 × 四斷點（375/768/1024/1440）截圖比對，差異必須**全部能對應到 §2.2 收斂表的某一列**。無法解釋的差異一律視為 bug。
- 手動驗證：把 `.theme-b` 的 `--tsm-color-accent` 暫改成紅色，B 案全站強調色應同步變紅——**這是 token 層是否真的有效的唯一判準**。

---

### P2：元件樣式升至全域 `@layer components`

這階段是 `/design-system` live 展示頁能成立的前提。

**判定標準：一段樣式要不要升到全域？**

| 升到全域 `components` | 留在 `concept-page.scss` |
|---|---|
| 跨區塊重複使用（`.button`、`.section-code`、`.text-link`） | 單一區塊的版面（`.hero` grid、`.quick-split` 欄位定義） |
| 有明確狀態變體（hover / focus / disabled） | 一次性的絕對定位（`.b-hero-dna`、`.hero-watermark`） |
| 在 design system 文件中要被當成「元件」展示 | 頁面組裝邏輯 |

**首批遷移清單（依風險由低到高）：**

| 順序 | 元件 | 來源行數（約） | 風險 |
|---|---|---|---|
| 1 | `.button` / `--primary` / `--secondary` | `concept-page.scss:54-107` | 低，選擇器單純 |
| 2 | `.section-code` / `.section-heading` / `.section-shell` | `:10-24, :349-354` | 低 |
| 3 | `.text-link` | `:43-53` | 低 |
| 4 | `.quick-item` / `.quick-row` | `:363-555` | 中，含 `::before` 與 hover 連動 |
| 5 | `.event-item` / `.news-card` / `.member-action` | 分散多處 | 中高，B/C 覆寫多 |

**遷移注意事項：**

- 全域層沒有 `_ngcontent` 屬性，**specificity 會下降**。遷移後若原本靠 encapsulation 勝出的規則被覆蓋，**不要加 `!important`**，改用 `@layer` 順序（`components` 在 `utilities` 前、在 `base` 後）解決。
- 主題覆寫（`.theme-b .button`）一起搬，保持同檔案內可讀。
- **禁止 `::ng-deep`**。若真的需要穿透，代表該樣式本來就該在全域層。
- 斷點收斂（§2.2）在本階段以**獨立 commit** 進行。

**驗收：** 同 P1，外加「`concept-page.scss` 行數應明顯下降」（預期 2928 → 1800 上下）。

---

### P3：`/design-system` Live 展示頁

**核心設計：靠 CSS 變數繼承 + 全域元件層，不需要 `ViewEncapsulation.None`。**

因為 P2 之後元件樣式已在全域 `@layer components`，而 token 是 CSS 自訂屬性（可繼承），所以展示頁只要在容器上掛 `.theme-a/b/c`，內部元素就會正確取得該主題的值。

```
src/app/pages/design-system/
├─ design-system-page.ts        ← 主頁，含 A/B/C 主題切換 signal
├─ design-system-page.html
├─ design-system-page.scss      ← 只放展示頁自身版面，不放元件樣式
├─ design-system-page.spec.ts
└─ specimen/
   ├─ token-table.ts            ← 讀 getComputedStyle 即時顯示 token 實際值
   └─ specimen-block.ts         ← 「標題 + 說明 + 實際渲染 + 程式碼片段」四段式容器
```

路由（`app.routes.ts`）：

```ts
{
  path: 'design-system',
  title: 'Design System｜台灣微生物學會',
  loadComponent: () =>
    import('./pages/design-system/design-system-page').then((m) => m.DesignSystemPage),
}
```

**頁面章節：**

1. **概覽** — 三案定位一句話（沿用 `comparison.html` 既有文案，勿另寫）
2. **主題切換器** — 全頁 A/B/C 即時切換，這是整份 design system 最有說服力的一頁
3. **色彩** — token 色票卡：token 名 / 實際色值 / 與 `--tsm-color-surface` 的對比度 / WCAG AA 判定
4. **字體排印** — `.tsm-display` 至 `.tsm-caption` 六級實際渲染，標註各主題實際 px
5. **間距與圓角** — 視覺尺規
6. **元件** — 每個元件含 default / hover / focus-visible 三態，附可複製的 HTML 片段
7. **版面** — `section-shell`、容器寬度、斷點示意
8. **無障礙** — focus ring 實測、對比度總表、`prefers-reduced-motion` 說明

**token 表要讀「實際計算值」而非寫死：**

```ts
readonly tokenValue = (name: string): string =>
  getComputedStyle(this.host.nativeElement).getPropertyValue(name).trim();
```

這樣文件永遠不會與程式碼脫節——**這是整個設計的關鍵**：展示頁不是 token 的副本，而是 token 的鏡子。

**對比度計算**：實作一個小的 relative-luminance 函式（約 20 行，無需第三方套件），直接在頁面上標示 AA / AAA / Fail。§1.2 提到的 `#6a8ea1` 在白底上約 3.4:1，**未達一般文字 AA 的 4.5:1**——這類問題會被這一頁自動抓出來，不必人工稽核。

**是否進正式站？** 展示頁預設**保留在 build 中**（lazy load，不影響首屏），但不從 `comparison` 頁或導覽列連出，只靠直接輸入網址進入。若甲方端不希望外部看到，再於 `angular.json` 以 build configuration 排除。

---

### P4：`docs/design-system/` 文件

live 展示頁負責「看」，Markdown 負責「查與改」。

```
docs/design-system/
├─ README.md            ← 入口、如何跑起來、如何改一個 token
├─ tokens.md            ← token 完整對照表（§2.2）+ 新增 token 的流程
├─ components.md        ← 元件清單、class 契約、狀態、file:line 指引
├─ conventions.md       ← 命名規則、@layer 判定、反模式、Code Review checklist
└─ known-issues.md      ← 已知缺陷與技術債（見 §5）
```

**`components.md` 每個元件的固定格式：**

```markdown
### Button

- **原始碼**：`src/styles/components/_button.scss`
- **使用範例**：`src/app/pages/concept/concept-page.html:76`
- **Class**：`.button` + `.button--primary` | `.button--secondary`
- **主題差異**：C 案為直角無圓角、hover 為反白（`_button.scss` 中 `.theme-c` 區塊）
- **相依 token**：`--tsm-color-accent`、`--tsm-color-accent-ink`、`--tsm-radius-sm`
- **無障礙**：必須是 `<a>` 或 `<button>`；僅含圖示時必須有 `aria-label` 或 `.sr-only` 文字
```

**`conventions.md` 必須明列的反模式（皆源自本專案實例）：**

- ❌ 在元件 SCSS 中定義字級 → 用 `_typography.scss` 的 class
- ❌ 硬寫色碼 → 用 `--tsm-color-*`；真的必須破例時，在原處加註原因
- ❌ 新增第 12 種斷點 → 用 `_breakpoints.scss` 的 `below()` mixin
- ❌ 用 `!important` 解決 specificity → 改用 `@layer` 順序
- ❌ `::ng-deep` → 該樣式屬於全域層
- ❌ 用 `@import` → 用 `@use` / `@forward`
- ❌ 留下 `*.bak-*` 檔 → git 就是備份

---

## 4. 驗收清單

每個 PR 都要能回答：

- [ ] `npm test -- --watch=false` 綠燈
- [ ] `npm run build` 成功
- [ ] 三案 × 四斷點（375 / 768 / 1024 / 1440）截圖比對完成
- [ ] 所有視覺差異都能對應到文件中某一條明確決策
- [ ] 沒有新的硬編碼色碼、字級、斷點
- [ ] 新增 SCSS 檔已在 `styles.scss` 以 `@use` 引入
- [ ] 樣式寫在正確的 `@layer`
- [ ] 互動元素有可見文字或 `aria-label`
- [ ] 對比度符合 WCAG AA（一般文字 4.5:1、大字 3:1）
- [ ] `/design-system` 展示頁對應章節已同步更新

**Token 有效性回歸測試**（建議寫成 spec）：

```ts
it('主題切換會改變計算後的強調色', () => {
  // 掛 .theme-b 與 .theme-c 後，讀取 .button--primary 的 computed background
  // 兩者若相同，代表 token 層又被硬編碼旁路了
});
```

---

## 5. 已知缺陷與技術債（進 `known-issues.md`）

| # | 項目 | 影響 | 建議處理時機 |
|---|---|---|---|
| 1 | `concept-page.html` 501 行單檔，靠 `@if concept()` 分支 | 新增方案成本隨案數線性增長 | 正式開發接 API 時，拆成 section 元件 |
| 2 | 間距未收斂至 4px 網格 | 視覺節奏不一致 | 各區塊因其他需求改動時順手歸位 |
| 3 | `#6a8ea1` 等弱化文字在白底對比度不足 AA | 無障礙風險 | P3 展示頁會自動標示，之後逐一修正 |
| 4 | `mediaPath()` / `newsImage()` 在元件中硬寫檔名對照表 | 內容與程式碼耦合 | 接 CMS 時移入 `site-content.ts` |
| 5 | 圖片副檔名 A/C 用 `.webp`、B 用 `.png` | 載入體積不一致 | 素材定案後統一轉 `.webp` |
| 6 | 導覽與內容連結皆為提案用錨點 | 未串接會員／繳費／投稿 | 正式開發階段 |
| 7 | 三案最終若只留一案 | 另兩案的 token 成為死碼 | 選案定案後，將落選案移入 `docs/archive/` 並刪除其 token 與覆寫 |

---

## 6. 執行順序建議

P0 可以立刻做且零風險，建議先單獨開一個 commit 推上去。P1 是整件事的價值核心——**沒有 P1，這份 design system 就只是一份美化過的樣式清單**。P2 的斷點收斂風險最高，建議與元件遷移分開 commit。P3 做完之後，這套系統才第一次「看得見」，也才真的能拿給設計師與甲方用。

若時間有限只能做兩階段，做 **P0 + P1**：token 層是唯一無法事後補救的地基，元件層與展示頁隨時可以再加。


---

## 7. 執行結果與計畫的落差

P0 至 P4 皆已完成並推送。以下是實作與本計畫的差異，以及差異的理由。

### 7.1 間距：4px 網格 → 2px 網格

**計畫**假設收斂到 4px 網格，並把間距收斂列為選擇性項目。

**實測**後推翻：183 筆間距宣告中有 84 筆不在 4px 格線上，其中 18px（16 次）、
14px（14 次）、22px（11 次）是最常用的間距之一。這三案本來就是以 2px 節奏繪製的。
硬套 4px 會移動 84 處、每處 2px。

**最終**：32px 以下每 2px 一階、以上每 4px 一階，token 以像素值命名
（`--tsm-space-18` 即 18px），只有 13 筆奇數值被吸附，位移皆 ≤1px。

### 7.2 顏色：ink 與 line 各多一階

**計畫**的 token 表把 B 案的次要文字對應到 `#587887`。

**實測**發現 B 案同時存在三個「次要文字」與三個「線條色」：`--text-muted`
原本是 `#4d7477`，而 `#587887`、`#6a8ea1` 是另外硬寫的兩階。線條同樣有
`#c5dce3`（token）、`#d3e8ed`、`#cfe4e9` 三階。

按計畫表填值會把 B 案的內文顏色從 `#4d7477` 改成 `#587887`——這是真的視覺回歸，
在截圖比對中以「1767 px 的文字色位移」被抓到。

**最終**：ink 階層擴為 `ink` / `ink-muted` / `ink-subtle` / `ink-faint`，
line 階層擴為 `line` / `line-soft` / `line-subtle`，忠實保留三階。

### 7.3 字級：未 token 化

**計畫**規劃了 `--tsm-text-*` 與 `.tsm-display` 等六級字級 class。

**實作時放棄**：這三案的字級是按情境寫的（`.hero h1`、`.b-hero-copy h1`、
`.theme-c .hero-copy--c h1` 各自不同），不存在乾淨的六級階梯。硬套會產生大量
改動與回歸風險，換來一組沒人使用的 class。

**最終**：展示頁改為渲染真實選擇器，再用 `getComputedStyle` 回報瀏覽器實際
解析出的字級。字級 token 化列入 `known-issues.md`。

### 7.4 展示頁：不需要 ViewEncapsulation.None

**計畫**認為 live 展示頁必須先完成整個元件層遷移（P2）才可能成立。

**實作**找到成本低得多的做法：展示頁的 `styleUrls` 直接引入
`concept-page.scss` **原檔**。Angular 會為展示頁產生該樣式的 scoped 副本，
渲染結果與內頁由同一份程式碼保證一致，且對內頁零風險。

這也讓「component 直接取用專案內程式碼」這個需求被嚴格滿足——展示頁消費的是
專案自己的樣式檔，不是抄寫版。

### 7.5 元件層：只遷移了三個元件

**計畫**首批列了五類元件。

**最終**只遷移了 `.button`、`.section-shell` / `.section-code`、`.text-link`
三者，全部驗證為逐像素相同。`.quick-item`、`.event-item`、`.news-card`、
`.member-action` 因三案覆寫過多而留在頁面層，列入 `known-issues.md`。
展示頁仍能展示它們（見 7.4）。

### 7.6 斷點：未收斂

**計畫**列為 P2 的獨立 commit。**實作時未執行**——這是唯一一項風險高於收益、
且沒有立即需求的改動。9 種斷點的現況記錄於 `known-issues.md`。

### 7.7 驗證方法本身出過錯

首次建立的截圖比對回報「16 張全部逐像素相同」，其實是假訊號：本專案使用
`withHashLocation()`，`/concept-b` 這種網址會落到 wildcard 路由被導回比較頁，
所以四張截圖其實是同一頁。

修正後補上健全性測試：把 `.theme-b` 的 `--tsm-color-accent` 暫時改成紅色，
確認**只有 B 案**產生差異（142,569 px）。這同時是計畫 §4 所要求的
「token 層是否真的有效」的判準，現在確定成立。

驗證流程已寫入 `docs/design-system/conventions.md`。

### 7.8 最終驗證結果

以 P0 前的建置為基準，四個寬度（375／768／1024／1440）× 四個頁面全頁截圖、
容差 0 比對：

| 頁面 | 結果 |
|---|---|
| 方案比較頁 | 逐像素相同 |
| A 案 | 僅間距吸附造成的單元件內位移，頁高不變 |
| B 案 | 最大單通道色差 9（`#e1f0f4` 收斂），頁高最多變動 13px／8030px（0.18%） |
| C 案 | 僅間距吸附造成的單元件內位移，頁高不變 |

無任何文字重排。
