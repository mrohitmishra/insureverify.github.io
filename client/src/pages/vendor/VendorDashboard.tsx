import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Users, FolderOpen, CheckCircle2, Clock, TrendingUp, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

const recentCases = [
  { id: "C-2024-001", client: "HDFC Ergo", location: "Mumbai", status: "completed", assignee: "Rajesh K" },
  { id: "C-2024-002", client: "ICICI Lombard", location: "Delhi", status: "in-progress", assignee: "Priya S" },
  { id: "C-2024-003", client: "Bajaj Allianz", location: "Bangalore", status: "pending", assignee: "Amit P" },
  { id: "C-2024-004", client: "Tata AIG", location: "Chennai", status: "started", assignee: "Sunita M" },
  { id: "C-2024-005", client: "New India", location: "Pune", status: "completed", assignee: "Vikram R" },
];

const branchPerformance = [
  { name: "Mumbai HQ", cases: 245, completed: 220, target: 250 },
  { name: "Delhi NCR", cases: 189, completed: 175, target: 200 },
  { name: "Bangalore", cases: 156, completed: 142, target: 180 },
  { name: "Chennai", cases: 128, completed: 115, target: 150 },
];

export default function VendorDashboard() {
  return (
    <DashboardLayout role="master-vendor" userName="Vendor Admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Master Vendor Dashboard
          </h1>
          <p className="text-muted-foreground">Manage users, clients, and verification cases</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value="156"
            change={{ value: 5, type: "increase" }}
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title="Active Cases"
            value="342"
            change={{ value: 12, type: "increase" }}
            icon={<FolderOpen className="w-5 h-5" />}
          />
          <StatsCard
            title="Completed Today"
            value="47"
            change={{ value: 8, type: "increase" }}
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <StatsCard
            title="Pending"
            value="89"
            change={{ value: 3, type: "decrease" }}
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Cases */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle style={{ fontFamily: "var(--font-display)" }}>Recent Cases</CardTitle>
                <Link href="/vendor/cases" className="text-sm text-primary hover:underline" data-testid="view-all-cases">
                  View all
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCases.map((caseItem, index) => (
                    <motion.div
                      key={caseItem.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      data-testid={`case-row-${caseItem.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-sm">{caseItem.id}</p>
                          <p className="text-xs text-muted-foreground">{caseItem.client}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {caseItem.location}
                        </div>
                        <StatusBadge status={caseItem.status as "completed" | "in-progress" | "pending" | "started"} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Branch Performance */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                  <TrendingUp className="w-4 h-4" />
                  Branch Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {branchPerformance.map((branch, index) => (
                    <motion.div
                      key={branch.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{branch.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {branch.completed}/{branch.target}
                        </span>
                      </div>
                      <Progress value={(branch.completed / branch.target) * 100} className="h-2" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
