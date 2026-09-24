# TSM Design System

三案（A／B／C）共用一組 design token 與元件層。本目錄是「查與改」用的文件；
「看」請開 **`/#/design-system`** 展示頁（`npm start` 後於瀏覽器開啟）。

## 文件

| 檔案 | 內容 |
|---|---|
| [`architecture.md`](architecture.md) | 架構圖：東西放哪、改一個值會流到哪 |
| [`tokens.md`](tokens.md) | 顏色、間距、圓角 token 對照表與新增流程 |
| [`typography.md`](typography.md) | 字級階梯、角色分類、typography class |
| [`components.md`](components.md) | 元件清單、class 契約、原始碼位置 |
| [`conventions.md`](conventions.md) | `@layer` 判定、反模式、Code Review checklist |
| [`concept-briefs.md`](concept-briefs.md) | 三案的設計意圖與延伸開發規則（交接用） |
| [`production-readiness.md`](production-readiness.md) | 選定一案後還缺什麼 |
| [`known-issues.md`](known-issues.md) | 已知缺陷與尚未完成的遷移 |

## 檔案結構

```
src/
├─ styles.scss                 進入點，只有 @use
└─ styles/
   ├─ _layers.scss             @layer 順序宣告（唯一一處）
   ├─ _reset.scss              元素正規化
   ├─ _tokens.scss             ★ 顏色／間距／圓角 token
   ├─ _typography.scss         ★ 字級階梯與 typography class
   ├─ _components.scss         @forward components/
   ├─ components/
   │  ├─ _button.scss
   │  ├─ _section.scss
   │  └─ _link.scss
   ├─ _utilities.scss          sr-only、skip-link
   └─ _motion.scss             prefers-reduced-motion
```

新增 SCSS 檔後**必須**在 `src/styles.scss` 以 `@use` 引入，否則不會被 build 載入。

## 展示頁為什麼不會過期

`/#/design-system` 不是 token 的副本，是鏡子：

- **元件樣本**由專案本身的樣式表渲染。共用元件來自全域 `@layer components`；
  頁面層樣本則由該頁 `styleUrls` 直接引入 `concept-page.scss` 原檔。
- **token 名稱**以走訪 `document.styleSheets` 蒐集所有 `--tsm-*` 宣告得到，
  在 `_tokens.scss` 新增一個 token，展示頁自動出現，不需改展示頁一行程式碼。
- **數值**以 `getComputedStyle` 對套用主題的容器即時讀取。
- **字級表**回報瀏覽器實際解析出的 `font-size` / `line-height` / `letter-spacing`。

## 改一個 token

1. 編輯 `src/styles/_tokens.scss`，三個主題都要給值（即使值相同）。
2. `npm start`，開 `/#/design-system`，切換三案確認。
3. `npm run check:styles`、`npm test -- --watch=false` 與 `npm run build`。
4. 三案 × 四斷點（375／768／1024／1440）截圖比對。

## 驗證環境

Angular CLI 需要 Node.js 22.22.3 以上或 24.15 以上（見 `.nvmrc`：24.18.0）。
