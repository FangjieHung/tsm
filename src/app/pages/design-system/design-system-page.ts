import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SymbolComponent } from '../../shared/symbol/symbol';

type Concept = 'a' | 'b' | 'c';

interface TokenRow {
  readonly name: string;
  readonly value: string;
}

interface ColorRow extends TokenRow {
  readonly contrast: number | null;
  readonly grade: 'AAA' | 'AA' | 'AA Large' | 'Fail' | '—';
}

interface LadderRow extends TokenRow {
  /** display / headline / title / figure / body / label / icon */
  readonly role: string;
}

interface TypeRow {
  readonly label: string;
  readonly selector: string;
  readonly fontSize: string;
  readonly lineHeight: string;
  readonly weight: string;
  readonly tracking: string;
}

const CONCEPTS: readonly { key: Concept; name: string; tagline: string }[] = [
  { key: 'a', name: '學術典雅風', tagline: 'Editorial Minimalism' },
  { key: 'b', name: '親和科技風', tagline: 'Soft Biotech' },
  { key: 'c', name: '強黑實驗室風', tagline: 'Bold Dark Editorial' },
];

/** sRGB relative luminance, per WCAG 2.1. */
function luminance(rgb: readonly [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function parseColor(value: string): [number, number, number] | null {
  const m = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  const hex = value.trim().replace('#', '');
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
  }
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return [0, 1, 2].map((i) => parseInt(hex[i] + hex[i], 16)) as [number, number, number];
  }
  return null;
}

function contrastRatio(a: string, b: string): number | null {
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return null;
  const la = luminance(ca);
  const lb = luminance(cb);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

@Component({
  selector: 'app-design-system-page',
  imports: [RouterLink, SymbolComponent],
  templateUrl: './design-system-page.html',
  // The concept pages' stylesheet is pulled in verbatim so every specimen below
  // is rendered by the exact rules that render the real site — this page mirrors
  // the code rather than restating it. Shared components (button, section, link)
  // already live in the global component layer and arrive without this import.
  styleUrls: ['../concept/concept-page.scss', './design-system-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignSystemPage {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');

  readonly concepts = CONCEPTS;
  readonly concept = signal<Concept>('a');
  /** Bumped after the theme changes so the computed-value readers re-run. */
  private readonly revision = signal(0);

  readonly activeConcept = computed(
    () => CONCEPTS.find((c) => c.key === this.concept()) ?? CONCEPTS[0],
  );

  constructor() {
    afterNextRender(() => this.measureType());
  }

  select(concept: Concept): void {
    this.concept.set(concept);
    this.revision.update((n) => n + 1);
    // Re-read after the theme class has been applied and styles recalculated.
    setTimeout(() => this.measureType());
  }

  /**
   * Token names are read out of the stylesheets themselves, so a token added to
   * _tokens.scss shows up here without anyone editing this page.
   */
  private tokenNames(prefix: string, sort = true): string[] {
    const names = new Set<string>();
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // cross-origin (Google Fonts)
      }
      this.collect(rules, prefix, names);
    }
    // The type ladder is authored largest-first, and that order carries meaning,
    // so it is kept as declared; numeric scales are sorted numerically.
    return sort ? [...names].sort((a, b) => this.sortToken(a, b)) : [...names];
  }

  private collect(rules: CSSRuleList, prefix: string, into: Set<string>): void {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        if (!/(:root|\.theme-[abc])/.test(rule.selectorText)) continue;
        for (const prop of Array.from(rule.style)) {
          if (prop.startsWith(prefix)) into.add(prop);
        }
      } else if ('cssRules' in rule) {
        this.collect((rule as CSSGroupingRule).cssRules, prefix, into);
      }
    }
  }

  /** Numeric suffixes sort numerically (space-8 before space-10). */
  private sortToken(a: string, b: string): number {
    const na = Number(a.match(/(\d+)$/)?.[1]);
    const nb = Number(b.match(/(\d+)$/)?.[1]);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  }

  private read(name: string): string {
    const el = this.stage()?.nativeElement;
    if (!el) return '';
    return getComputedStyle(el).getPropertyValue(name).trim();
  }

  readonly colorTokens = computed<ColorRow[]>(() => {
    this.revision();
    const surface = this.read('--tsm-color-surface') || '#ffffff';
    const accent = this.read('--tsm-color-accent');
    return this.tokenNames('--tsm-color-').map((name) => {
      const value = this.read(name);
      // Only text tokens get a contrast reading, and each is measured against
      // the surface it is actually painted on. A ratio for a rule or fill
      // colour would be a number nobody should act on.
      const onSurface = /-ink$|-ink-muted$|-ink-subtle$|-ink-faint$|-link$/.test(name);
      const onAccent = /-ink-inverse$|-accent-ink$/.test(name);
      const ratio = onSurface || onAccent ? contrastRatio(value, onAccent ? accent : surface) : null;
      const grade: ColorRow['grade'] =
        ratio === null ? '—' : ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail';
      return { name, value, contrast: ratio, grade };
    });
  });

  readonly spaceTokens = computed<TokenRow[]>(() => {
    this.revision();
    return this.tokenNames('--tsm-space-').map((name) => ({ name, value: this.read(name) }));
  });

  /** The type ladder, grouped by role, read straight out of the stylesheets. */
  readonly fontSizeTokens = computed<LadderRow[]>(() => {
    this.revision();
    return this.tokenNames('--tsm-font-size-', false).map((name) => ({
      name,
      value: this.read(name),
      role: name.replace('--tsm-font-size-', '').split('-')[0],
    }));
  });

  readonly fontSizeRoles = computed<string[]>(() => [
    ...new Set(this.fontSizeTokens().map((t) => t.role)),
  ]);

  tokensForRole(role: string): LadderRow[] {
    return this.fontSizeTokens().filter((t) => t.role === role);
  }

  readonly radiusTokens = computed<TokenRow[]>(() => {
    this.revision();
    return this.tokenNames('--tsm-radius-').map((name) => ({ name, value: this.read(name) }));
  });

  readonly typeSpecimens = signal<TypeRow[]>([]);

  /** Reads back what the browser actually resolved for each rendered specimen. */
  measureType(): void {
    const root = this.host.nativeElement as HTMLElement;
    const rows: TypeRow[] = [];
    for (const el of Array.from(root.querySelectorAll<HTMLElement>('[data-type-specimen]'))) {
      const s = getComputedStyle(el);
      rows.push({
        label: el.dataset['typeSpecimen'] ?? '',
        selector: el.dataset['typeSelector'] ?? '',
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        weight: s.fontWeight,
        tracking: s.letterSpacing,
      });
    }
    this.typeSpecimens.set(rows);
  }

  formatContrast(value: number | null): string {
    return value === null ? '—' : `${value.toFixed(2)}:1`;
  }
}
