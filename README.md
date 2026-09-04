# 台灣微生物學會官網 A／C 設計提案

以 Angular 22 standalone components 實作的響應式提案網站。A、C 兩案共用同一份內容與資訊架構，只改變視覺語言；學會 Logo 使用客戶提供的 `mark.webp` 原檔，未重新繪製或變更。

## 環境需求

- Node.js 22.12 以上；建議 Node.js 24 LTS
- npm 10 以上

## 啟動

```bash
npm install
npm start
```

開啟 <http://localhost:4200/>，由比較頁進入兩個版本：

- `/concept-a`：精密生技編輯風，冷白、霧灰、薄荷綠
- `/concept-c`：沉浸式實驗室藍，使用甲方指定的明亮藍色系

## 驗證與建置

```bash
npm test -- --watch=false
npm run build
```

正式版輸出至 `dist/website/browser/`。Angular CLI 的本機磁碟快取已在 `angular.json` 關閉，以避開部分 macOS 環境的 LMDB 原生快取錯誤；不影響正式輸出。

## 內容與素材

- 共用內容：`src/app/core/site-content.ts`
- A／C 共用語意頁面：`src/app/pages/concept/`
- 主題與響應式版面：`src/app/pages/concept/concept-page.scss`
- Logo：`public/assets/logo/mark.webp`
- A 案影像：`public/media/a/`
- C 案影像：`public/media/c/`
- Material Symbols：於 `src/index.html` 載入官方 Google Fonts 樣式

目前導覽與內容連結是提案用錨點，未串接會員、繳費、投稿或 CMS 後端。正式開發時可保留現有元件與內容模型，再接入 API 與實際路由。
