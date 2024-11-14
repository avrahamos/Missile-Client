import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import Dashboard from "./component/page/Dashboard";
import { Navigate, Route, Routes } from "react-router-dom";


function App() {
  const token = localStorage.getItem("authorization");

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
