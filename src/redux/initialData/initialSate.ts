import { DataStatus, UserState } from "../../types/redux";

export const initialData: UserState = {
  error: null,
  status: DataStatus.IDLE,
  user: null,
};
