# 元件

元件分兩層：

- **全域元件層**（`src/styles/components/`，`@layer components`）——跨頁重複使用、
  有明確狀態變體、在 design system 中要被當成元件展示的。任何 Angular 元件都能套用。
- **頁面層**（`src/app/pages/concept/concept-page.scss`）——單一區塊的版面、
  一次性絕對定位、頁面組裝邏輯。仍受 Angular emulated encapsulation 限制。

判定標準見 [`conventions.md`](conventions.md)。

---

排版另成一層，見 [`typography.md`](typography.md)：`.tsm-display` 等 class 位於
`@layer base`，是新標記設定字級的唯一方式。

## 全域元件層

### Button

- **原始碼**：`src/styles/components/_button.scss`
- **Class**：`.button` + `.button--primary` | `.button--secondary`
- **標記**：`<a class="button button--primary" href="…">文字 <app-symbol name="arrow_forward" /></a>`
- **使用範例**：`src/app/pages/concept/concept-page.html`（hero 與各區塊 CTA）
- **相依 token**：`--tsm-color-accent`、`--tsm-color-accent-ink`、`--tsm-color-accent-deep`、
  `--tsm-color-ink`、`--tsm-color-surface`、`--tsm-color-surface-accent`、`--tsm-radius-sm`
- **主題差異**：C 案為直角、全大寫、加寬字距，hover 為反白；B 案另有陰影與膠囊造型
  （覆寫仍在 `concept-page.scss`）
- **尺寸**：`min-height: 52px`，滿足 44×44px 最小點擊區域
- **無障礙**：必須是 `<a>` 或 `<button>`；僅含圖示時必須有 `aria-label` 或 `.sr-only` 文字

### Section shell

- **原始碼**：`src/styles/components/_section.scss`
- **Class**：`.section-shell`、`.section-code`
- **標記**：`<section class="section-shell">` 內含 `<p class="section-code">01 · QUICK ACCESS</p>`
- **相依 token**：`--tsm-container`、`--tsm-color-link`、`--tsm-space-18`
- **說明**：`.section-shell` 提供全站一致的左右留白與垂直節奏；
  `.section-code` 是區塊上方的英文標籤
- **主題差異**：C 案另有 `.swiss-number`（`01 — 快速入口`）取代 `.section-code`，
  該規則仍在 `concept-page.scss`

### Text link

- **原始碼**：`src/styles/components/_link.scss`
- **Class**：`.text-link`
- **標記**：`<a class="text-link" href="…">查看全部 <app-symbol name="arrow_outward" /></a>`
- **相依 token**：`--tsm-color-link`、`--tsm-space-10`
- **說明**：底線以 background gradient 繪製，避開下降部；`min-height: 44px`

---

## Angular 元件

| 元件 | 路徑 | 說明 |
|---|---|---|
| `<app-site-header>` | `src/app/shared/site-header/` | 導覽列，`[concept]` 輸入決定 `--b` / `--c` 變體 |
| `<app-site-footer>` | `src/app/shared/site-footer/` | 頁尾，同上 |
| `<app-symbol>` | `src/app/shared/symbol/` | Material Symbols 包裝，`[name]` 為圖示名稱 |
| `<app-content-state>` | `src/app/shared/content-state/` | 空狀態／錯誤狀態 |
| `appRevealOnView` | `src/app/shared/reveal-on-view/` | 進場動畫 directive |

圖示一律使用 `<app-symbol>`（底層為 Google Fonts Material Symbols，於
`src/index.html` 載入），不使用 `<mat-icon>`——本專案未安裝 Angular Material。

---

## 尚在頁面層的元件

以下有明確元件形狀，但覆寫過多、尚未升至全域層。要在別處使用前需先遷移：

| Class | 位置 | 備註 |
|---|---|---|
| `.quick-item` / `.quick-grid` | `concept-page.scss` | A/B/C 三種版面差異大 |
| `.quick-row` / `.quick-split` | `concept-page.scss` | C 案專用的編號列表 |
| `.event-item` / `.event-list` | `concept-page.scss` | B 案有獨立的 `.b-event-*` 家族 |
| `.news-card` / `.news-item` | `concept-page.scss` | 同上 |
| `.member-action` / `.member-grid` | `concept-page.scss` | B 案有 featured 卡片變體 |
| `.image-fallback` | `concept-page.scss` | 圖片載入失敗時的佔位樣式 |

`/#/design-system` 的元件區塊仍能展示這些，因為展示頁的 `styleUrls` 直接引入了
`concept-page.scss` 原檔——樣本與內頁由同一份程式碼渲染。
