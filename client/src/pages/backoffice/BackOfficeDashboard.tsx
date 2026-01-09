import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/shared/DataTable";
import { FolderOpen, ClipboardCheck, Clock, Lock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Enhancement: align mock statuses with workflow (CREATED → ASSIGNED → INSPECTED → VERIFIED → COMPLETED).
const recentCases = [
  { id: "C-2024-001", client: "HDFC Ergo", type: "Vehicle", branch: "Mumbai HQ", location: "Mumbai", status: "created", assignedTo: "Unassigned", createdAt: "2026-01-09", lockedBy: null },
  { id: "C-2024-002", client: "ICICI Lombard", type: "Vehicle", branch: "Delhi NCR", location: "Delhi", status: "assigned", assignedTo: "FE - Suresh K", createdAt: "2026-01-08", lockedBy: "Kiran J" },
  { id: "C-2024-003", client: "Bajaj Allianz", type: "Property", branch: "Bangalore", location: "Bangalore", status: "inspected", assignedTo: "FE - Ganesh N", createdAt: "2026-01-08", lockedBy: null },
  { id: "C-2024-004", client: "Tata AIG", type: "Health", branch: "Chennai", location: "Chennai", status: "verified", assignedTo: "Self", createdAt: "2026-01-07", lockedBy: null },
  { id: "C-2024-005", client: "New India", type: "Property", branch: "Mumbai HQ", location: "Pune", status: "completed", assignedTo: "Self", createdAt: "2026-01-06", lockedBy: "Meera R" },
];

const branchCases = [
  { branch: "Mumbai HQ", pending: 24, inProgress: 12, completed: 156 },
  { branch: "Delhi NCR", pending: 18, inProgress: 8, completed: 142 },
  { branch: "Bangalore", pending: 15, inProgress: 6, completed: 98 },
  { branch: "Chennai", pending: 12, inProgress: 5, completed: 87 },
];

export default function BackOfficeDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredCases = useMemo(() => {
    return recentCases.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (fromDate && c.createdAt < fromDate) return false;
      if (toDate && c.createdAt > toDate) return false;
      return true;
    });
  }, [fromDate, statusFilter, toDate]);

  return (
    <DashboardLayout role="back-office" userName="Kiran Joshi">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Back Office Dashboard
            </h1>
            <p className="text-muted-foreground">
              Control layer for cases (Insurance Company → Back Office → Field Executive → Back Office → Insurance Company)
            </p>
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
                {/* Enhancement: simple filters (status + date range) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger data-testid="filter-status">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="created">CREATED</SelectItem>
                        <SelectItem value="assigned">ASSIGNED</SelectItem>
                        <SelectItem value="inspected">INSPECTED</SelectItem>
                        <SelectItem value="verified">VERIFIED</SelectItem>
                        <SelectItem value="completed">COMPLETED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} data-testid="filter-from" />
                  </div>
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} data-testid="filter-to" />
                  </div>
                </div>

                <DataTable
                  columns={[
                    { key: "id", label: "Case ID", className: "font-mono" },
                    { key: "branch", label: "Branch" },
                    { key: "client", label: "Client" },
                    { key: "type", label: "Type" },
                    { key: "location", label: "Location" },
                    {
                      key: "status",
                      label: "Status",
                      render: (row) => (
                        <div className="flex items-center gap-2">
                          <StatusBadge status={row.status as "created" | "assigned" | "inspected" | "verified" | "completed"} />
                          {row.lockedBy && (
                            <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                              <Lock className="w-3 h-3" />
                              {row.lockedBy as string}
                            </span>
                          )}
                        </div>
                      ),
                    },
                    { key: "assignedTo", label: "Assigned" },
                    { key: "createdAt", label: "Created" },
                  ]}
                  data={filteredCases}
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
