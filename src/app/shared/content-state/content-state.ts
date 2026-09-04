import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SymbolComponent } from '../symbol/symbol';

@Component({
  selector: 'app-content-state',
  imports: [SymbolComponent],
  template: `
    <div class="content-state" role="status">
      <app-symbol name="science" />
      <p>{{ message() }}</p>
    </div>
  `,
  styles: `
    .content-state { min-height: 180px; padding: 32px; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; color: var(--text-muted); border: 1px dashed var(--line); border-radius: var(--radius-md); }
    app-symbol { font-size: 34px; color: var(--link); }
    p { margin: 0; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentStateComponent {
  readonly message = input.required<string>();
}
