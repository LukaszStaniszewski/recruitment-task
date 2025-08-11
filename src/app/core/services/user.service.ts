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
  // constructor() {
  //   const randomUser = Users[Math.floor(Math.random() * Users.length)];
  //   this.user$$.next(randomUser);
  // }
  private readonly user$$ = new BehaviorSubject<User | undefined>(Users[Math.floor(Math.random() * Users.length)]);

  // private users$$ = new BehaviorSubject<User[]>([
  //   { id: UserId.Admin, name: 'Admin' },
  //   { id: UserId.User1, name: 'User1' },
  //   { id: UserId.User2, name: 'User2' },
  // ]);

  getUser(id: number): Observable<User | undefined> {
    // return this.user$$.asObservable().pipe(map((users) => users.find((user) => user.id === id)));
    return this.user$$.asObservable();
  }

  getRandomUser(): Observable<User | undefined> {
    // return this.user$$.asObservable().pipe(map((users) => users.find((user) => user.id === id)));
    return this.user$$.asObservable();
  }

  // getUser(id: number): Observable<User | undefined> {
  //   return this.users$$.asObservable().pipe(map((users) => users.find((user) => user.id === id)));
  // }

  // getRandomUser(): Observable<User | undefined> {
  //   return this.getUser(Math.floor(Math.random() * 3) + 1);
  // }
}
