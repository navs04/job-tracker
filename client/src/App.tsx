import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider} from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import Pipeline from "./pages/Pipeline";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Reminders from "./pages/Reminders";

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
                <Dashboard />
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
          <Route
          path="/analytics"
          element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
          }
          />
          <Route
          path="/reminders"
          element={
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
          }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;