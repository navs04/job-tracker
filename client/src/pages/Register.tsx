import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      if (!err.response) setError("Can't reach the server. Is it running?");
      else setError(err.response?.data?.error || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Briefcase size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-ink">Job Tracker</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg border border-border">
          <h1 className="text-lg font-semibold text-ink mb-1">Create your account</h1>
          <p className="text-sm text-muted mb-6">Start tracking your job search today.</p>

          {error && (
            <div className="flex items-start gap-2 text-sm text-danger bg-danger-bg border border-danger/20 rounded-md px-3 py-2.5 mb-4">
              <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <label htmlFor="name" className="block text-xs font-medium text-muted mb-1.5">Name</label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mb-4" />

          <label htmlFor="email" className="block text-xs font-medium text-muted mb-1.5">Email</label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" />

          <label htmlFor="password" className="block text-xs font-medium text-muted mb-1.5">Password</label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mb-6" />

          <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating account..." : "Sign up"}
          </Button>

          <p className="mt-4 text-sm text-muted text-center">
            Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}