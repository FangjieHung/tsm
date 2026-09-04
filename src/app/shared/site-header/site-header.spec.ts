import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SiteHeaderComponent } from './site-header';

describe('SiteHeaderComponent', () => {
  it('renders the exact logo, five primary links, and an accessible mobile menu', async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(SiteHeaderComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const logo = host.querySelector<HTMLImageElement>('img');
    expect(logo?.getAttribute('src')).toBe('/assets/logo/mark.webp');
    expect(logo?.getAttribute('alt')).toContain('台灣微生物學會');
    expect(host.querySelectorAll('[data-primary-nav] a')).toHaveLength(5);

    const menu = host.querySelector<HTMLButtonElement>('[data-menu-toggle]');
    expect(menu?.getAttribute('aria-controls')).toBe('primary-navigation');
    expect(menu?.getAttribute('aria-expanded')).toBe('false');
    menu?.click();
    fixture.detectChanges();
    expect(menu?.getAttribute('aria-expanded')).toBe('true');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(menu?.getAttribute('aria-expanded')).toBe('false');
  });
});
