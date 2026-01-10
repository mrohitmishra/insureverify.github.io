import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/shared/DataTable";
import {
  FolderOpen,
  ClipboardCheck,
  Clock,
  Lock,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

type CaseListStatus = "Pending" | "In Progress" | "Completed";

type CaseListRow = {
  id: string;
  name: string;
  branch: string;
  client: string;
  clientBranch: string;
  receivedAt: string;
  completedAt: string;
  points: number;
  status: CaseListStatus;
};

function CaseStatusBadge({ status }: { status: CaseListStatus }) {
  // Spec-aligned badge colors: Pending=Yellow, In Progress=Blue, Completed=Green.
  const className =
    status === "Pending"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : status === "In Progress"
        ? "bg-blue-100 text-blue-700 border-blue-200"
        : "bg-emerald-100 text-emerald-700 border-emerald-200";

  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  );
}

function CaseListPage() {
  /**
   * Case List (refinement-only):
   * - Removes dashboard widgets/charts/panels from this route.
   * - Implements locked filter row + locked columns + icon-only actions.
   */
  const [vendorBranch, setVendorBranch] = useState<string>("all");
  const [client, setClient] = useState<string>("all");
  const [clientBranch, setClientBranch] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const [sortKey, setSortKey] = useState<
    "name" | "branch" | "client" | "receivedAt" | "completedAt" | "points" | null
  >(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const rows: CaseListRow[] = useMemo(
    () => [
      {
        id: "C-2026-101",
        name: "Rahul Sharma",
        branch: "Mumbai HQ",
        client: "HDFC Ergo",
        clientBranch: "Mumbai",
        receivedAt: "2026-01-08",
        completedAt: "2026-01-09",
        points: 12,
        status: "Completed",
      },
      {
        id: "C-2026-102",
        name: "Priya Patel",
        branch: "Delhi NCR",
        client: "ICICI Lombard",
        clientBranch: "Delhi",
        receivedAt: "2026-01-08",
        completedAt: "",
        points: 8,
        status: "In Progress",
      },
      {
        id: "C-2026-103",
        name: "Amit Kumar",
        branch: "Bangalore",
        client: "Bajaj Allianz",
        clientBranch: "Bangalore",
        receivedAt: "2026-01-07",
        completedAt: "",
        points: 6,
        status: "Pending",
      },
      {
        id: "C-2026-104",
        name: "Sunita Devi",
        branch: "Chennai",
        client: "Tata AIG",
        clientBranch: "Chennai",
        receivedAt: "2026-01-06",
        completedAt: "2026-01-08",
        points: 10,
        status: "Completed",
      },
      {
        id: "C-2026-105",
        name: "Vikram Singh",
        branch: "Mumbai HQ",
        client: "New India Assurance",
        clientBranch: "Pune",
        receivedAt: "2026-01-06",
        completedAt: "",
        points: 5,
        status: "Pending",
      },
    ],
    []
  );

  const uniqueVendorBranches = useMemo(
    () => Array.from(new Set(rows.map((r) => r.branch))).sort(),
    [rows]
  );
  const uniqueClients = useMemo(() => Array.from(new Set(rows.map((r) => r.client))).sort(), [rows]);
  const uniqueClientBranches = useMemo(
    () => Array.from(new Set(rows.map((r) => r.clientBranch))).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return rows
      .filter((r) => (vendorBranch === "all" ? true : r.branch === vendorBranch))
      .filter((r) => (client === "all" ? true : r.client === client))
      .filter((r) => (clientBranch === "all" ? true : r.clientBranch === clientBranch))
      .filter((r) => (status === "all" ? true : r.status === status))
      .filter((r) => (fromDate ? r.receivedAt >= fromDate : true))
      .filter((r) => (toDate ? r.receivedAt <= toDate : true))
      .filter((r) => {
        if (!normalizedSearch) return true;
        return (
          r.name.toLowerCase().includes(normalizedSearch) ||
          r.branch.toLowerCase().includes(normalizedSearch) ||
          r.client.toLowerCase().includes(normalizedSearch) ||
          r.id.toLowerCase().includes(normalizedSearch)
        );
      });
  }, [client, clientBranch, fromDate, rows, search, status, toDate, vendorBranch]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const paged = sorted.slice(start, start + pageSize);

  const resetFilters = () => {
    setVendorBranch("all");
    setClient("all");
    setClientBranch("all");
    setStatus("all");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const toggleSort = (key: typeof sortKey) => {
    setPage(1);
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

  const sortHeader = (label: string, key: Exclude<typeof sortKey, null>) => (
    <button
      type="button"
      className="inline-flex items-center gap-1 font-semibold text-foreground"
      onClick={() => toggleSort(key)}
      data-testid={`sort-${key}`}
    >
      {label}
      <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
    </button>
  );

  return (
    <DashboardLayout role="back-office" userName="Kiran Joshi">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Case List
          </h1>
          <p className="text-muted-foreground">List and filter cases</p>
        </div>

        {/* FILTER SECTION (TOP) — single horizontal row per spec */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <div className="flex flex-nowrap items-end gap-3 min-w-max">
              <div className="space-y-2 min-w-[180px]">
                <Label>Vendor Branch</Label>
                <Select
                  value={vendorBranch}
                  onValueChange={(v) => {
                    setVendorBranch(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger data-testid="filter-vendor-branch">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueVendorBranches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[180px]">
                <Label>Client</Label>
                <Select
                  value={client}
                  onValueChange={(v) => {
                    setClient(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger data-testid="filter-client">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueClients.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[180px]">
                <Label>Client Branch</Label>
                <Select
                  value={clientBranch}
                  onValueChange={(v) => {
                    setClientBranch(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger data-testid="filter-client-branch">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueClientBranches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[160px]">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => {
                    setStatus(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger data-testid="filter-status">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Received Date</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setPage(1);
                    }}
                    data-testid="filter-received-from"
                  />
                  <span className="text-muted-foreground">→</span>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPage(1);
                    }}
                    data-testid="filter-received-to"
                  />
                </div>
              </div>

              <Button variant="outline" onClick={resetFilters} data-testid="reset-filters">
                Reset Filters
              </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search input only filters table data (allowed per spec) */}
        <div className="flex items-center justify-end">
          <div className="w-full sm:w-[320px]">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              data-testid="case-list-search"
            />
          </div>
        </div>

        {/* TABLE STRUCTURE (LOCKED) — only these columns, in this order */}
        <div className="bg-card rounded-xl border border-card-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>{sortHeader("Name", "name")}</TableHead>
                <TableHead>{sortHeader("Branch", "branch")}</TableHead>
                <TableHead>{sortHeader("Client", "client")}</TableHead>
                <TableHead>{sortHeader("Received At", "receivedAt")}</TableHead>
                <TableHead>{sortHeader("Completed At", "completedAt")}</TableHead>
                <TableHead className="text-right">{sortHeader("Points", "points")}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((r, idx) => (
                  <TableRow key={r.id} className="hover:bg-transparent">
                    <TableCell className="text-muted-foreground">{start + idx + 1}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.branch}</TableCell>
                    <TableCell>{r.client}</TableCell>
                    <TableCell>{r.receivedAt}</TableCell>
                    <TableCell>{r.completedAt || "-"}</TableCell>
                    <TableCell className="text-right font-medium">{r.points}</TableCell>
                    <TableCell>
                      <CaseStatusBadge status={r.status} />
                    </TableCell>
                    <TableCell>
                      {/* Icon-only actions per spec. Row click does nothing. */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {}}
                          data-testid={`action-view-${r.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {}}
                          data-testid={`action-edit-${r.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {}}
                          data-testid={`action-delete-${r.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination (bottom) */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {paged.length ? start + 1 : 0}-{Math.min(start + pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageSafe <= 1}
              data-testid="case-list-prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">
              Page {pageSafe} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageSafe >= totalPages}
              data-testid="case-list-next"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function BackOfficeDashboard() {
  const [location] = useLocation();

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

  // Case List route must stay simple: ONLY listing + filtering.
  if (location === "/back-office/cases") {
    return <CaseListPage />;
  }

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
