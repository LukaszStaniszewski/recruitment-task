import { Routes } from '@angular/router';
import { userResolver } from '@core/resolvers';
import { FileBrowserPage } from '@features/file-browser';
import { fileBrowserResolver } from '@features/file-browser';
import { LayoutPage } from '@layout/layout.page';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPage,
    resolve: {
      user: userResolver,
    },
    children: [
      {
        path: '',
        loadComponent: () => import('@features/file-browser').then((m) => m.FileBrowserPage),
        resolve: {
          fileNodes: fileBrowserResolver,
        },
      },
    ],
  },
];
