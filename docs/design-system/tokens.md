# Design Token

所有 token 定義於 **`src/styles/_tokens.scss`**，位於 `@layer base`。
token 是 CSS 自訂屬性，會沿 DOM 繼承，因此主題只要掛在容器上
（`.theme-a` / `.theme-b` / `.theme-c`），底下所有元素——包含使用
emulated encapsulation 的子元件——都會取到正確的值。

## 命名規則

```
--tsm-<類別>-<語意>[-<階層>]
```

- 前綴 `--tsm-` 避免與未來引入的第三方樣式衝突。
- 類別：`color` / `space` / `radius` / `container`。
- **每個 token 在三個主題都必須有值**，即使當下三者相同。少寫一個，
  該主題會沿用 `:root` 或繼承到別處的值，這正是重構前 A 案沒有自己
  token 列的原因。

## 顏色

| Token | 語意 | A | B | C |
|---|---|---|---|---|
| `--tsm-color-surface` | 頁面主表面 | `#ffffff` | `#ffffff` | `#ffffff` |
| `--tsm-color-surface-muted` | 次要表面 | `#ffffff` | `#ffffff` | `#ffffff` |
| `--tsm-color-surface-sunken` | 下凹區塊／卡片底 | `#ffffff` | `#eaf6f9` | `#ffffff` |
| `--tsm-color-surface-accent` | 強調區塊底 | `#ffffff` | `#e8f6fe` | `#000000` |
| `--tsm-color-ink` | 主文字 | `#223033` | `#082a45` | `#000000` |
| `--tsm-color-ink-muted` | 次要文字 | `#5a696d` | `#4d7477` | `#3a3a3a` |
| `--tsm-color-ink-subtle` | B 案內文灰藍 | `#5a696d` | `#587887` | `#3a3a3a` |
| `--tsm-color-ink-faint` | 最弱：meta、日期、序號 | `#5a696d` | `#6a8ea1` | `#3a3a3a` |
| `--tsm-color-ink-inverse` | 反白文字 | `#ffffff` | `#ffffff` | `#ffffff` |
| `--tsm-color-line` | 分隔線 | `#c5dce3` | `#c5dce3` | `#000000` |
| `--tsm-color-line-soft` | 卡片與媒體框線 | `#c5dce3` | `#d3e8ed` | `#000000` |
| `--tsm-color-line-subtle` | 列表列間細線 | `#c5dce3` | `#cfe4e9` | `#000000` |
| `--tsm-color-accent` | 品牌強調色 | `#0f8db2` | `#0f8db2` | `#0f8db2` |
| `--tsm-color-accent-deep` | 強調色深階（hover） | `#086a84` | `#086a84` | `#086a84` |
| `--tsm-color-accent-ink` | 強調色上的文字 | `#ffffff` | `#ffffff` | `#ffffff` |
| `--tsm-color-link` | 連結 | `#086a84` | `#086a84` | `#086a84` |
| `--tsm-color-focus` | Focus ring | `#0f8db2` | `#0f8db2` | `#0f8db2` |

`:root` 另外持有 `--tsm-color-accent` / `-accent-deep` / `-accent-ink` /
`-surface` / `-ink-inverse` 作為**未套用主題時**的預設值——方案比較頁
（`/`）不在任何主題容器內。`:root` 的 `--tsm-color-focus` 是 `#f59e0b`，
只有比較頁會用到。

### 對比度

以 `/#/design-system` 的色彩區塊即時檢查，不要靠人工稽核。目前值得注意：

| Token | 主題 | 對白底 | 判定 |
|---|---|---|---|
| `--tsm-color-ink-faint` | B | 3.50:1 | **僅適用大字**，不可用於一般內文 |
| `--tsm-color-accent` | 全部 | 3.84:1 | 作為底色使用；白字置於其上為 3.84:1，同樣僅適用大字 |

### 近似色收斂紀錄

重構時只合併語意相同且視覺無法分辨的鄰近色，其餘保留原值：

| 原色碼 | 收斂為 | 最大單通道差 |
|---|---|---|
| `#eaf6fb` | `--tsm-color-surface-sunken` (`#eaf6f9`) | 2 |
| `#e1f0f4` | `--tsm-color-surface-sunken` | 9 |
| `#c9e5eb`、`#c9e0e7` | `--tsm-color-line-subtle` (`#cfe4e9`) | 6 |

`#c9e5e2`、`#a9d5d2`、`#9ed4e0`、`#7f9aa9`、`#315b70` 等單點使用的漸層節點
**未**收斂，色相與主色階不同，強行合併會改變視覺。

## 間距

`--tsm-space-<px>`，名稱即像素值（`--tsm-space-18` 就是 18px）。

三案是以 **2px 節奏**繪製的，不是 4px：重構前 183 筆間距宣告中有 84 筆不在
4px 格線上，其中 18px、14px、22px 是最常用的間距之一。因此：

- **32px 以下**每 2px 一階：2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32
- **32px 以上**每 4px 一階：36, 40, 44, 48, 52, 56, 60, 64, 72, 80

重構時 13 筆奇數值被吸附到最近一階，位移皆 ≤1px
（5→4、7→6 ×2、9→8 ×3、11→10、13→12 ×3、15→14、17→16 ×2）。
6 筆距離階梯超過 1px 的值（34、38、42 ×3、54）維持字面值，見 `known-issues.md`。

## 圓角

| Token | A | B | C |
|---|---|---|---|
| `--tsm-radius-sm` | `12px` | `999px` | `0` |
| `--tsm-radius-md` | `18px` | `22px` | `0` |
| `--tsm-radius-lg` | `28px` | `30px` | `0` |

## 版面

| Token | 值 |
|---|---|
| `--tsm-container` | `1392px` |

## 字體家族

定義在各主題的 `font-family`，非獨立 token：

| 主題 | 字體 |
|---|---|
| A | `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans TC", …` |
| B | 繼承 `:root` 的 `"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif` |
| C | `"Inter", "Noto Sans TC", ui-sans-serif, …` |

> ⚠️ A 案的堆疊是刻意釘死的。C 案導入 Inter 之前，`:root` 的堆疊把 `Inter`
> 排在最前但從未真的載入，A 案一直以 system-ui fallback 渲染。Inter 成為可載入
> 字體後，若不釘死 A 案，其字體會整個位移。`_tokens.scss` 中該註解不可刪除。

## 新增一個 token

1. 確認現有 token 真的沒有相同語意的（別為了 1px 差異新增一階）。
2. 在 `_tokens.scss` 的**三個主題**都加上定義。
3. 需要在未套用主題處使用時，同時在 `:root` 給一個中性預設值。
4. 開 `/#/design-system` 確認三案都出現且值正確。
