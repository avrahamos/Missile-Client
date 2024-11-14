import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import Dashboard from "./component/page/Dashboard";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const token = localStorage.getItem("authorization");

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/register" />}
        />
      </Routes>
    </>
  );
}

export default App;
