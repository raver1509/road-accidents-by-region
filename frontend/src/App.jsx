import "./styles/styles.css";
import MainPage from "./MainPage.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./SignUpPage";
import { useQuery } from "@tanstack/react-query";
import LogInPage from "./LogInPage";
import { Toaster } from "react-hot-toast";


function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          credentials: "include", // Include credentials in the request
        });
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  console.log(authUser);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <MainPage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <LogInPage /> : <Navigate to="/" />}
        ></Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
