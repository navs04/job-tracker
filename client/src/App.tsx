import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import Pipeline from "./pages/Pipeline";

function DashboardPlaceholder() {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <p>Dashboard (built in Phase 8)</p>
      <p className="text-sm text-gray-500 mt-2">Logged in as {user?.email}</p>
      <a href="/applications" className="text-indigo-600 underline block mt-2">Go to Applications</a>
      <button onClick={logout} className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
        Log out
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
          path="/applications/:id"
          element={
          <ProtectedRoute>
            <ApplicationDetail />
          </ProtectedRoute>
          }
          />
          <Route path="/" element={<Login />} />
          <Route
          path="/pipeline"
          element={
          <ProtectedRoute>
            <Pipeline />
            </ProtectedRoute>
          }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;