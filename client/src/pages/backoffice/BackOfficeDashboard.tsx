import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/shared/DataTable";
import { FolderOpen, ClipboardCheck, Clock, Lock, Plus, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const recentCases = [
  { id: "C-2024-001", client: "HDFC Ergo", type: "Property", location: "Mumbai", status: "pending", assignedTo: "Self", lockedBy: null },
  { id: "C-2024-002", client: "ICICI Lombard", type: "Vehicle", location: "Delhi", status: "in-progress", assignedTo: "Self", lockedBy: "Kiran J" },
  { id: "C-2024-003", client: "Bajaj Allianz", type: "Property", location: "Bangalore", status: "completed", assignedTo: "Self", lockedBy: null },
  { id: "C-2024-004", client: "Tata AIG", type: "Health", location: "Chennai", status: "started", assignedTo: "Self", lockedBy: null },
  { id: "C-2024-005", client: "New India", type: "Property", location: "Pune", status: "pending", assignedTo: "Self", lockedBy: "Meera R" },
];

const branchCases = [
  { branch: "Mumbai HQ", pending: 24, inProgress: 12, completed: 156 },
  { branch: "Delhi NCR", pending: 18, inProgress: 8, completed: 142 },
  { branch: "Bangalore", pending: 15, inProgress: 6, completed: 98 },
  { branch: "Chennai", pending: 12, inProgress: 5, completed: 87 },
];

export default function BackOfficeDashboard() {
  return (
    <DashboardLayout role="back-office" userName="Kiran Joshi">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Back Office Dashboard
            </h1>
            <p className="text-muted-foreground">Manage and validate verification cases</p>
          </div>
          <Link href="/back-office/new-case">
            <Button className="gap-2" data-testid="add-new-case">
              <Plus className="w-4 h-4" />
              Add New Case
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="My Cases"
            value="42"
            icon={<FolderOpen className="w-5 h-5" />}
          />
          <StatsCard
            title="In Progress"
            value="8"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatsCard
            title="Completed Today"
            value="12"
            change={{ value: 15, type: "increase" }}
            icon={<ClipboardCheck className="w-5 h-5" />}
          />
          <StatsCard
            title="Locked Cases"
            value="3"
            icon={<Lock className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* My Cases Table */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle style={{ fontFamily: "var(--font-display)" }}>My Cases</CardTitle>
                <Link href="/back-office/cases">
                  <Button variant="link" className="text-primary" data-testid="view-all-cases">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={[
                    { key: "id", label: "Case ID", className: "font-mono" },
                    { key: "client", label: "Client" },
                    { key: "type", label: "Type" },
                    { key: "location", label: "Location" },
                    {
                      key: "status",
                      label: "Status",
                      render: (row) => (
                        <div className="flex items-center gap-2">
                          <StatusBadge status={row.status as "completed" | "in-progress" | "pending" | "started"} />
                          {row.lockedBy && (
                            <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                              <Lock className="w-3 h-3" />
                              {row.lockedBy as string}
                            </span>
                          )}
                        </div>
                      ),
                    },
                  ]}
                  data={recentCases}
                  searchPlaceholder="Search cases..."
                  pageSize={5}
                />
              </CardContent>
            </Card>
          </div>

          {/* Branch-wise Summary */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: "var(--font-display)" }}>Branch Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branchCases.map((branch, index) => (
                    <motion.div
                      key={branch.branch}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-muted/50"
                    >
                      <p className="font-medium text-sm mb-2">{branch.branch}</p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-amber-50 rounded-md p-2">
                          <p className="text-lg font-bold text-amber-600">{branch.pending}</p>
                          <p className="text-xs text-amber-600/70">Pending</p>
                        </div>
                        <div className="bg-blue-50 rounded-md p-2">
                          <p className="text-lg font-bold text-blue-600">{branch.inProgress}</p>
                          <p className="text-xs text-blue-600/70">In Progress</p>
                        </div>
                        <div className="bg-emerald-50 rounded-md p-2">
                          <p className="text-lg font-bold text-emerald-600">{branch.completed}</p>
                          <p className="text-xs text-emerald-600/70">Done</p>
                        </div>
                      </div>
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
