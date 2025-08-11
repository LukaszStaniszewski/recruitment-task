import { Injectable, signal } from '@angular/core';
import { User, UserId } from '@core/models';
import { BehaviorSubject, map, Observable } from 'rxjs';

const Users = [
  { id: UserId.Admin, name: 'Admin' },
  { id: UserId.User1, name: 'User1' },
  { id: UserId.User2, name: 'User2' },
];

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly user$$ = new BehaviorSubject<User>(Users[Math.floor(Math.random() * Users.length)]);

  getUser(): Observable<User> {
    return this.user$$.asObservable();
  }
}
