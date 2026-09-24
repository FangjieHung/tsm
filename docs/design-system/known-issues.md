# 已知缺陷與待辦

## 尚未完成的遷移

| # | 項目 | 現況 | 影響 |
|---|---|---|---|
| 1 | 頁面層元件未升至全域層 | `concept-page.scss` 仍有 2854 行；`.quick-item`、`.event-item`、`.news-card`、`.member-action` 等仍受 encapsulation 限制 | 無法在其他元件複用；`/#/design-system` 需直接引入整份 `concept-page.scss` 才能展示 |
| 2 | 斷點未收斂 | 仍有 9 種 `max-width`：520、640、720、767、860、900、1023、1180、1199 | 響應行為不一致，難以預測 |
| 3 | 字級未 token 化 | `h1` / `h2` 與各 hero 標題仍是字面 `clamp()`，且彼此相差 2px 的變體並存 | 無法統一調整字級階層 |
| 4 | 頁面標記未拆元件 | `concept-page.html` 501 行，以 `@if concept() === 'b'` 分支 | 新增方案的成本隨案數線性增長 |

## 仍為字面值的樣式

| 項目 | 位置 | 原因 |
|---|---|---|
| 6 筆間距（34、38、42 ×3、54） | `concept-page.scss` | 距離間距階梯超過 1px，強行吸附會改變版面 |
| 頁尾深色系（`#24272a`、`#202225`、`#22272a`、`#586067`） | `site-footer.scss` | 深色帶尚未納入 token；需要一組 inverse surface token |
| 比較頁配色（`#f5f7f8`、`#5a696d`） | `comparison.scss` | 該頁不在任何主題容器內 |
| 展示頁 chrome 配色（`#16191c`、`#e2e7e9` 等） | `design-system-page.scss` | 刻意的：展示頁的外框不該套用被展示的主題，否則無法中立呈現三案 |
| 漸層節點（`#d5eaf0`、`#9ed4e0`、`#7f9aa9`、`#315b70`、`#c9e5e2`、`#a9d5d2`） | `concept-page.scss` | 單點使用，色相與主色階不同，收斂會改變視覺 |
| `.skip-link` 的 `#fff` / `#111` | `_utilities.scss` | 必須在任何主題上都維持可讀 |
| 佔位漸層的第二個白 | `concept-page.scss` | 需要與 surface token 不同的第二個白 |

## 無障礙

| 項目 | 現況 | 建議 |
|---|---|---|
| `--tsm-color-ink-faint`（B 案 `#6a8ea1`） | 對白底 3.50:1 | 僅可用於大字；目前用於 meta 與日期，字級偏小，應改用 `--tsm-color-ink-subtle`（4.72:1） |
| `--tsm-color-accent` 上的白字 | 3.84:1 | 僅適用大字。按鈕字級 ≥ 16px 且為粗體，屬邊界情況，改版時應一併檢視 |

## 架構

| # | 項目 | 說明 |
|---|---|---|
| 5 | 展示頁重複載入 `concept-page.scss` | `/#/design-system` 的 lazy chunk 約 96KB（raw）。這是刻意的取捨：直接引入原檔可保證樣本與內頁由同一份程式碼渲染。待項目 1 完成後可縮減 |
| 6 | `mediaPath()` / `newsImage()` 寫死檔名對照 | `concept-page.ts`，內容與程式碼耦合，接 CMS 時應移入 `site-content.ts` |
| 7 | 圖片格式不一致 | A／C 用 `.webp`、B 用 `.png`，載入體積不一致 |
| 8 | 導覽與內容連結皆為提案用錨點 | 未串接會員、繳費、投稿或 CMS 後端 |
| 9 | 沒有自動化視覺回歸測試 | 目前靠手動截圖比對，流程見 `conventions.md` |

## 若最終只留一案

落選兩案的 token 與覆寫會成為死碼。建議將落選案的樣式與素材移入
`docs/archive/`，並從 `_tokens.scss` 移除其主題區塊——這是 token 層完整定義
三個主題最直接的好處：刪除一個主題只需刪掉一個區塊。
