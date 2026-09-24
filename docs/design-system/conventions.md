# 慣例與反模式

## CSS Layer

順序在 `src/styles/_layers.scss` 宣告一次，是全站解決 specificity 衝突的機制：

```scss
@layer reset, base, components, utilities;
```

| Layer | 放什麼 | 不放什麼 |
|---|---|---|
| `reset` | 元素正規化 | 任何專案樣式 |
| `base` | design token、文件層預設 | 元件樣式 |
| `components` | 可重用 UI | 一次性頁面版面 |
| `utilities` | 單一職責 helper | 複雜 UI 邏輯 |

> ⚠️ **未分層的樣式勝過所有已分層的樣式。** Angular 元件的 SCSS
> （`concept-page.scss` 等）沒有 `@layer`，因此永遠贏過全域 `components` 層。
> 這正是把共用元件升到全域層後，頁面層覆寫仍然生效的原因，也是遇到
> specificity 問題時該先想 layer、而不是 `!important` 的原因。

## 元件要不要升到全域層？

| 升到全域 `components` | 留在頁面 SCSS |
|---|---|
| 跨區塊重複使用 | 單一區塊的版面（grid 欄位定義） |
| 有明確狀態變體（hover / focus / disabled） | 一次性絕對定位 |
| 要在 design system 中被當成元件展示 | 頁面組裝邏輯 |

元素選擇器（`h1` / `h2` / `p`）**不要**升到全域層——會外溢到方案比較頁。

## 反模式

以下每一條都來自本專案的真實案例。

**❌ 硬寫色碼**
```scss
.card { background: #eaf6f9; }          // 錯：改主題不會同步
.card { background: var(--tsm-color-surface-sunken); }   // 對
```
重構前 `concept-page.scss` 有約 100 個硬編碼色碼，導致 `styles.scss` 的三個主題
色值完全相同卻看起來不一樣——token 層形同虛設。

**❌ 只在一個主題定義 token**
三個主題都要給值，即使當下相同。A 案重構前沒有自己的 token 列，任何對 base 的
修改都會偷偷改到 A 案。

**❌ 新增第 10 種斷點**
目前仍有 9 種不同的 `max-width`，見 `known-issues.md`。新增媒體查詢前先確認
能不能用既有斷點。

**❌ 用 `!important` 解決 specificity**
先確認是不是 layer 順序的問題。

**❌ `::ng-deep`**
需要穿透，代表該樣式本來就該在全域元件層。

**❌ 在元件 SCSS 中重述 token 值**
`/#/design-system` 的樣式表刻意不含任何色碼／間距的字面值——它一旦開始複製
token，就不再是鏡子。

**❌ 用 `@import`**
SCSS 的 `@import` 已棄用，一律 `@use` / `@forward`。
另外 Angular builder 以 `@import` 包裝全域樣式表，因此 `src/styles.scss`
的第一行必須是 `@use`，`@layer` 宣告要放在被 `@use` 的 partial 裡。

**❌ 留下 `*.bak-*` 檔**
git 就是備份。`.gitignore` 已封鎖此模式。

**❌ 用寫死的檔名對照表決定圖片路徑**
`concept-page.ts` 的 `mediaPath()` / `newsImage()` 目前如此，屬技術債。

## Code Review Checklist

每個含樣式改動的 PR：

- [ ] `npm test -- --watch=false` 綠燈
- [ ] `npm run build` 成功
- [ ] 三案 × 四斷點（375／768／1024／1440）截圖比對完成
- [ ] 所有視覺差異都能對應到一條明確決策
- [ ] 沒有新的硬編碼色碼、間距、斷點
- [ ] 新增 SCSS 檔已在 `src/styles.scss` 以 `@use` 引入
- [ ] 樣式寫在正確的 `@layer`
- [ ] 互動元素有可見文字或 `aria-label`
- [ ] 對比度符合 WCAG AA（以 `/#/design-system` 檢查，不靠目測）
- [ ] 圖示使用 `<app-symbol>`
- [ ] `/#/design-system` 對應區塊仍正確

## 驗證視覺回歸

沒有內建的視覺回歸測試。手動流程：

1. `npm run build`
2. 以靜態伺服器提供 `dist/website/browser`
3. **路由是 hash 模式**（`provideRouter(routes, withHashLocation())`），
   網址必須是 `/#/concept-b`。少了 `#/` 會落到 wildcard 路由被導回比較頁，
   截出來的是同一頁——重構期間曾因此誤判「零差異」。
4. 對 `/`、`/#/concept-a`、`/#/concept-b`、`/#/concept-c` 於四個寬度全頁截圖
5. 與改動前的建置逐像素比對；容差設 0，任何差異都要能解釋
