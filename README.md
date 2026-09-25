# 台灣微生物學會官網 A／B／C 設計提案

以 Angular 22 standalone components 實作的響應式提案網站。A、B、C 三案共用同一份內容與資訊架構，只改變視覺語言；學會 Logo 使用客戶提供的 `mark.webp` 原檔，未重新繪製或變更。

## 環境需求

- Node.js 22.12 以上；建議 Node.js 24 LTS
- npm 10 以上

## 啟動

```bash
npm install
npm start
```

開啟 <http://localhost:4200/>，由比較頁進入三個版本：

- `/concept-a`：精密生技編輯風，冷白、霧灰、薄荷綠
- `/concept-b`：親和科技風，柔和漸層與圓角語彙，使用甲方指定的明亮藍色系
- `/concept-c`：強黑實驗室風，瑞士國際主義排版，黑白高反差配單一強調色
- `/design-system`：三案共用的 design token 與元件層展示頁

## 驗證與建置

```bash
npm test -- --watch=false
npm run build
```

正式版輸出至 `dist/website/browser/`。Angular CLI 的本機磁碟快取已在 `angular.json` 關閉，以避開部分 macOS 環境的 LMDB 原生快取錯誤；不影響正式輸出。

## 獨立版型範本

`templates/` 下有三個自足的靜態 HTML 範本，各對應一個方案，雙擊即開、不需 build。
由 `npm run build:templates` 從實際建置的網站擷取產生，說明見
`templates/README.md`。

## 內容與素材

- Design token 與元件層：`src/styles/`（文件見 `docs/design-system/`）
- 共用內容：`src/app/core/site-content.ts`
- A／B／C 共用語意頁面：`src/app/pages/concept/`
- 主題與響應式版面：`src/app/pages/concept/concept-page.scss`
- Logo：`public/assets/logo/mark.webp`
- A 案影像：`public/media/a/`（`.webp`）
- B 案影像：`public/media/b/`（`.png`）
- C 案影像：`public/media/c/`（`.webp`）
- Material Symbols：於 `src/index.html` 載入官方 Google Fonts 樣式

目前導覽與內容連結是提案用錨點，未串接會員、繳費、投稿或 CMS 後端。正式開發時可保留現有元件與內容模型，再接入 API 與實際路由。
