import { useMemo } from "react";
import { useLocation } from "wouter";
import { Building2, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type VendorRow = {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  users: number;
  cases: number;
  lastActive: string;
};

const mockVendors: VendorRow[] = [
  { id: "V001", name: "ABC Verification Services", status: "completed", users: 45, cases: 1250, lastActive: "2 hours ago" },
  { id: "V002", name: "XYZ Inspections Ltd", status: "in-progress", users: 32, cases: 890, lastActive: "5 mins ago" },
  { id: "V003", name: "QuickVerify Solutions", status: "completed", users: 28, cases: 720, lastActive: "1 hour ago" },
  { id: "V004", name: "TrustCheck Partners", status: "pending", users: 15, cases: 340, lastActive: "3 hours ago" },
  { id: "V005", name: "VerifyPro India", status: "completed", users: 52, cases: 1580, lastActive: "30 mins ago" },
];

export default function ManageVendors() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const columns = useMemo(
    () => [
      { key: "id", label: "ID", className: "w-20" },
      { key: "name", label: "Vendor Name" },
      {
        key: "status",
        label: "Status",
        render: (row: VendorRow) => <StatusBadge status={row.status} />,
      },
      { key: "users", label: "Users", className: "text-center" },
      { key: "cases", label: "Cases", className: "text-center" },
      { key: "lastActive", label: "Last Active" },
      {
        key: "actions",
        label: "Actions",
        className: "text-right w-[160px]",
        render: (row: VendorRow) => (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toast({ title: "Vendor", description: `Open ${row.id} (coming soon)` });
              }}
            >
              View
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toast({ title: "Edit Vendor", description: "Coming soon" });
              }}
            >
              Edit
            </Button>
          </div>
        ),
      },
    ],
    [toast]
  );

  return (
    <DashboardLayout role="admin" userName="Super Admin">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Master Vendors
            </h1>
            <p className="text-muted-foreground">Create, review, and manage master vendors</p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin")}
            >
              Back to dashboard
            </Button>
            <Button
              type="button"
              onClick={() => toast({ title: "Add Vendor", description: "Coming soon" })}
            >
              <Plus className="h-4 w-4" />
              Add vendor
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <Building2 className="h-5 w-5" />
              Vendor List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={mockVendors}
              searchPlaceholder="Search vendors..."
              pageSize={10}
              onRowClick={(row) => toast({ title: "Vendor", description: `Selected ${row.id} (coming soon)` })}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
