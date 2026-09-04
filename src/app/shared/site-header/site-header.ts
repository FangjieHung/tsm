import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../core/site-content';
import { SymbolComponent } from '../symbol/symbol';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, SymbolComponent],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderComponent {
  readonly concept = input<'a' | 'c'>('a');
  readonly menuOpen = signal(false);
  protected readonly content = SITE_CONTENT;

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
