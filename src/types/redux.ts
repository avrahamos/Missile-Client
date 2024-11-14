import { IUser } from "./user";

export enum DataStatus {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  IDLE = "IDLE",
}
export interface UserState {
  _id?: string;
  error: string | null;
  status: DataStatus;
  user: IUser | null;
}
