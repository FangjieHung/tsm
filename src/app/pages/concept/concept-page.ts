import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../core/site-content';
import { ContentStateComponent } from '../../shared/content-state/content-state';
import { RevealOnViewDirective } from '../../shared/reveal-on-view/reveal-on-view';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { SymbolComponent } from '../../shared/symbol/symbol';

type Concept = 'a' | 'c';

@Component({
  selector: 'app-concept-page',
  imports: [
    RouterLink,
    ContentStateComponent,
    RevealOnViewDirective,
    SiteFooterComponent,
    SiteHeaderComponent,
    SymbolComponent,
  ],
  templateUrl: './concept-page.html',
  styleUrl: './concept-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptPage {
  private readonly route = inject(ActivatedRoute);
  readonly concept = signal<Concept>(this.route.snapshot.data['concept'] === 'c' ? 'c' : 'a');
  readonly activeNews = signal(0);
  readonly failedImages = signal<ReadonlySet<string>>(new Set());
  protected readonly content = SITE_CONTENT;

  markImageFailed(key: string): void {
    this.failedImages.update((current) => new Set([...current, key]));
  }

  imageAvailable(key: string): boolean {
    return !this.failedImages().has(key);
  }
}
