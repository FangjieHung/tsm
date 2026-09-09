import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ComparisonPage } from './comparison';

describe('ComparisonPage', () => {
  it('offers one clear link to each of the three client concepts', async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonPage],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(ComparisonPage);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text.match(/查看 A 方案/g)).toHaveLength(1);
    expect(text.match(/查看 B 方案/g)).toHaveLength(1);
    expect(text.match(/查看 C 方案/g)).toHaveLength(1);

    const hrefs = [...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a')].map(
      (link) => link.getAttribute('href'),
    );
    expect(hrefs).toEqual(expect.arrayContaining(['/concept-a', '/concept-b', '/concept-c']));
  });
});
