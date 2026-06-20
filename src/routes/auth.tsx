import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { LogIn, Mail, Lock, Chrome, ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import authPanel from "@/assets/auth-panel.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — ProspectMaster" },
      { name: "description", content: "Sign in or create your ProspectMaster account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate({ to: "/dashboard" });
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (signUpError) throw signUpError;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (!result.redirected) {
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      {/* Left visual panel */}
      <div className="relative hidden lg:block overflow-hidden" style={{ background: "#0E1116" }}>
        <img
          src={authPanel}
          alt="ProspectMaster"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          width={1024}
          height={1280}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,17,22,0.35) 0%, rgba(14,17,22,0.55) 60%, rgba(14,17,22,0.92) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between h-full p-10 text-white">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors w-fit">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div>
            <div className="font-medium tracking-[0.09em] uppercase text-[14px] mb-6">
              <span className="text-white">PROSPECT</span>
              <span style={{ color: "#FF4D4D" }}>MASTER</span>
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
              Turn Local Businesses<br />Into Recurring Revenue.
            </h2>
            <p className="mt-4 text-white/70 text-sm max-w-md leading-relaxed">
              The only fully automated platform that finds no-website businesses,
              builds them a site, and closes the deal for you.
            </p>

            <ul className="mt-8 flex flex-col gap-3 max-w-md">
              {[
                "Live Google Maps prospecting in 190+ countries",
                "AI-built demo site on every lead in 60 seconds",
                "Stripe checkout + auto-deploy when they pay",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-white/85">
                  <span
                    className="flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ width: 18, height: 18, borderRadius: 9, background: "#CC0000" }}
                  >
                    <Check size={11} strokeWidth={3} className="text-white" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-white/50">
            © {new Date().getFullYear()} ProspectMaster. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col">
        <div className="lg:hidden px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[380px]">
          <div className="text-center mb-8">
            <div className="font-medium tracking-[0.09em] uppercase text-[16px] select-none mb-4">
              <span style={{ color: "#111" }}>PROSPECT</span>
              <span style={{ color: "#CC0000" }}>MASTER</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0E1116" }}>
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to your ProspectMaster account"
                : "Get started with ProspectMaster for free"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md text-sm" style={{ background: "#FFF0F0", color: "#CC0000", border: "0.5px solid rgba(204,0,0,0.25)" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full pm-btn-ghost justify-center mb-4"
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#E0E0E0]" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-[#E0E0E0]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#444" }}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-md border border-[#E0E0E0] focus:outline-none focus:ring-1 focus:ring-[#CC0000] focus:border-[#CC0000]"
                  style={{ background: "white" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#444" }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-9 py-2.5 text-sm rounded-md border border-[#E0E0E0] focus:outline-none focus:ring-1 focus:ring-[#CC0000] focus:border-[#CC0000]"
                  style={{ background: "white" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pm-btn-red justify-center w-full mt-2"
            >
              <LogIn size={16} />
              {loading
                ? "Please wait..."
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => { setMode("signup"); setError(""); }}
                  className="font-medium text-[#CC0000] hover:underline"
                >
                  Start Free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => { setMode("signin"); setError(""); }}
                  className="font-medium text-[#CC0000] hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
