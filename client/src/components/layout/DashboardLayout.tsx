import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  FileText,
  MapPin,
  CreditCard,
  Mail,
  User,
  Lock,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Shield,
  ClipboardList,
  FolderOpen,
  BarChart3,
  Upload,
  Download,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "master-vendor" | "back-office" | "field-executive" | "insurance-company";
  userName?: string;
}

const navigationByRole: Record<string, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Master Vendors", href: "/admin/vendors", icon: Building2 },
    { label: "Platform Health", href: "/admin/health", icon: BarChart3 },
    { label: "Audit Logs", href: "/admin/audit", icon: FileText },
  ],
  "master-vendor": [
    { label: "Dashboard", href: "/vendor", icon: LayoutDashboard },
    {
      label: "User Management",
      icon: Users,
      children: [
        { label: "Branch Managers", href: "/vendor/users/branch-managers" },
        { label: "Team Leads", href: "/vendor/users/team-leads" },
        { label: "Back Office", href: "/vendor/users/back-office" },
        { label: "Field Executives", href: "/vendor/users/field-executives" },
      ],
    },
    {
      label: "Client Management",
      icon: Building2,
      children: [
        { label: "Insurance Companies", href: "/vendor/clients/companies" },
        { label: "Client Branches", href: "/vendor/clients/branches" },
        { label: "Zones", href: "/vendor/clients/zones" },
        { label: "AO Management", href: "/vendor/clients/ao" },
      ],
    },
    {
      label: "Configuration",
      icon: Settings,
      children: [
        { label: "Point Configuration", href: "/vendor/config/points" },
        { label: "Report Builder", href: "/vendor/config/reports" },
      ],
    },
    { label: "Branch & Zones", href: "/vendor/branches", icon: MapPin },
    { label: "Bank & Payments", href: "/vendor/payments", icon: CreditCard },
    { label: "Mail Settings", href: "/vendor/mail", icon: Mail },
  ],
  "back-office": [
    { label: "Dashboard", href: "/back-office", icon: LayoutDashboard },
    { label: "Add New Case", href: "/back-office/new-case", icon: ClipboardList },
    { label: "Case List", href: "/back-office/cases", icon: FolderOpen },
    { label: "In-Progress Cases", href: "/back-office/in-progress", icon: FileText },
    { label: "MIS Dashboard", href: "/back-office/mis", icon: BarChart3 },
  ],
  "field-executive": [
    { label: "Today's Cases", href: "/field", icon: ClipboardList },
    { label: "Pending", href: "/field/pending", icon: FolderOpen },
    { label: "Ongoing", href: "/field/ongoing", icon: FileText },
    { label: "Completed", href: "/field/completed", icon: Shield },
  ],
  "insurance-company": [
    { label: "Dashboard", href: "/insurance", icon: LayoutDashboard },
    { label: "Upload Case", href: "/insurance/upload", icon: Upload },
    { label: "View Cases", href: "/insurance/cases", icon: FolderOpen },
    { label: "Download Reports", href: "/insurance/reports", icon: Download },
  ],
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  "master-vendor": "Master Vendor",
  "back-office": "Back Office",
  "field-executive": "Field Executive",
  "insurance-company": "Insurance Company",
};

export function DashboardLayout({ children, role, userName = "John Doe" }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = navigationByRole[role] || [];

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => href && location === href;
  const isChildActive = (children?: { href: string }[]) =>
    children?.some((child) => location === child.href);

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const hasChildren = item.children && item.children.length > 0;
    const expanded = expandedItems.includes(item.label);
    const active = isActive(item.href) || isChildActive(item.children);

    if (hasChildren) {
      return (
        <div>
          <button
            onClick={() => {
              if (!sidebarOpen) {
                setSidebarOpen(true);
                setExpandedItems((prev) => (prev.includes(item.label) ? prev : [...prev, item.label]));
                return;
              }
              toggleExpanded(item.label);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
            data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {sidebarOpen && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {expanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </>
            )}
          </button>
          <AnimatePresence>
            {expanded && sidebarOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-8 mt-1 space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm transition-colors",
                        location === child.href
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`nav-${child.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link
        href={item.href || "#"}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        )}
        onClick={() => setMobileMenuOpen(false)}
        data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        {sidebarOpen && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            {sidebarOpen && (
              <span className="font-semibold text-sidebar-foreground text-lg" style={{ fontFamily: "var(--font-display)" }}>
                InsureVerify
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            data-testid="toggle-sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navigation.map((item) => (
            <NavItemComponent key={item.label} item={item} />
          ))}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-sidebar-border">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                  {userName.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{roleLabels[role]}</p>
              </div>
            </div>
          ) : (
            <Avatar className="w-9 h-9 mx-auto">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                {userName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar z-50 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                    <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
                  </div>
                  <span className="font-semibold text-sidebar-foreground text-lg" style={{ fontFamily: "var(--font-display)" }}>
                    InsureVerify
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                  <NavItemComponent key={item.label} item={item} />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden"
              data-testid="mobile-menu-toggle"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="border-0 bg-transparent h-auto p-0 focus-visible:ring-0"
                data-testid="search-input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => toast({ title: "Notifications", description: "Coming soon" })}
              data-testid="notifications-button"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2" data-testid="user-menu-trigger">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {userName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">{userName}</span>
                  <ChevronDown className="w-4 h-4 hidden sm:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    toast({ title: "Profile", description: "Coming soon" });
                  }}
                  data-testid="menu-profile"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    toast({ title: "Change Password", description: "Coming soon" });
                  }}
                  data-testid="menu-change-password"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    toast({ title: "Logout", description: "Coming soon" });
                  }}
                  data-testid="menu-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
