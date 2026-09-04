import { TestBed } from '@angular/core/testing';
import { ContentStateComponent } from './content-state';

describe('ContentStateComponent', () => {
  it('announces the supplied empty-state message', async () => {
    await TestBed.configureTestingModule({ imports: [ContentStateComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ContentStateComponent);
    fixture.componentRef.setInput('message', '目前尚無最新消息');
    fixture.detectChanges();

    const status = (fixture.nativeElement as HTMLElement).querySelector('[role="status"]');
    expect(status?.textContent).toContain('目前尚無最新消息');
  });
});
