import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, UserPlus, MoreHorizontal } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("branch-managers");

  const ActionCell = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const StatusCell = ({ status }: { status: string }) => (
    <Badge variant={status === "Active" ? "default" : "secondary"}>
      {status}
    </Badge>
  );

  return (
    <DashboardLayout role="master-vendor" userName="Vendor Admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            User Management
          </h1>
          <p className="text-muted-foreground">Manage all users across branches and roles</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b px-4">
                <TabsList className="bg-transparent h-14 p-0 gap-6">
                  <TabsTrigger
                    value="branch-managers"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14"
                    data-testid="tab-branch-managers"
                  >
                    Branch Managers
                  </TabsTrigger>
                  <TabsTrigger
                    value="team-leads"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14"
                    data-testid="tab-team-leads"
                  >
                    Team Leads
                  </TabsTrigger>
                  <TabsTrigger
                    value="back-office"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14"
                    data-testid="tab-back-office"
                  >
                    Back Office
                  </TabsTrigger>
                  <TabsTrigger
                    value="field-executives"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14"
                    data-testid="tab-field-executives"
                  >
                    Field Executives
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4">
                <TabsContent value="branch-managers" className="m-0">
                  <div className="flex justify-end mb-4">
                    <AddUserDialog userType="Branch Manager" />
                  </div>
                  <DataTable
                    columns={[
                      { key: "id", label: "ID" },
                      { key: "name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "branch", label: "Branch" },
                      { key: "phone", label: "Phone" },
                      { key: "status", label: "Status", render: (row) => <StatusCell status={row.status as string} /> },
                      { key: "actions", label: "", render: () => <ActionCell /> },
                    ]}
                    data={branchManagers}
                    searchPlaceholder="Search branch managers..."
                  />
                </TabsContent>

                <TabsContent value="team-leads" className="m-0">
                  <div className="flex justify-end mb-4">
                    <AddUserDialog userType="Team Lead" />
                  </div>
                  <DataTable
                    columns={[
                      { key: "id", label: "ID" },
                      { key: "name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "branch", label: "Branch" },
                      { key: "team", label: "Team" },
                      { key: "status", label: "Status", render: (row) => <StatusCell status={row.status as string} /> },
                      { key: "actions", label: "", render: () => <ActionCell /> },
                    ]}
                    data={teamLeads}
                    searchPlaceholder="Search team leads..."
                  />
                </TabsContent>

                <TabsContent value="back-office" className="m-0">
                  <div className="flex justify-end mb-4">
                    <AddUserDialog userType="Back Office Executive" />
                  </div>
                  <DataTable
                    columns={[
                      { key: "id", label: "ID" },
                      { key: "name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "branch", label: "Branch" },
                      { key: "casesHandled", label: "Cases Handled" },
                      { key: "status", label: "Status", render: (row) => <StatusCell status={row.status as string} /> },
                      { key: "actions", label: "", render: () => <ActionCell /> },
                    ]}
                    data={backOffice}
                    searchPlaceholder="Search back office users..."
                  />
                </TabsContent>

                <TabsContent value="field-executives" className="m-0">
                  <div className="flex justify-end mb-4">
                    <AddUserDialog userType="Field Executive" />
                  </div>
                  <DataTable
                    columns={[
                      { key: "id", label: "ID" },
                      { key: "name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "zone", label: "Zone" },
                      { key: "completedToday", label: "Completed Today" },
                      { key: "status", label: "Status", render: (row) => <StatusCell status={row.status as string} /> },
                      { key: "actions", label: "", render: () => <ActionCell /> },
                    ]}
                    data={fieldExecutives}
                    searchPlaceholder="Search field executives..."
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
