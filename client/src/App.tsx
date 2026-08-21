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
import { Toaster } from "sonner";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
          element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
          }
          >
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reminders" element={<Reminders />} />

          </Route>

          <Route path="/" element={<Login />} />
        </Routes>

        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;