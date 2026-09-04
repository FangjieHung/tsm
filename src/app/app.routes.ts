import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: '台灣微生物學會｜網站設計方案',
    loadComponent: () =>
      import('./pages/comparison/comparison').then((module) => module.ComparisonPage),
  },
  {
    path: 'concept-a',
    title: 'A 方案｜台灣微生物學會',
    data: { concept: 'a' },
    loadComponent: () =>
      import('./pages/concept/concept-page').then((module) => module.ConceptPage),
  },
  {
    path: 'concept-c',
    title: 'C 方案｜台灣微生物學會',
    data: { concept: 'c' },
    loadComponent: () =>
      import('./pages/concept/concept-page').then((module) => module.ConceptPage),
  },
  { path: '**', redirectTo: '' },
];
