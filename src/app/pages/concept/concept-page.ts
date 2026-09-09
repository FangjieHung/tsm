import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../core/site-content';
import { ContentStateComponent } from '../../shared/content-state/content-state';
import { RevealOnViewDirective } from '../../shared/reveal-on-view/reveal-on-view';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { SymbolComponent } from '../../shared/symbol/symbol';

type Concept = 'a' | 'b' | 'c';

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
  readonly concept = signal<Concept>(
    this.route.snapshot.data['concept'] === 'b' || this.route.snapshot.data['concept'] === 'c'
      ? this.route.snapshot.data['concept']
      : 'a',
  );
  readonly activeNews = signal(0);
  readonly failedImages = signal<ReadonlySet<string>>(new Set());
  protected readonly content = SITE_CONTENT;

  markImageFailed(key: string): void {
    this.failedImages.update((current) => new Set([...current, key]));
  }

  imageAvailable(key: string): boolean {
    return !this.failedImages().has(key);
  }

  mediaPath(key: 'events' | 'resources' | 'membership'): string {
    if (this.concept() === 'b') {
      const bMedia = {
        events: 'academic-events.png',
        resources: 'professional-resources.png',
        membership: 'laboratory-instrument.png',
      } as const;
      return `media/b/${bMedia[key]}`;
    }

    const legacyMedia = {
      events: 'academic-events.webp',
      resources: 'professional-resources.webp',
      membership: 'membership.webp',
    } as const;
    return `media/${this.concept()}/${legacyMedia[key]}`;
  }

  newsImage(index: number, fallback: string): string {
    if (this.concept() !== 'b') {
      return `media/${this.concept()}/${fallback}.webp`;
    }

    return ['media/b/latest-news.png', 'media/b/academic-events.png', 'media/b/professional-resources.png'][
      index % 3
    ];
  }
}
