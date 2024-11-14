import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { fetchLogin } from "../../redux/fetchs/fetches";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchLogin({ email, password }));
  };
  return (
    <form onSubmit={handleLogin} className="auth">
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
