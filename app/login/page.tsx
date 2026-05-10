"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { saveAuthData } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const validate = () => {
    let isValid = true;
    const newErrors = { username: "", password: "" };

    if (!formData.username.trim()) {
      newErrors.username = "El usuario es requerido";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    
    // Simulate API call for the skeleton
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate validation error for testing error handling
      if (formData.username === "error") {
        throw new Error("Credenciales inválidas. Intente con otro usuario.");
      }

      // Mock successful login
      const mockUser = {
        id_usuario: 1,
        username: formData.username,
        email: `${formData.username}@example.com`,
        nombre: "Usuario Demo",
        id_rol: formData.username.includes("admin") ? 1 : 2, // 1: Admin, 2: Alumno
      };
      const mockToken = "mock_jwt_token_12345";

      saveAuthData(mockToken, mockUser);
      addToast("Inicio de sesión exitoso", "success");
      router.push("/dashboard");
    } catch (err: any) {
      addToast(err.message || "Ocurrió un error al iniciar sesión", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user types
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="glass rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] animate-[shimmer_3s_infinite]" />
          
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <span className="text-3xl">📽️</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              ExpoSystem
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">
                Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="ej. alumno123"
                  className={`w-full px-4 py-3 rounded-xl bg-input border ${
                    errors.username ? "border-red-500/50 focus:ring-red-500/50" : "border-border focus:ring-primary/50"
                  } focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground/50`}
                />
                {errors.username && (
                  <p className="text-red-400 text-xs mt-1.5 absolute -bottom-5 left-0 animate-in slide-in-from-top-1">
                    {errors.username}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl bg-input border ${
                    errors.password ? "border-red-500/50 focus:ring-red-500/50" : "border-border focus:ring-primary/50"
                  } focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground/50`}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5 absolute -bottom-5 left-0 animate-in slide-in-from-top-1">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Ingresar</span>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center text-xs text-muted-foreground/60">
            <p>Hint: Escribe 'error' en usuario para simular fallo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
