declare module 'express' {
  interface Request {
    user: UserInfo;
  }
}

export interface UserInfo {
  email: string;
}
