import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-symbol',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'symbol-host' },
  template: `
    <span
      class="material-symbols-outlined"
      [attr.aria-hidden]="decorative() ? 'true' : null"
      [attr.aria-label]="decorative() ? null : label()"
    >{{ name() }}</span>
  `,
  styles: `
    :host { display: inline-grid; place-items: center; line-height: 1; }
    .material-symbols-outlined { font-size: inherit; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  `,
})
export class SymbolComponent {
  readonly name = input.required<string>();
  readonly decorative = input(true);
  readonly label = input('');
}
