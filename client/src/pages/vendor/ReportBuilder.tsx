import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileSpreadsheet,
  Eye,
  EyeOff,
  Asterisk,
  GripVertical,
  Plus,
  Trash2,
  FileText,
  Download,
  Settings2,
} from "lucide-react";

const reportSections = [
  { id: "basic", name: "Basic Information", fields: ["Policy Number", "Insured Name", "Address", "Contact Number"] },
  { id: "inspection", name: "Inspection Details", fields: ["Date of Inspection", "Inspector Name", "Location GPS", "Weather Conditions"] },
  { id: "property", name: "Property Details", fields: ["Type of Property", "Construction Year", "Total Area", "Number of Floors"] },
  { id: "findings", name: "Inspection Findings", fields: ["Condition Assessment", "Risk Factors", "Recommendations", "Photos"] },
];

interface Field {
  id: string;
  name: string;
  visibility: "mandatory" | "optional" | "hidden";
  placeholder?: string;
}

export default function ReportBuilder() {
  const [selectedSection, setSelectedSection] = useState("basic");
  const [fields, setFields] = useState<Field[]>([
    { id: "1", name: "Policy Number", visibility: "mandatory", placeholder: "{{policy_number}}" },
    { id: "2", name: "Insured Name", visibility: "mandatory", placeholder: "{{insured_name}}" },
    { id: "3", name: "Address", visibility: "mandatory", placeholder: "{{address}}" },
    { id: "4", name: "Contact Number", visibility: "optional", placeholder: "{{contact}}" },
  ]);

  const toggleVisibility = (id: string) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        const order: Field["visibility"][] = ["mandatory", "optional", "hidden"];
        const currentIndex = order.indexOf(f.visibility);
        return { ...f, visibility: order[(currentIndex + 1) % 3] };
      }
      return f;
    }));
  };

  const VisibilityIcon = ({ visibility }: { visibility: Field["visibility"] }) => {
    switch (visibility) {
      case "mandatory":
        return <Asterisk className="w-4 h-4 text-red-500" />;
      case "optional":
        return <Eye className="w-4 h-4 text-blue-500" />;
      case "hidden":
        return <EyeOff className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout role="master-vendor" userName="Vendor Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Report Builder
            </h1>
            <p className="text-muted-foreground">Configure report structure and field visibility</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" data-testid="import-excel">
              <FileSpreadsheet className="w-4 h-4" />
              Import Excel
            </Button>
            <Button className="gap-2" data-testid="save-template">
              <Download className="w-4 h-4" />
              Save Template
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
                Upload Report Template
              </CardTitle>
              <CardDescription>Upload an Excel file to define report structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                data-testid="upload-area"
              >
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Drop your Excel file here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Select File
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-sm">Report Sections</h4>
                {reportSections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      selectedSection === section.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/50 hover:bg-muted"
                    }`}
                    data-testid={`section-${section.id}`}
                  >
                    <span className="text-sm font-medium">{section.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {section.fields.length} fields
                    </Badge>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Field Configuration */}
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
                  Field Configuration
                </CardTitle>
                <CardDescription>Configure field visibility and placeholders</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-2" data-testid="add-field">
                <Plus className="w-4 h-4" />
                Add Field
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Asterisk className="w-3.5 h-3.5 text-red-500" />
                  <span>Mandatory</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>Optional</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Hidden</span>
                </div>
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 group"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <Input
                        value={field.name}
                        className="bg-background"
                        data-testid={`field-name-${field.id}`}
                      />
                      <Input
                        value={field.placeholder}
                        placeholder="{{placeholder}}"
                        className="bg-background font-mono text-sm"
                        data-testid={`field-placeholder-${field.id}`}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleVisibility(field.id)}
                      data-testid={`toggle-visibility-${field.id}`}
                    >
                      <VisibilityIcon visibility={field.visibility} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`delete-field-${field.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Export Options */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Export Options
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">PDF Export</p>
                        <p className="text-xs text-muted-foreground">Generate PDF reports</p>
                      </div>
                    </div>
                    <Switch defaultChecked data-testid="toggle-pdf-export" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">DOCX Export</p>
                        <p className="text-xs text-muted-foreground">Generate Word documents</p>
                      </div>
                    </div>
                    <Switch data-testid="toggle-docx-export" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
