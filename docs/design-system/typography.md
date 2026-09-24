# 字體排印

定義於 **`src/styles/_typography.scss`**（`@layer base`）。分兩部分：

1. **字級階梯**——`--tsm-font-size-*` token，所有 SCSS 的 `font-size` 一律取用。
2. **Typography class**——`.tsm-display` 等，一個 class 同時帶入字級、行高、字重、字距，
   是**新程式碼的 API**。

live 檢視：`/#/design-system` 的「02 — 字體排印」。

## 角色分類

沿用 Material Design 3 的五個角色，另加兩個本專案實際需要的：

| 角色 | 用途 | 步階數 |
|---|---|---|
| **Display** | Hero 主標題、裝飾性巨型文字 | 9 |
| **Headline** | 區塊標題（`h2`）、頁尾字標 | 9 |
| **Title** | 卡片與列標題（`h3`） | 12 |
| **Figure** | 大型數字：區塊序號、活動日期 | 3 |
| **Body** | 內文、導言 | 7 |
| **Label** | 英文標籤、meta、日期、分類 | 4 |
| **Icon** | Material Symbols 光學尺寸（由 `font-size` 驅動） | 4 |

Figure 與 Icon 不在 MD3 分類中，但這個專案真的需要它們：大型數字有自己的字重與
tabular 對齊需求，而 Material Symbols 的尺寸是字級、不是寬高，混進 Body／Label
會讓兩者互相污染。

## 階梯與使用者

### Display

| Token | 值 | 用於 |
|---|---|---|
| `display-2xl` | `clamp(5rem, 2vw + 2rem, 7rem)` | C 案 hero 標題 |
| `display-2xl-md` | `clamp(2.1rem, 2.4vw + 1.5rem, 3rem)` | 同上，< 1200px |
| `display-2xl-sm` | `clamp(2rem, 9vw, 2.6rem)` | 同上，< 768px |
| `display-xl` | `clamp(54px, 5.6vw, 84px)` | A 案 hero 標題 |
| `display-xl-sm` | `clamp(42px, 12vw, 58px)` | 同上，< 768px |
| `display-lg` | `clamp(38px, 5.2vw, 78px)` | 方案比較頁主標題 |
| `display-md` | `clamp(42px, 4.3vw, 66px)` | B 案 hero 標題 |
| `display-md-sm` | `clamp(38px, 11vw, 52px)` | 同上，< 768px |
| `display-watermark` | `min(14vw, 15rem)` | C 案 hero 的裝飾性 ghost text |

### Headline

| Token | 值 | 用於 |
|---|---|---|
| `headline-xl` | `clamp(44px, 5vw, 70px)` | A／C 案區塊 `h2` |
| `headline-xl-sm` | `clamp(38px, 12vw, 52px)` | 同上，< 768px |
| `headline-lg` | `clamp(40px, 4.2vw, 62px)` | B 案區塊 `h2`（最新消息、會員、通用） |
| `headline-md` | `clamp(36px, 3.2vw, 50px)` | B 案次級區塊標題（活動、資源面板） |
| `headline-xs` | `clamp(30px, 3.4vw, 52px)` | 頁尾字標 |
| `headline-2xs` | `clamp(28px, 2.5vw, 42px)` | 方案比較頁卡片標題 |
| `headline-rail-lg` | `clamp(2.2rem, 1.8vw + 1.8rem, 3.6rem)` | C 案 sticky 左欄標籤（快速入口） |
| `headline-rail-md` | `clamp(2rem, 1.6vw + 1.6rem, 3.2rem)` | C 案 sticky 左欄標籤（最新消息） |
| `headline-mobile-xl` | `clamp(44px, 13vw, 60px)` | C 案會員區塊 `h2`，< 768px |

### Title

| Token | 值 | 用於 |
|---|---|---|
| `title-xl` | `clamp(27px, 2.3vw, 38px)` | 快速入口卡片 `h3` |
| `title-lg` | `clamp(24px, 2vw, 33px)` | 活動項目 `h3` |
| `title-md` | `clamp(24px, 2vw, 31px)` | B 案快速入口 `h3` |
| `title-md-alt` | `clamp(23px, 2vw, 31px)` | 消息項目 `h3` ⚠️ |
| `title-sm` | `clamp(22px, 1.8vw, 29px)` | 資源項目、B 案活動 `h3` |
| `title-sm-alt` | `clamp(22px, 1.8vw, 30px)` | C 案快速入口列 `h3` ⚠️ |
| `title-xs` | `clamp(21px, 1.8vw, 28px)` | 消息卡片 `h3` |
| `title-2xs` | `clamp(20px, 1.6vw, 26px)` | B 案會員卡片標題 |
| `title-2xs-alt` | `clamp(20px, 1.55vw, 25px)` | B 案資源面板 `h3` ⚠️ |
| `title-3xs` | `clamp(20px, 2vw, 24px)` | 會員卡片標題 |
| `title-footer` | `clamp(24px, 2.4vw, 38px)` | 頁尾學會名稱 |
| `title-footer-b` | `clamp(22px, 2.2vw, 32px)` | 同上，B 案 |

