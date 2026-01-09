import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Download, Clock, CheckCircle2, FolderOpen, Eye, MapPin } from "lucide-react";

const submittedCases = [
  // Enhancement: align statuses with workflow (CREATED → ASSIGNED → INSPECTED → VERIFIED → COMPLETED).
  { id: "IC-2024-001", insuredName: "Rahul Sharma", type: "Property", branch: "Mumbai HQ", assignedTo: "Back Office - Kiran J", location: "Mumbai", status: "completed", submittedAt: "2026-01-08", reportReady: true },
  { id: "IC-2024-002", insuredName: "Priya Patel", type: "Vehicle", branch: "Delhi NCR", assignedTo: "FE - Suresh K", location: "Delhi", status: "assigned", submittedAt: "2026-01-07", reportReady: false },
  { id: "IC-2024-003", insuredName: "Amit Kumar", type: "Property", branch: "Bangalore", assignedTo: "Back Office - Meera R", location: "Bangalore", status: "created", submittedAt: "2026-01-06", reportReady: false },
  { id: "IC-2024-004", insuredName: "Sunita Devi", type: "Health", branch: "Chennai", assignedTo: "Back Office - Kiran J", location: "Chennai", status: "verified", submittedAt: "2026-01-05", reportReady: false },
  { id: "IC-2024-005", insuredName: "Vikram Singh", type: "Business", branch: "Mumbai HQ", assignedTo: "FE - Ganesh N", location: "Pune", status: "inspected", submittedAt: "2026-01-04", reportReady: false },
];

function UploadCaseDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [insuredName, setInsuredName] = useState("");
  const [verificationType, setVerificationType] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(insuredName.trim() && verificationType && pincode.trim() && address.trim());
  }, [address, insuredName, pincode, verificationType]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (!canSubmit) return;

    toast({
      title: "Case submitted",
      description: "Case created and sent to Back Office (status: CREATED).",
    });
    setOpen(false);
    setAttemptedSubmit(false);
    setInsuredName("");
    setVerificationType("");
    setPincode("");
    setAddress("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="upload-case-button">
          <Upload className="w-4 h-4" />
          Create Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Create Case</DialogTitle>
          <DialogDescription>
            Submits the case to Back Office for assignment (Insurance Company → Back Office → Field Executive)
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 mt-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuredName">Insured Name *</Label>
              <Input
                id="insuredName"
                value={insuredName}
                onChange={(e) => setInsuredName(e.target.value)}
                placeholder="Full name"
                data-testid="input-insured-name"
              />
              {attemptedSubmit && !insuredName.trim() && (
                <p className="text-xs text-destructive">Insured name is required.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number</Label>
              <Input id="policyNumber" placeholder="POL-XXXX" data-testid="input-policy-number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Verification Type *</Label>
            <Select value={verificationType} onValueChange={setVerificationType}>
              <SelectTrigger data-testid="select-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="property">Property Verification</SelectItem>
                <SelectItem value="vehicle">Vehicle Inspection</SelectItem>
                <SelectItem value="health">Health Check</SelectItem>
                <SelectItem value="business">Business Verification</SelectItem>
              </SelectContent>
            </Select>
            {attemptedSubmit && !verificationType && (
              <p className="text-xs text-destructive">Verification type is required.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="400001"
                data-testid="input-pincode"
              />
              {attemptedSubmit && !pincode.trim() && (
                <p className="text-xs text-destructive">Pincode is required.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Mumbai" data-testid="input-city" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Complete address"
              data-testid="input-address"
            />
            {attemptedSubmit && !address.trim() && <p className="text-xs text-destructive">Address is required.</p>}
          </div>

          <div className="space-y-2">
            <Label>Supporting Documents</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, Images up to 10MB each</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" data-testid="submit-case" disabled={!canSubmit}>
              Submit Case (CREATED)
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function InsuranceDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredCases = useMemo(() => {
    return submittedCases.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (fromDate && c.submittedAt < fromDate) return false;
      if (toDate && c.submittedAt > toDate) return false;
      return true;
    });
  }, [fromDate, statusFilter, toDate]);

  return (
    <DashboardLayout role="insurance-company" userName="HDFC Ergo">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Insurance Company Dashboard
            </h1>
            <p className="text-muted-foreground">
              Submit cases to Back Office and download reports after completion
            </p>
          </div>
          <UploadCaseDialog />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Cases"
            value="156"
            change={{ value: 8, type: "increase" }}
            icon={<FolderOpen className="w-5 h-5" />}
          />
          <StatsCard
            title="In Progress"
            value="24"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatsCard
            title="Reports Ready"
            value="42"
            change={{ value: 15, type: "increase" }}
            icon={<FileText className="w-5 h-5" />}
          />
          <StatsCard
            title="Completed"
            value="132"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
        </div>

        {/* Cases Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: "var(--font-display)" }}>Submitted Cases</CardTitle>
          </CardHeader>
          <CardContent>
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
                { key: "insuredName", label: "Insured Name" },
                { key: "type", label: "Type" },
                { key: "branch", label: "Branch" },
                { key: "assignedTo", label: "Assigned" },
                {
                  key: "location",
                  label: "Location",
                  render: (row) => (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {row.location as string}
                    </span>
                  ),
                },
                {
                  key: "status",
                  label: "Status",
                  render: (row) => (
                    <StatusBadge
                      status={row.status as "created" | "assigned" | "inspected" | "verified" | "completed"}
                    />
                  ),
                },
                { key: "submittedAt", label: "Submitted" },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`view-${row.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-testid={`download-${row.id}`}
                        disabled={!row.reportReady}
                        title={row.reportReady ? "Download report" : "Report available after COMPLETED"}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={filteredCases}
              searchPlaceholder="Search cases..."
            />
          </CardContent>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
                Cases by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Property", count: 68, color: "bg-blue-500" },
                  { type: "Vehicle", count: 42, color: "bg-emerald-500" },
                  { type: "Health", count: 28, color: "bg-amber-500" },
                  { type: "Business", count: 18, color: "bg-purple-500" },
                ].map((item) => (
                  <div key={item.type} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="flex-1 text-sm">{item.type}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
                Recent Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "IC-2024-001_Report.pdf", date: "Today, 2:30 PM" },
                  { name: "IC-2024-004_Report.pdf", date: "Yesterday, 4:15 PM" },
                  { name: "IC-2023-998_Report.pdf", date: "Jan 5, 2024" },
                ].map((file, index) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <FileText className="w-5 h-5 text-red-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.date}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
