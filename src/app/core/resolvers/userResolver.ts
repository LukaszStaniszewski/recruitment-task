import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { User } from '@core/models';
import { UserService } from '@core/services';

export const userResolver: ResolveFn<User | undefined> = () => {
  const userService = inject(UserService);
  return userService.getRandomUser();
};
