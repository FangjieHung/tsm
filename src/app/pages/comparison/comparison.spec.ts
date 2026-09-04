import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ComparisonPage } from './comparison';

describe('ComparisonPage', () => {
  it('offers one clear link to each client concept', async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonPage],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(ComparisonPage);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text.match(/查看 A 方案/g)).toHaveLength(1);
    expect(text.match(/查看 B 方案/g)).toHaveLength(1);
  });
});
