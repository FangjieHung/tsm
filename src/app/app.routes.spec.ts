import { routes } from './app.routes';

describe('application routes', () => {
  it('exposes comparison and all three client concepts', () => {
    expect(routes.map((route) => route.path)).toEqual([
      '',
      'concept-a',
      'concept-b',
      'concept-c',
      'design-system',
      '**',
    ]);
    expect(routes.slice(0, 5).every((route) => typeof route.loadComponent === 'function')).toBe(
      true,
    );
  });

  it('lazy-loads the design system page', () => {
    const route = routes.find((r) => r.path === 'design-system');
    expect(typeof route?.loadComponent).toBe('function');
  });

  it('maps B and C routes to their matching visual themes', () => {
    expect(routes.find((route) => route.path === 'concept-b')?.data?.['concept']).toBe('b');
    expect(routes.find((route) => route.path === 'concept-c')?.data?.['concept']).toBe('c');
  });
});
