import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, MoreHorizontal } from "lucide-react";
import { useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const branchManagers = [
  { id: "BM001", name: "Rajesh Kumar", email: "rajesh@company.com", branch: "Mumbai HQ", status: "Active", phone: "+91 98765 43210" },
  { id: "BM002", name: "Priya Sharma", email: "priya@company.com", branch: "Delhi NCR", status: "Active", phone: "+91 98765 43211" },
  { id: "BM003", name: "Amit Patel", email: "amit@company.com", branch: "Bangalore", status: "Active", phone: "+91 98765 43212" },
];

const teamLeads = [
  { id: "TL001", name: "Sunita Menon", email: "sunita@company.com", branch: "Mumbai HQ", team: "Team Alpha", status: "Active" },
  { id: "TL002", name: "Vikram Rao", email: "vikram@company.com", branch: "Delhi NCR", team: "Team Beta", status: "Active" },
  { id: "TL003", name: "Deepa Nair", email: "deepa@company.com", branch: "Chennai", team: "Team Gamma", status: "Inactive" },
];

const backOffice = [
  { id: "BO001", name: "Kiran Joshi", email: "kiran@company.com", branch: "Mumbai HQ", casesHandled: 156, status: "Active" },
  { id: "BO002", name: "Meera Reddy", email: "meera@company.com", branch: "Delhi NCR", casesHandled: 142, status: "Active" },
  { id: "BO003", name: "Rahul Verma", email: "rahul@company.com", branch: "Bangalore", casesHandled: 128, status: "Active" },
];

const fieldExecutives = [
  { id: "FE001", name: "Suresh Kumar", email: "suresh@company.com", zone: "Mumbai North", completedToday: 5, status: "Active" },
  { id: "FE002", name: "Lakshmi Devi", email: "lakshmi@company.com", zone: "Delhi Central", completedToday: 4, status: "Active" },
  { id: "FE003", name: "Ganesh Naik", email: "ganesh@company.com", zone: "Bangalore East", completedToday: 6, status: "Active" },
  { id: "FE004", name: "Anjali Singh", email: "anjali@company.com", zone: "Chennai South", completedToday: 3, status: "Inactive" },
];

function AddUserDialog({ userType }: { userType: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid={`add-${userType}-button`}>
          <UserPlus className="w-4 h-4" />
          Add {userType}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Add New {userType}</DialogTitle>
          <DialogDescription>Enter the details of the new {userType.toLowerCase()}.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="First name" data-testid="input-first-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Last name" data-testid="input-last-name" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@company.com" data-testid="input-email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="+91 98765 43210" data-testid="input-phone" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select>
              <SelectTrigger data-testid="select-branch">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Mumbai HQ</SelectItem>
                <SelectItem value="delhi">Delhi NCR</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" data-testid="submit-add-user">Add User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UserManagement() {
  const { toast } = useToast();
  const [, params] = useRoute("/vendor/users/:type");
  const userTypeParam = params?.type ?? "branch-managers";

  const ActionCell = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toast({ title: "View Details", description: "Coming soon" }); }}>View Details</DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toast({ title: "Edit", description: "Coming soon" }); }}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onSelect={(e) => { e.preventDefault(); toast({ title: "Deactivate", description: "Coming soon" }); }}>Deactivate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const StatusCell = ({ status }: { status: string }) => (
    <Badge variant={status === "Active" ? "default" : "secondary"}>
      {status}
    </Badge>
  );

  const view = useMemo(() => {
    const type = userTypeParam;

    if (type === "team-leads") {
      return {
        title: "Team Leads",
        description: "Manage team lead accounts and assignments",
        addLabel: "Team Lead",
        searchPlaceholder: "Search team leads...",
        data: teamLeads,
        columns: [
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "branch", label: "Branch" },
          { key: "team", label: "Team" },
          { key: "status", label: "Status", render: (row: Record<string, unknown>) => <StatusCell status={String(row.status ?? "")} /> },
          { key: "actions", label: "", render: () => <ActionCell /> },
        ],
      };
    }

    if (type === "back-office") {
      return {
        title: "Back Office",
        description: "Manage back office users and workload",
        addLabel: "Back Office Executive",
        searchPlaceholder: "Search back office users...",
        data: backOffice,
        columns: [
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "branch", label: "Branch" },
          { key: "casesHandled", label: "Cases Handled" },
          { key: "status", label: "Status", render: (row: Record<string, unknown>) => <StatusCell status={String(row.status ?? "")} /> },
          { key: "actions", label: "", render: () => <ActionCell /> },
        ],
      };
    }

    if (type === "field-executives") {
      return {
        title: "Field Executives",
        description: "Manage field executive users and coverage zones",
        addLabel: "Field Executive",
        searchPlaceholder: "Search field executives...",
        data: fieldExecutives,
        columns: [
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "zone", label: "Zone" },
          { key: "completedToday", label: "Completed Today" },
          { key: "status", label: "Status", render: (row: Record<string, unknown>) => <StatusCell status={String(row.status ?? "")} /> },
          { key: "actions", label: "", render: () => <ActionCell /> },
        ],
      };
    }

    // default: branch-managers
    return {
      title: "Branch Managers",
      description: "Manage branch manager accounts and branch assignment",
      addLabel: "Branch Manager",
      searchPlaceholder: "Search branch managers...",
      data: branchManagers,
      columns: [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "branch", label: "Branch" },
        { key: "phone", label: "Phone" },
        { key: "status", label: "Status", render: (row: Record<string, unknown>) => <StatusCell status={String(row.status ?? "")} /> },
        { key: "actions", label: "", render: () => <ActionCell /> },
      ],
    };
  }, [userTypeParam]);

  return (
    <DashboardLayout role="master-vendor" userName="Vendor Admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {view.title}
          </h1>
          <p className="text-muted-foreground">{view.description}</p>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle style={{ fontFamily: "var(--font-display)" }}>User Management</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-end mb-4">
              <AddUserDialog userType={view.addLabel} />
            </div>
            <DataTable
              columns={view.columns}
              data={view.data}
              searchPlaceholder={view.searchPlaceholder}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
