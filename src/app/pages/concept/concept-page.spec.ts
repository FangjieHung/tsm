import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { SITE_CONTENT } from '../../core/site-content';
import { ConceptPage } from './concept-page';

async function renderConcept(concept: 'a' | 'c'): Promise<HTMLElement> {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [ConceptPage],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { data: { concept } } },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ConceptPage);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('ConceptPage', () => {
  it.each(['a', 'c'] as const)(
    'renders concept %s with one H1 and the shared section order',
    async (concept) => {
      const host = await renderConcept(concept);
      expect(host.querySelectorAll('h1')).toHaveLength(1);
      expect(host.querySelector('h1')?.textContent?.trim()).toBe(SITE_CONTENT.hero.title);

      const sectionIds = [...host.querySelectorAll('main > section')]
        .map((section) => section.id)
        .filter(Boolean);
      expect(sectionIds).toEqual(['about', 'events', 'news', 'resources', 'membership']);

      const expectedTitles = [
        ...SITE_CONTENT.quickAccess.map((item) => item.title),
        ...SITE_CONTENT.events.map((item) => item.title),
        ...SITE_CONTENT.news.map((item) => item.title),
        ...SITE_CONTENT.resources.map((item) => item.title),
        ...SITE_CONTENT.memberActions.map((item) => item.title),
      ];
      const pageText = host.textContent ?? '';
      for (const title of expectedTitles) {
        expect(pageText).toContain(title);
      }
    },
  );

  it('protects external links opened in a new tab', async () => {
    const host = await renderConcept('a');
    const journal = host.querySelector<HTMLAnchorElement>('a[href="https://jmii.org/"]');
    expect(journal?.target).toBe('_blank');
    expect(journal?.rel).toBe('noopener noreferrer');
  });

  it('uses the dedicated C-concept membership artwork on mobile', async () => {
    const host = await renderConcept('c');
    const source = host.querySelector<HTMLSourceElement>(
      'source[media="(max-width: 767px)"]',
    );
    expect(source?.getAttribute('srcset')).toBe('/media/c/membership-mobile.webp');
  });
});
