import { routes } from './app.routes';

describe('application routes', () => {
  it('exposes comparison and all three client concepts', () => {
    expect(routes.map((route) => route.path)).toEqual([
      '',
      'concept-a',
      'concept-b',
      'concept-c',
      '**',
    ]);
    expect(routes.slice(0, 4).every((route) => typeof route.loadComponent === 'function')).toBe(
      true,
    );
  });

  it('maps B and C routes to their matching visual themes', () => {
    expect(routes.find((route) => route.path === 'concept-b')?.data?.['concept']).toBe('b');
    expect(routes.find((route) => route.path === 'concept-c')?.data?.['concept']).toBe('c');
  });
});
