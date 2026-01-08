import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, ChevronRight, User, Building2, ClipboardList, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "admin",
    label: "Admin",
    description: "Platform administration & vendor management",
    icon: Shield,
    path: "/admin",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "master-vendor",
    label: "Master Vendor",
    description: "User, client, and report configuration",
    icon: Building2,
    path: "/vendor",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "back-office",
    label: "Back Office",
    description: "Case management & data validation",
    icon: ClipboardList,
    path: "/back-office",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "field-executive",
    label: "Field Executive",
    description: "Inspections & field data collection",
    icon: Users,
    path: "/field",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "insurance-company",
    label: "Insurance Company",
    description: "Case upload & report downloads",
    icon: Briefcase,
    path: "/insurance",
    color: "from-rose-500 to-pink-500",
  },
];

export default function Login() {
  const [, navigate] = useLocation();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setShowLogin(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const role = roles.find((r) => r.id === selectedRole);
    if (role) {
      navigate(role.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
        
        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                  InsureVerify
                </h1>
                <p className="text-white/60 text-sm">Insurance Verification Platform</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Streamline your insurance<br />verification process
            </h2>
            <p className="text-white/70 text-lg max-w-md">
              A complete platform for master vendors, field executives, and insurance companies to manage inspections and generate reports efficiently.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>500+</p>
              <p className="text-white/60 text-sm">Active Vendors</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>1M+</p>
              <p className="text-white/60 text-sm">Cases Processed</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>99.9%</p>
              <p className="text-white/60 text-sm">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              InsureVerify
            </h1>
          </div>

          {!showLogin ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Welcome back
              </h2>
              <p className="text-white/60 mb-8">Select your role to continue</p>

              <div className="space-y-3">
                {roles.map((role, index) => (
                  <motion.button
                    key={role.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10",
                      "hover:bg-white/10 hover:border-white/20 transition-all duration-200 group text-left"
                    )}
                    data-testid={`role-select-${role.id}`}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0",
                      role.color
                    )}>
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">{role.label}</p>
                      <p className="text-white/50 text-sm truncate">{role.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setShowLogin(false)}
                className="text-white/60 hover:text-white text-sm mb-6 flex items-center gap-1"
                data-testid="back-to-roles"
              >
                ← Back to role selection
              </button>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white" style={{ fontFamily: "var(--font-display)" }}>
                    Sign in as {roles.find((r) => r.id === selectedRole)?.label}
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Enter your credentials to access the dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/80">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        data-testid="input-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white/80">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        data-testid="input-password"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 text-white/60">
                        <input type="checkbox" className="rounded" />
                        Remember me
                      </label>
                      <a href="#" className="text-primary hover:underline">Forgot password?</a>
                    </div>
                    <Button type="submit" className="w-full" data-testid="button-login">
                      Sign in
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
