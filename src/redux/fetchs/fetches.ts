import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLogin = createAsyncThunk(
  "user/login",
  async (user: { email: string; password: string }, thunkApi) => {
    try {
      const res = await fetch("http://localhost:5678/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        const errorText = await res.text();
        return thunkApi.rejectWithValue(`Error: ${errorText}`);
      }
      const data = await res.json();
      if (data.token) localStorage.setItem("authorization", data.token);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue("Can't login, please try again");
    }
  }
);
export const fetchRegister = createAsyncThunk(
  "user/register",
  async (
    user: {
      userName: string;
      email: string;
      password: string;
      organization: string;
      location?: string;
    },
    thunkApi
  ) => {
    try {
      const res = await fetch("http://localhost:5678/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        const errorText = await res.text();
        return thunkApi.rejectWithValue(`Error: ${errorText}`);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue("Can't register, please try again");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/profile",
  async (_, thunkApi) => {
    try {
      const token = localStorage.getItem("authorization");
      if (!token) {
        return thunkApi.rejectWithValue("Token is not available");
      }

      const res = await fetch("http://localhost:5678/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        return thunkApi.rejectWithValue(`Error: ${errorText}`);
      }

      const user = await res.json();
      return user;
    } catch (error) {
      return thunkApi.rejectWithValue("Failed to fetch user profile");
    }
  }
);
