import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DesignSystemPage } from './design-system-page';

describe('DesignSystemPage', () => {
  let fixture: ComponentFixture<DesignSystemPage>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignSystemPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignSystemPage);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  it('offers one switcher button per concept', () => {
    const buttons = host.querySelectorAll('.ds-switcher button');
    expect(buttons).toHaveLength(3);
    expect([...buttons].map((b) => b.textContent?.trim().slice(0, 1))).toEqual(['A', 'B', 'C']);
  });

  it('starts on concept A and applies the matching theme class to the stage', () => {
    expect(fixture.componentInstance.concept()).toBe('a');
    expect(host.querySelector('.ds-stage')?.classList.contains('theme-a')).toBe(true);
  });

  it('swaps the stage theme when another concept is selected', () => {
    fixture.componentInstance.select('c');
    fixture.detectChanges();

    const stage = host.querySelector('.ds-stage');
    expect(stage?.classList.contains('theme-c')).toBe(true);
    expect(stage?.classList.contains('theme-a')).toBe(false);
  });

  it('renders every section of the system', () => {
    const headings = [...host.querySelectorAll('.ds-section > h2')].map((h) =>
      h.textContent?.trim(),
    );
    expect(headings).toHaveLength(5);
    expect(headings[0]).toContain('色彩');
  });

  it('marks a missing contrast reading rather than printing a bogus ratio', () => {
    expect(fixture.componentInstance.formatContrast(null)).toBe('—');
    expect(fixture.componentInstance.formatContrast(4.5)).toBe('4.50:1');
  });

  it('keeps the concept page markup it documents in sync', () => {
    // The specimens are rendered with the real class names; if a component is
    // renamed in concept-page.scss these selectors are where it shows up first.
    expect(host.querySelector('.button.button--primary')).not.toBeNull();
    expect(host.querySelector('.button.button--secondary')).not.toBeNull();
    expect(host.querySelector('.text-link')).not.toBeNull();
    expect(host.querySelector('.section-code')).not.toBeNull();
    expect(host.querySelector('.quick-grid .quick-item')).not.toBeNull();
  });
});