⚠️ 標記的 `-alt` 步階與上一階相差 1px 以內，是三案各自繪製留下的重複。
合併成本見 [`known-issues.md`](known-issues.md#字級階梯的合併候選)。

### Figure

| Token | 值 | 用於 |
|---|---|---|
| `figure-lg` | `clamp(54px, 5.2vw, 82px)` | B 案快速入口序號 |
| `figure-md` | `clamp(28px, 2.4vw, 40px)` | C 案列序號 |
| `figure-sm` | `clamp(26px, 2.4vw, 38px)` | B 案活動日期 |

### Body

| Token | 值 | 用於 |
|---|---|---|
| `body-xl` | `clamp(18px, 1.45vw, 22px)` | Hero 導言 |
| `body-lg-fluid` | `clamp(15px, 1.25vw, 19px)` | B 案活動圖說標題 |
| `body-md-fluid` | `clamp(15px, 1vw, 17px)` | C 案 hero 導言 |
| `body-lg` | `19px` | C 案頁尾導覽 |
| `body-md` | `18px` | 快速入口說明、比較頁內文 |
| `body-sm` | `17px` | 列內文、B 案 hero 內文、會員導言 |
| `body-xs` | `16px` | 會員卡片說明、B 案內文 |

### Label

| Token | 值 | 用於 |
|---|---|---|
| `label-lg` | `14px` | `.section-code`、C 案 `.swiss-number`、消息 meta、閱讀連結 |
| `label-md` | `13px` | 方案切換器、圖說 meta、頁尾 eyebrow |
| `label-sm` | `11px` | B 案資源面板標籤 |
| `label-xs` | `10px` | B 案 hero 的 `.section-code` |

### Icon

| Token | 值 | 用於 |
|---|---|---|
| `icon-xl` | `40px` | 快速入口卡片、會員卡片的主圖示 |
| `icon-lg` | `32px` | 列箭頭、資源卡片、B 案會員徽章 |
| `icon-md` | `24px` | 列標題與資源列圖示 |
| `icon-sm` | `20px` | 緊鄰文字的行內圖示、按鈕內圖示、箭頭 |

原本有 11 階（38／36／30／28／26／25／24／21／20／19／18px），是三案各自繪製的結果。
已收斂為 Material 光學尺寸的 4 階，最大位移 4px（36→40、28→32），
實測影響見 [`known-issues.md`](known-issues.md#icon-階梯收斂的實測結果)。

圖示尺寸由 `font-size` 驅動（Material Symbols 是字型），因此它與文字字級共用同一組
token 前綴，但**分屬不同角色**——調整內文字級不應該動到圖示。

## Step class

階梯的每一階都有一個同名 class，與 token **由同一份 SCSS map 產出**
（`$ladder`），兩者不可能不一致。

```html
<h3 class="tsm-title-xs">卡片標題</h3>
<p  class="tsm-body-sm">內文</p>
<b  class="tsm-label-lg">分類</b>
```

**class 只帶 `font-size`。** 行高、字重與字距是各案表達角色的方式，不是階的屬性——
三案的 label 角色就用了 8 種字距，其中 4 種在 B 案內部。綁進 class 等於抹平三案性格，
所以它們留在元件規則中。

### class 位於 `utilities` 層

掛一個步階 class 是明確指令，必須贏過元件的預設尺寸（例如 `.section-code` 的 14px），
所以 class 在 `@layer utilities`，token 在 `@layer base`。

### ⚠️ 什麼時候不能用步階 class

兩個限制，都來自實測：

**1. 未分層的樣式永遠贏過任何 class。** Angular 元件 SCSS 沒有 `@layer`，
所以只要有一條較廣的頁面規則設了 `font-size`（例如 `h2`、`.hero h1`），
掛在該元素上的步階 class 就不會生效。這類元素必須整條規則一起遷移，不能只掛 class。

**2. 共用標記上的步階 class 會說謊。** `concept-page.html` 大部分標記三案共用，
而每一案各自重設同一個元素的字級——例如 `.quick-item h3` 在 A 是 `title-xl`、
B 覆寫成 `title-md`。同一個 `<h3>` 掛任何一個步階 class，對其中一案就是錯的。

因此步階 class 目前只掛在**單一方案才會渲染**的標記上：

| 元素 | class | 只出現在 |
|---|---|---|
| B 案 hero 的 `.section-code` | `tsm-label-xs` | B |
| B 案 hero 導言 | `tsm-body-sm` | B |
| C 案快速入口列序號 | `tsm-figure-md` | C |
| C 案快速入口列 `h3` | `tsm-title-sm-alt` | C |
| C 案快速入口列說明 | `tsm-body-sm` | C |
| C 案消息卡 `h3` | `tsm-title-xs` | C |
| C 案消息卡分類與日期 | `tsm-label-lg` ×2 | C |
| C 案消息卡閱讀連結 | `tsm-label-lg` | C |

其餘標記仍由元素選擇器上字級——那才是誠實的做法。
**新寫的、單一方案的標記一律用 step class。**

## 行高、字重、字距

| Token | 值 |
|---|---|
| `--tsm-line-height-display` | `1.08` |
| `--tsm-line-height-headline` | `1.06` |
| `--tsm-line-height-title` | `1.2` |
| `--tsm-line-height-body` | `1.7` |
| `--tsm-line-height-label` | `1.4` |
| `--tsm-font-weight-regular` | `400` |
| `--tsm-font-weight-medium` | `600` |
| `--tsm-font-weight-semibold` | `650` |
| `--tsm-font-weight-bold` | `700` |
| `--tsm-tracking-display` | `-0.035em` |
| `--tsm-tracking-title` | `-0.02em` |
| `--tsm-tracking-body` | `normal` |
| `--tsm-tracking-label` | `0.15em` |
| `--tsm-tracking-label-wide` | `0.22em` |

這四組目前只有 typography class 在用；既有頁面的行高與字距仍是字面值，
屬同一批待遷移項目。

## 新增一個字級

**先確認現有步階不能用。** 這個階梯已經比成熟系統該有的步階多，
再加一階會讓收斂更難。若真的需要：

1. 在 `_typography.scss` 的對應角色區塊加入，並依大小排在正確位置
   （階梯是「由大到小」手寫排序的，展示頁直接沿用這個順序）。
2. 在本文件對應表格補一列。
3. 開 `/#/design-system` 確認新步階出現在正確角色下。
