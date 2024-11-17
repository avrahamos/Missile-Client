import { ActionReducerMapBuilder, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataStatus, UserState } from "../../types/redux";
import { IUser } from "../../types/user";
import { fetchLogin, fetchRegister, fetchUserProfile } from "../fetchs/fetches";
import { initialData } from "../initialData/initialSate";

const userSlice = createSlice({
  name: "user",
  initialState: initialData,
  reducers: {
    setIsUnderAttack: (state, action: PayloadAction<boolean>) => {
      state.isUnderAttack = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
        state.user = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        state.user = action.payload as IUser;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.payload as string;
        state.user = null;
      })
      .addCase(fetchRegister.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchRegister.fulfilled, (state) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        state.user = action.payload as IUser;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.payload as string;
      });
  },
});
export const { setIsUnderAttack } = userSlice.actions;
export default userSlice.reducer;
