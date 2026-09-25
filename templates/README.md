# 三案獨立版型範本

三個彼此獨立、**雙擊即開**的靜態 HTML 範本，各自對應一個視覺方案。
不需要 Node、不需要 build、不需要網路（字型除外）。

| 資料夾 | 方案 | 風格 |
|---|---|---|
| [`concept-a/`](concept-a/index.html) | A | 學術典雅風（Editorial Minimalism） |
| [`concept-b/`](concept-b/index.html) | B | 親和科技風（Soft Biotech） |
| [`concept-c/`](concept-c/index.html) | C | 強黑實驗室風（Bold Dark Editorial） |

每個資料夾都是自足的：

```
concept-a/
├─ index.html      單一檔案，CSS 內嵌於 <style>
├─ media/a/        該案影像
├─ assets/logo/    學會標誌
└─ favicon.ico
```

整個資料夾複製走就能用，路徑全部相對。

## 這些檔案是怎麼來的

不是手抄的。`scripts/build-templates.mjs` 會開啟實際建置出來的網站，
擷取渲染後的 DOM 與瀏覽器真正載入的 CSS，再做四件清理：

1. 移除 Angular 的 view encapsulation 屬性，選擇器同步還原
2. 丟掉另外兩案的主題規則，只留這一案需要的 CSS
3. 移除進場動畫（`reveal-on-view`）——它需要 JavaScript 才會加上 `is-visible`，
   直接開檔時內容會停在 `opacity: 0`
4. `:host` 選擇器改寫成對應的元素標籤

因此範本**不可能與網站本體脫節**：改了 `src/`，重跑產生器就同步。

### 重新產生

```bash
npm run build          # 先建置網站
npm run build:templates
```

產生器需要 Playwright（`npm i -D playwright`）。範本本身已進版控，
所以只有要重新產生時才需要安裝。

產生器會在三種情況下直接失敗，而不是產出壞掉的範本：

- 有巢狀的互動元素（`<a>` 包 `<a>`）——HTML 解析器會把它拆成兩個元素
- 有 `:host` 規則找不到對應的元素標籤
- 清理後出現懸空的選擇器（例如 `.card > `）

## 與網站本體的差異

四個寬度（375／768／1024／1440）逐像素比對的結果：

| 方案 | 像素差異 | 頁高差 |
|---|---|---|
| A | 0.14% | ≤ 4px |
| B | 0.23–0.65% | 0 |
| C | 0.28–0.63% | ≤ 4px |

殘差來自沒有 JavaScript 的部分：C 案固定定位的顆粒膜在長截圖中的貼齊方式，
以及少數依賴進場動畫的次像素位移。版面、字級、顏色、間距完全一致。

## 這些範本不包含什麼

- **沒有 JavaScript。** 行動版的選單開合、消息卡的 hover 切換、進場動畫都不會運作。
  導覽列的漢堡按鈕在行動尺寸會出現但按下無反應。
- **沒有路由。** 所有連結都是頁內錨點，與提案網站相同。
- **只有首頁版型。** 專案目前只設計了首頁一種版型。

## 要改樣式的話

CSS 全部內嵌在 `<style>` 裡，最上方是 design token：

```css
:root { --tsm-space-16: 16px; ... }
.theme-a { --tsm-color-accent: #0f8db2; --tsm-color-ink: #223033; ... }
```

改一個 token 就會全檔同步。完整的 token 對照、命名規則與各案的設計意圖，
見 [`docs/design-system/`](../docs/design-system/README.md)——
特別是 [`concept-briefs.md`](../docs/design-system/concept-briefs.md)
說明了每一案「不要做什麼」。

## 已知問題

`index.html` 載入的字型只有 `wght@400;500;700;900`，但樣式用到 9 種字重，
其中 600（最常用）、650、750、620、300、200 都沒有對應的字型實例，
瀏覽器會以最接近的已載入字重或合成字重呈現。這是從網站本體帶過來的問題，
處理方式見 [`production-readiness.md`](../docs/design-system/production-readiness.md)。

## 體積

`templates/` 約 18MB，其中 B 案影像佔 13MB（`.png` 未轉 `.webp`）。
這是「每個資料夾自足」的代價；若不需要各自獨立，可改為共用 `public/media/`。
