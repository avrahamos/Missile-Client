import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { fetchRegister } from "../../redux/fetchs/fetches";
import { locationsList, organizationsList } from "../../utils/utils";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      fetchRegister({
        userName,
        email,
        password,
        organization,
        location,
      })
    );
  };
  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <select
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
      >
        <option value="">Select Organization</option>
        {organizationsList.map((org) => (
          <option key={org} value={org}>
            {org}
          </option>
        ))}
      </select>
      {organization === "IDF" && (
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          {locationsList.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      )}
      <button type="submit">Register</button>
    </form>
  );
}
