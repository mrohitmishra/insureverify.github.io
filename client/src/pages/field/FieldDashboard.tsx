import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  Camera,
  Navigation,
  User,
  LogOut,
  Bell,
  CheckCircle2,
  AlertCircle,
  Play,
} from "lucide-react";

const todaysCases = [
  { id: "C-001", name: "Rahul Sharma", type: "Property", address: "123, MG Road, Andheri West", time: "10:00 AM", status: "pending", phone: "+91 98765 43210" },
  { id: "C-002", name: "Priya Patel", type: "Vehicle", address: "45, Link Road, Bandra", time: "11:30 AM", status: "in-progress", phone: "+91 98765 43211" },
  { id: "C-003", name: "Amit Kumar", type: "Property", address: "78, Carter Road, Khar", time: "2:00 PM", status: "pending", phone: "+91 98765 43212" },
];

const pendingCases = [
  { id: "C-004", name: "Sunita Devi", type: "Health", address: "234, Hill Road, Bandra", dueDate: "Today", status: "pending", phone: "+91 98765 43213" },
  { id: "C-005", name: "Vikram Singh", type: "Property", address: "567, SV Road, Malad", dueDate: "Tomorrow", status: "pending", phone: "+91 98765 43214" },
];

const ongoingCases = [
  { id: "C-006", name: "Meera Reddy", type: "Vehicle", address: "89, Linking Road", progress: 60, status: "in-progress", phone: "+91 98765 43215" },
];

const completedCases = [
  { id: "C-007", name: "Kiran Joshi", type: "Property", address: "12, Juhu Lane", completedAt: "9:30 AM", status: "completed", phone: "+91 98765 43216" },
  { id: "C-008", name: "Anjali Shah", type: "Business", address: "45, Versova Road", completedAt: "Yesterday", status: "completed", phone: "+91 98765 43217" },
];

interface Case {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  status: string;
  time?: string;
  dueDate?: string;
  progress?: number;
  completedAt?: string;
}

function CaseCard({ caseItem, showAction = true }: { caseItem: Case; showAction?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-card-border p-4 shadow-sm"
      data-testid={`case-card-${caseItem.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold">{caseItem.name}</p>
          <p className="text-sm text-muted-foreground">{caseItem.type} Verification</p>
        </div>
        <StatusBadge status={caseItem.status as "pending" | "in-progress" | "completed"} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <span className="text-muted-foreground">{caseItem.address}</span>
        </div>
        {caseItem.time && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Scheduled: {caseItem.time}</span>
          </div>
        )}
        {caseItem.dueDate && (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-amber-600">Due: {caseItem.dueDate}</span>
          </div>
        )}
        {caseItem.completedAt && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-600">Completed: {caseItem.completedAt}</span>
          </div>
        )}
      </div>

      {showAction && (
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1 gap-2" data-testid={`call-${caseItem.id}`}>
            <Phone className="w-4 h-4" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-2" data-testid={`navigate-${caseItem.id}`}>
            <Navigation className="w-4 h-4" />
            Navigate
          </Button>
          {caseItem.status === "pending" && (
            <Link href={`/field/inspection/${caseItem.id}`}>
              <Button size="sm" className="gap-2" data-testid={`start-${caseItem.id}`}>
                <Play className="w-4 h-4" />
                Start
              </Button>
            </Link>
          )}
          {caseItem.status === "in-progress" && (
            <Link href={`/field/inspection/${caseItem.id}`}>
              <Button size="sm" className="gap-2" data-testid={`continue-${caseItem.id}`}>
                <Camera className="w-4 h-4" />
                Continue
              </Button>
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function FieldDashboard() {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg" style={{ fontFamily: "var(--font-display)" }}>
                InsureVerify
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Field Executive</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
              data-testid="notifications"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                SK
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="p-4 grid grid-cols-4 gap-2">
        {[
          { label: "Today", value: 3, color: "bg-blue-500" },
          { label: "Pending", value: 2, color: "bg-amber-500" },
          { label: "Ongoing", value: 1, color: "bg-purple-500" },
          { label: "Done", value: 2, color: "bg-emerald-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-3 text-center border border-card-border">
            <div className={`w-8 h-8 rounded-full ${stat.color} flex items-center justify-center mx-auto mb-1`}>
              <span className="text-white font-bold text-sm">{stat.value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-12 p-1">
            <TabsTrigger value="today" className="text-xs" data-testid="tab-today">
              Today
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs" data-testid="tab-pending">
              Pending
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="text-xs" data-testid="tab-ongoing">
              Ongoing
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs" data-testid="tab-completed">
              Done
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-3">
            <TabsContent value="today" className="m-0 space-y-3">
              {todaysCases.map((c) => (
                <CaseCard key={c.id} caseItem={c} />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="m-0 space-y-3">
              {pendingCases.map((c) => (
                <CaseCard key={c.id} caseItem={c} />
              ))}
            </TabsContent>

            <TabsContent value="ongoing" className="m-0 space-y-3">
              {ongoingCases.map((c) => (
                <CaseCard key={c.id} caseItem={c} />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="m-0 space-y-3">
              {completedCases.map((c) => (
                <CaseCard key={c.id} caseItem={c} showAction={false} />
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 flex justify-around">
        {[
          { icon: Clock, label: "Cases", active: true },
          { icon: Camera, label: "Capture" },
          { icon: User, label: "Profile" },
          { icon: LogOut, label: "Logout" },
        ].map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              item.active ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid={`nav-${item.label.toLowerCase()}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
