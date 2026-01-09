import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageVendors from "@/pages/admin/ManageVendors";
import VendorDashboard from "@/pages/vendor/VendorDashboard";
import UserManagement from "@/pages/vendor/UserManagement";
import ReportBuilder from "@/pages/vendor/ReportBuilder";
import BackOfficeDashboard from "@/pages/backoffice/BackOfficeDashboard";
import AddNewCase from "@/pages/backoffice/AddNewCase";
import FieldDashboard from "@/pages/field/FieldDashboard";
import InspectionForm from "@/pages/field/InspectionForm";
import InsuranceDashboard from "@/pages/insurance/InsuranceDashboard";

function Router() {
  return (
    <Switch>
      {/* Login */}
      <Route path="/" component={Login} />

      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/vendors" component={ManageVendors} />
      <Route path="/admin/health" component={AdminDashboard} />
      <Route path="/admin/audit" component={AdminDashboard} />

      {/* Master Vendor Routes */}
      <Route path="/vendor" component={VendorDashboard} />
      <Route path="/vendor/cases" component={VendorDashboard} />
      <Route path="/vendor/users/:type" component={UserManagement} />
      <Route path="/vendor/clients/:type" component={VendorDashboard} />
      <Route path="/vendor/config/points" component={ReportBuilder} />
      <Route path="/vendor/config/reports" component={ReportBuilder} />
      <Route path="/vendor/branches" component={VendorDashboard} />
      <Route path="/vendor/payments" component={VendorDashboard} />
      <Route path="/vendor/mail" component={VendorDashboard} />

      {/* Back Office Routes */}
      <Route path="/back-office" component={BackOfficeDashboard} />
      <Route path="/back-office/new-case" component={AddNewCase} />
      <Route path="/back-office/cases" component={BackOfficeDashboard} />
      <Route path="/back-office/in-progress" component={BackOfficeDashboard} />
      <Route path="/back-office/mis" component={BackOfficeDashboard} />

      {/* Field Executive Routes */}
      <Route path="/field" component={FieldDashboard} />
      <Route path="/field/pending" component={FieldDashboard} />
      <Route path="/field/ongoing" component={FieldDashboard} />
      <Route path="/field/completed" component={FieldDashboard} />
      <Route path="/field/inspection/:id" component={InspectionForm} />

      {/* Insurance Company Routes */}
      <Route path="/insurance" component={InsuranceDashboard} />
      <Route path="/insurance/upload" component={InsuranceDashboard} />
      <Route path="/insurance/cases" component={InsuranceDashboard} />
      <Route path="/insurance/reports" component={InsuranceDashboard} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const base =
    import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/"
      ? import.meta.env.BASE_URL.replace(/\/$/, "")
      : undefined;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <WouterRouter base={base}>
          <Router />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
