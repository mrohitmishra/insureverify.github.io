import { useState } from "react";
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
import { Upload, FileText, Download, Clock, CheckCircle2, FolderOpen, Eye, MapPin } from "lucide-react";

const submittedCases = [
  { id: "IC-2024-001", insuredName: "Rahul Sharma", type: "Property", location: "Mumbai", status: "completed", submittedAt: "2024-01-08", reportReady: true },
  { id: "IC-2024-002", insuredName: "Priya Patel", type: "Vehicle", location: "Delhi", status: "in-progress", submittedAt: "2024-01-07", reportReady: false },
  { id: "IC-2024-003", insuredName: "Amit Kumar", type: "Property", location: "Bangalore", status: "pending", submittedAt: "2024-01-06", reportReady: false },
  { id: "IC-2024-004", insuredName: "Sunita Devi", type: "Health", location: "Chennai", status: "completed", submittedAt: "2024-01-05", reportReady: true },
  { id: "IC-2024-005", insuredName: "Vikram Singh", type: "Business", location: "Pune", status: "in-progress", submittedAt: "2024-01-04", reportReady: false },
];

function UploadCaseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="upload-case-button">
          <Upload className="w-4 h-4" />
          Upload New Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Upload New Case</DialogTitle>
          <DialogDescription>Submit a new verification case for processing</DialogDescription>
        </DialogHeader>
        <form className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuredName">Insured Name *</Label>
              <Input id="insuredName" placeholder="Full name" data-testid="input-insured-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number</Label>
              <Input id="policyNumber" placeholder="POL-XXXX" data-testid="input-policy-number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Verification Type</Label>
            <Select>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input id="pincode" placeholder="400001" data-testid="input-pincode" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Mumbai" data-testid="input-city" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address *</Label>
            <Input id="address" placeholder="Complete address" data-testid="input-address" />
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
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" data-testid="submit-case">Submit Case</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function InsuranceDashboard() {
  return (
    <DashboardLayout role="insurance-company" userName="HDFC Ergo">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Insurance Company Dashboard
            </h1>
            <p className="text-muted-foreground">Upload cases and download verification reports</p>
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
            <DataTable
              columns={[
                { key: "id", label: "Case ID", className: "font-mono" },
                { key: "insuredName", label: "Insured Name" },
                { key: "type", label: "Type" },
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
                  render: (row) => <StatusBadge status={row.status as "completed" | "in-progress" | "pending"} />,
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
                      {row.reportReady && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" data-testid={`download-${row.id}`}>
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ),
                },
              ]}
              data={submittedCases}
              searchPlaceholder="Search cases..."
            />
          </CardContent>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
                Verification by Type
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
