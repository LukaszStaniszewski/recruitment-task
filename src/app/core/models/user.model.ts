export interface User {
  id: UserId;
  name: string;
}

export enum UserId {
  Admin = 1,
  User1 = 2,
  User2 = 3,
}
