import { Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface JwtPayload {
    id: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser | null;
    }
  }
}
