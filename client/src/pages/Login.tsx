import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, ChevronRight, Building2, ClipboardList, Users, Briefcase, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { setSession, type AppRole } from "@/lib/auth";

const roles = [
  {
    id: "admin",
    label: "Admin",
    description: "Platform administration & vendor management",
    icon: Shield,
    path: "/admin",
  },
  {
    id: "master-vendor",
    label: "Master Vendor",
    description: "User, client, and report configuration",
    icon: Building2,
    path: "/vendor",
  },
  {
    id: "back-office",
    label: "Back Office",
    description: "Case management & data validation",
    icon: ClipboardList,
    path: "/back-office",
  },
  {
    id: "field-executive",
    label: "Field Executive",
    description: "Inspections & field data collection",
    icon: Users,
    path: "/field",
  },
  {
    id: "insurance-company",
    label: "Insurance Company",
    description: "Case upload & report downloads",
    icon: Briefcase,
    path: "/insurance",
  },
];

export default function Login() {
  const [, navigate] = useLocation();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof document === "undefined") return;
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    if (typeof document === "undefined") return;
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    try {
      localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    } catch {
      // ignore write failures (private mode, blocked storage, etc.)
    }
    setIsDark(nextIsDark);
  };

  const selectedRoleLabel = useMemo(
    () => roles.find((r) => r.id === selectedRole)?.label,
    [selectedRole]
  );

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setShowLogin(true);
    setEmail("");
    setPassword("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const role = roles.find((r) => r.id === selectedRole);
    if (role) {
      const userName = email?.trim() ? email.trim() : "User";
      setSession({ role: role.id as AppRole, userName });
      navigate(role.path);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid gap-6 lg:grid-cols-2 items-stretch">
        {/* Left: About */}
        <Card className="hidden lg:flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>InsureVerify</CardTitle>
                <CardDescription>Insurance Verification Platform</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">What this platform is for</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Role-based dashboards to manage cases, capture field evidence, and generate standardized reports.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm">
                  <span className="font-medium">Predefined inspection structure</span> for consistent, insurance-ready data.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm">
                  <span className="font-medium">Evidence capture</span> with photos, timestamps, and location.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm">
                  <span className="font-medium">Back office control</span> to validate cases and produce final reports.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm">
                  <span className="font-medium">Enterprise focus</span> on tables, forms, and clear actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Login */}
        <Card className="w-full">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 lg:hidden">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="truncate">InsureVerify</CardTitle>
                  <CardDescription className="truncate">Insurance Verification Platform</CardDescription>
                </div>
              </div>

              <div className="flex-1 lg:hidden" />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                data-testid="theme-toggle"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? "Light" : "Dark"}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {!showLogin ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">Sign in</h2>
                  <p className="text-sm text-muted-foreground">Select your role to continue</p>
                </div>

                <div className="space-y-2">
                  {roles.map((role, index) => (
                    <motion.button
                      key={role.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      onClick={() => handleRoleSelect(role.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-md border border-border bg-card",
                        "hover:bg-accent hover:text-accent-foreground transition-colors group text-left"
                      )}
                      data-testid={`role-select-${role.id}`}
                    >
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <role.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{role.label}</p>
                        <p className="text-sm text-muted-foreground truncate">{role.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
                  data-testid="back-to-roles"
                >
                  ← Back
                </button>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold">Sign in as {selectedRoleLabel}</h2>
                  <p className="text-sm text-muted-foreground">Enter your credentials to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      data-testid="input-password"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-login">
                    Sign in
                  </Button>
                </form>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
