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
          element={<Navigate to={token ? "/dashboard" : "/login"} />}
        />

        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/register"
          element={token ? <Navigate to="/dashboard" /> : <Register />}
        />

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
