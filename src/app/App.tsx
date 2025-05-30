import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Signup } from "../pages/Signup";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { DefaultLayout } from "../layouts/DefaultLayout";
import NotFound from "../pages/NotFound";
import ProfilePage from "../pages/Profile";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import { verifyToken } from "../features/auth/auth.slice";
import type { JSX } from "@emotion/react/jsx-runtime";
import Toast from "../components/Toast";

const App = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const PublicRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? <Navigate to="/" replace /> : children;
  };

  useEffect(() => {
    if (token) {
      dispatch(verifyToken(token));
    }
  }, [dispatch, token]);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toast />
    </>
  );
};

export default App;
