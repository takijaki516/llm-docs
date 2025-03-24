declare module 'express' {
  interface Request {
    user: UserInfo;
  }
}

export interface UserInfo {
  id: number;
  email: string;
}
