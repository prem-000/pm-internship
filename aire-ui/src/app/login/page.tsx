"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bolt, Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

export default function LoginPage() {
  const router = useRouter();
  const { fetchProfile } = useUserStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering && !passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    if (isRegistering && strength < 75) {
      toast.error("Please choose a stronger password");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        await api.post("/auth/register", {
          name: formData.username,
          email: formData.email,
          password: formData.password,
          role: "student"
        });
        toast.success("Account created successfully. Logging in...");
      }

      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem("token", res.data.access_token);
      await fetchProfile();
      
      toast.success("Logged in successfully");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Authentication Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-card border border-border shadow-2xl rounded-3xl animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-6">
          <Bolt className="size-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          {isRegistering ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-[280px]">
          {isRegistering 
            ? "Join thousands of students finding their path" 
            : "Sign in to access your AI-powered dashboard"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegistering && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
            <input 
              name="username"
              required={isRegistering}
              disabled={isLoading}
              value={formData.username}
              onChange={handleChange}
              type="text" 
              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all bg-slate-50 focus:bg-white disabled:opacity-50" 
              placeholder="Jane Student"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
          <input 
            name="email"
            required
            disabled={isLoading}
            value={formData.email}
            onChange={handleChange}
            type="email" 
            className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all bg-slate-50 focus:bg-white disabled:opacity-50" 
            placeholder="jane@university.edu"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            {!isRegistering && (
              <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">
                Forgot?
              </button>
            )}
          </div>
          <div className="relative">
            <input 
              name="password"
              required
              disabled={isLoading}
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"} 
              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all bg-slate-50 focus:bg-white disabled:opacity-50 pr-12" 
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {isRegistering && formData.password && (
            <div className="pt-1.5 px-1 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className={cn(
                  strength < 50 ? "text-red-500" : strength < 100 ? "text-yellow-600" : "text-green-600"
                )}>
                  Strength: {strength === 100 ? "Perfect" : strength >= 75 ? "Strong" : strength >= 50 ? "Fair" : "Weak"}
                </span>
                <span>{strength}%</span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    strength < 50 ? "bg-red-500" : strength < 100 ? "bg-yellow-500" : "bg-green-500"
                  )} 
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {isRegistering && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
            <div className="relative">
              <input 
                name="confirmPassword"
                required={isRegistering}
                disabled={isLoading}
                value={formData.confirmPassword}
                onChange={handleChange}
                type={showPassword ? "text" : "password"} 
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all bg-slate-50 focus:bg-white disabled:opacity-50",
                  formData.confirmPassword && (passwordsMatch ? "border-green-200 focus:border-green-500 focus:ring-green-50" : "border-red-200 focus:border-red-500 focus:ring-red-50"),
                  !formData.confirmPassword && "border-border focus:border-primary focus:ring-4 focus:ring-primary/5"
                )}
                placeholder="••••••••"
              />
              {formData.confirmPassword && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   {passwordsMatch ? <CheckCircle2 className="size-4 text-green-500" /> : <XCircle className="size-4 text-red-500" />}
                </div>
              )}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading || (isRegistering && (!passwordsMatch || strength < 75))}
          className="w-full mt-2 bg-primary text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:shadow-lg transform active:scale-[0.98]"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {isRegistering ? "Create Account" : "Sign In"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-slate-400 transition-all">
          {isRegistering ? "Already have an account? " : "New to AIRE? "}
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)} 
            disabled={isLoading}
            className="text-primary hover:text-blue-700 font-bold transition-colors underline decoration-2 underline-offset-4"
          >
            {isRegistering ? "Sign in" : "Create account"}
          </button>
        </p>
      </div>
    </div>
  );
}
