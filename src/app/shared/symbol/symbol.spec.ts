import { TestBed } from '@angular/core/testing';
import { SymbolComponent } from './symbol';

describe('SymbolComponent', () => {
  it('renders a decorative Material Symbols ligature by default', async () => {
    await TestBed.configureTestingModule({ imports: [SymbolComponent] }).compileComponents();
    const fixture = TestBed.createComponent(SymbolComponent);
    fixture.componentRef.setInput('name', 'arrow_forward');
    fixture.detectChanges();

    const symbol = fixture.nativeElement.querySelector('.material-symbols-outlined') as HTMLElement;
    expect(symbol.textContent?.trim()).toBe('arrow_forward');
    expect(symbol.getAttribute('aria-hidden')).toBe('true');
  });
});
