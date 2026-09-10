import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { SITE_CONTENT } from '../../core/site-content';
import { ConceptPage } from './concept-page';

async function renderConcept(concept: 'a' | 'b' | 'c'): Promise<HTMLElement> {
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
  it.each(['a', 'b', 'c'] as const)(
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
    expect(source?.getAttribute('srcset')).toBe('media/c/membership-mobile.webp');
  });

  it('renders B with dedicated pale-blue collage media and a full concept switcher', async () => {
    const host = await renderConcept('b');
    expect(host.querySelector('img[src="media/b/hero.png"]')).not.toBeNull();
    expect(host.querySelector('img[src="media/b/researcher.png"]')).not.toBeNull();

    const switcherLinks = [...host.querySelectorAll<HTMLAnchorElement>('.concept-switcher a')].map(
      (link) => link.getAttribute('href'),
    );
    expect(switcherLinks).toEqual(expect.arrayContaining(['/', '/concept-a', '/concept-c']));
  });

  it('uses the dedicated B resource panel so its content can fill the paired media height', async () => {
    const host = await renderConcept('b');
    const resourcePanel = host.querySelector<HTMLElement>('#resources .b-resource-panel');
    expect(resourcePanel).not.toBeNull();
    expect(resourcePanel?.querySelectorAll('.resource-item')).toHaveLength(SITE_CONTENT.resources.length);
  });

  it('renders B-specific reference regions with complete data mappings', async () => {
    const host = await renderConcept('b');
    expect(host.querySelector('.b-hero-copy')).not.toBeNull();
    expect(host.querySelectorAll('.theme-b .quick-item')).toHaveLength(SITE_CONTENT.quickAccess.length);
    expect(host.querySelectorAll('.theme-b .event-item')).toHaveLength(SITE_CONTENT.events.length);
    expect(host.querySelectorAll('.theme-b .resource-item')).toHaveLength(SITE_CONTENT.resources.length);
    expect(host.querySelectorAll('.theme-b .news-item')).toHaveLength(SITE_CONTENT.news.length);
    expect(host.querySelectorAll('.theme-b .member-action')).toHaveLength(SITE_CONTENT.memberActions.length);

    const quickItems = host.querySelectorAll('.theme-b .quick-item');
    for (const item of quickItems) {
      expect(item.querySelector('.b-quick-visual > app-symbol')).not.toBeNull();
      expect(item.querySelector('.b-quick-arrow > app-symbol')).not.toBeNull();
      expect(item.querySelector('.b-quick-arrow .sr-only')?.textContent?.trim()).toBeTruthy();
    }
    expect(host.querySelectorAll('.theme-b .b-event-date')).toHaveLength(SITE_CONTENT.events.length);
    expect(host.querySelectorAll('.theme-b .b-resource-action')).toHaveLength(SITE_CONTENT.resources.length);
    expect(host.querySelectorAll('.theme-b .b-news-action')).toHaveLength(SITE_CONTENT.news.length);
    expect(host.querySelector('.theme-b .member-action--primary.b-member-featured')).not.toBeNull();
  });

  it('renders B event date rails and circular resource actions from every data item', async () => {
    const host = await renderConcept('b');

    const events = host.querySelectorAll<HTMLElement>('.theme-b .b-event-item');
    expect(events).toHaveLength(SITE_CONTENT.events.length);
    for (const event of events) {
      expect(event.querySelector(':scope > .b-event-date')).not.toBeNull();
      expect(event.querySelector('.b-event-body')).not.toBeNull();
      expect(event.querySelector('.b-event-description')?.textContent?.trim()).toBeTruthy();
    }

    const actions = host.querySelectorAll<HTMLAnchorElement>('.theme-b .b-resource-action');
    expect(actions).toHaveLength(SITE_CONTENT.resources.length);
    for (const action of actions) {
      expect(action.querySelector('app-symbol')).not.toBeNull();
      expect(action.querySelector('.sr-only')?.textContent?.trim()).toBeTruthy();
    }
    expect(host.querySelector('#resources img')?.getAttribute('src')).toBe('media/b/researcher.png');
    expect(host.querySelector('.theme-b .b-events-archive')).not.toBeNull();
    expect(host.querySelector('.theme-b .b-resource-lead')?.textContent?.trim()).toBeTruthy();
  });
});
