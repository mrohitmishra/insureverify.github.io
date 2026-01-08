import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, MessageSquare, Mail, FileText, CheckCircle2 } from "lucide-react";

export default function AddNewCase() {
  const [, navigate] = useLocation();
  const [source, setSource] = useState<"whatsapp" | "email" | "manual">("manual");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate("/back-office");
    }, 2000);
  };

  if (submitted) {
    return (
      <DashboardLayout role="back-office" userName="Kiran Joshi">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Case Created Successfully!
            </h2>
            <p className="text-muted-foreground">Redirecting to dashboard...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="back-office" userName="Kiran Joshi">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/back-office")}
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Add New Case
            </h1>
            <p className="text-muted-foreground">Create a new verification case manually</p>
          </div>
        </div>

        {/* Source Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "whatsapp", label: "From WhatsApp", icon: MessageSquare, color: "text-green-500" },
            { id: "email", label: "From Email", icon: Mail, color: "text-blue-500" },
            { id: "manual", label: "Manual Entry", icon: FileText, color: "text-purple-500" },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSource(item.id as "whatsapp" | "email" | "manual")}
              className={`p-4 rounded-xl border-2 transition-all ${
                source === item.id
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-muted-foreground/30"
              }`}
              data-testid={`source-${item.id}`}
            >
              <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
              <p className="font-medium text-sm">{item.label}</p>
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Form */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle style={{ fontFamily: "var(--font-display)" }}>Case Details</CardTitle>
                <CardDescription>Enter the verification case information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Client Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Client Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceCompany">Insurance Company *</Label>
                      <Select>
                        <SelectTrigger data-testid="select-insurance-company">
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hdfc">HDFC Ergo</SelectItem>
                          <SelectItem value="icici">ICICI Lombard</SelectItem>
                          <SelectItem value="bajaj">Bajaj Allianz</SelectItem>
                          <SelectItem value="tata">Tata AIG</SelectItem>
                          <SelectItem value="newindia">New India Assurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="caseType">Case Type *</Label>
                      <Select>
                        <SelectTrigger data-testid="select-case-type">
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
                  </div>
                </div>

                {/* Insured Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Insured Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuredName">Insured Name *</Label>
                      <Input id="insuredName" placeholder="Full name" data-testid="input-insured-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyNumber">Policy Number</Label>
                      <Input id="policyNumber" placeholder="Policy number" data-testid="input-policy-number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Phone *</Label>
                      <Input id="phone" type="tel" placeholder="+91 98765 43210" data-testid="input-phone" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@example.com" data-testid="input-email" />
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Location Details
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address *</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter complete address"
                        rows={3}
                        data-testid="input-address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input id="pincode" placeholder="400001" data-testid="input-pincode" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Mumbai" data-testid="input-city" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="Maharashtra" data-testid="input-state" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or notes..."
                    rows={4}
                    data-testid="input-notes"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
                    Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Assign to Branch</Label>
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
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    data-testid="document-upload-area"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Upload documents</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, Images up to 10MB</p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="space-y-3">
                <Button type="submit" className="w-full" size="lg" data-testid="submit-case">
                  Create Case
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/back-office")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
