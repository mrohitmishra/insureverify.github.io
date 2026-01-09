import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Building2, Users, Activity, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockVendors = [
  { id: "V001", name: "ABC Verification Services", status: "completed", users: 45, cases: 1250, lastActive: "2 hours ago" },
  { id: "V002", name: "XYZ Inspections Ltd", status: "in-progress", users: 32, cases: 890, lastActive: "5 mins ago" },
  { id: "V003", name: "QuickVerify Solutions", status: "completed", users: 28, cases: 720, lastActive: "1 hour ago" },
  { id: "V004", name: "TrustCheck Partners", status: "pending", users: 15, cases: 340, lastActive: "3 hours ago" },
  { id: "V005", name: "VerifyPro India", status: "completed", users: 52, cases: 1580, lastActive: "30 mins ago" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" userName="Super Admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Vendors"
            value="48"
            change={{ value: 12, type: "increase" }}
            icon={<Building2 className="w-5 h-5" />}
          />
          <StatsCard
            title="Active Users"
            value="1,247"
            change={{ value: 8, type: "increase" }}
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title="System Health"
            value="99.9%"
            icon={<Activity className="w-5 h-5" />}
          />
          <StatsCard
            title="Open Alerts"
            value="3"
            change={{ value: 2, type: "decrease" }}
            icon={<AlertTriangle className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Vendors Table */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: "var(--font-display)" }}>Master Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={[
                    { key: "id", label: "ID", className: "w-20" },
                    { key: "name", label: "Vendor Name" },
                    {
                      key: "status",
                      label: "Status",
                      render: (row) => <StatusBadge status={row.status as "completed" | "in-progress" | "pending"} />,
                    },
                    { key: "users", label: "Users", className: "text-center" },
                    { key: "cases", label: "Cases", className: "text-center" },
                    { key: "lastActive", label: "Last Active" },
                  ]}
                  data={mockVendors}
                  searchPlaceholder="Search vendors..."
                  pageSize={5}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
