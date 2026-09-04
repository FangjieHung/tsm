import { routes } from './app.routes';

describe('application routes', () => {
  it('exposes comparison and both client concepts', () => {
    expect(routes.map((route) => route.path)).toEqual(['', 'concept-a', 'concept-b', '**']);
    expect(routes.slice(0, 3).every((route) => typeof route.loadComponent === 'function')).toBe(
      true,
    );
  });
});
