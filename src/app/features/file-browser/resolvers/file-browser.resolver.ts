import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { inject } from '@angular/core';

import { User } from '@core/models';
import { map } from 'rxjs';
import { FolderNode } from '../model';
import { FileBrowserMapperService, FileBrowserMockApiService } from '../services';

export const fileBrowserResolver: ResolveFn<FolderNode[]> = (route: ActivatedRouteSnapshot) => {
  const fileBrowserMockApiService = inject(FileBrowserMockApiService);
  const fileBrowserMapperService = inject(FileBrowserMapperService);

  const currentUser: User = route.parent?.data['user'];

  return fileBrowserMockApiService
    .getFolderNodes()
    .pipe(map((nodesDto) => fileBrowserMapperService.mapFrom({ dto: nodesDto, currentUser })));
};
