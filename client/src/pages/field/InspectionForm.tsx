import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Camera,
  MapPin,
  CheckCircle2,
  Upload,
  X,
  Navigation,
  Loader2,
} from "lucide-react";

const formSections = [
  { id: "location", label: "Location", progress: 25 },
  { id: "property", label: "Property", progress: 50 },
  { id: "photos", label: "Photos", progress: 75 },
  { id: "submit", label: "Submit", progress: 100 },
];

export default function InspectionForm() {
  const [, navigate] = useLocation();
  const [currentSection, setCurrentSection] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "success">("idle");
  const [submitted, setSubmitted] = useState(false);

  const captureGPS = () => {
    setGpsStatus("loading");
    setTimeout(() => {
      setGpsStatus("success");
    }, 1500);
  };

  const addPhoto = () => {
    setPhotos([...photos, `photo-${photos.length + 1}`]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate("/field");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Inspection Submitted!
          </h2>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/field")}
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Inspection Form
            </h1>
            <p className="text-xs text-muted-foreground">Case #C-001 • Rahul Sharma</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{formSections[currentSection].label}</span>
            <span>{formSections[currentSection].progress}%</span>
          </div>
          <Progress value={formSections[currentSection].progress} className="h-2" />
        </div>
      </header>

      {/* Form Content */}
      <div className="p-4 space-y-4">
        {currentSection === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Registered Address</p>
                  <p className="text-sm text-muted-foreground">
                    123, MG Road, Andheri West, Mumbai - 400053
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Current GPS Location</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={gpsStatus === "success" ? "19.1234, 72.5678" : "Tap to capture"}
                      readOnly
                      className={gpsStatus === "success" ? "bg-emerald-50 border-emerald-200" : ""}
                      data-testid="gps-input"
                    />
                    <Button
                      variant={gpsStatus === "success" ? "secondary" : "default"}
                      onClick={captureGPS}
                      disabled={gpsStatus === "loading"}
                      data-testid="capture-gps"
                    >
                      {gpsStatus === "loading" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : gpsStatus === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {gpsStatus === "success" && (
                    <p className="text-xs text-emerald-600">GPS location captured successfully</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Nearby Landmark</Label>
                  <Input id="landmark" placeholder="e.g., Near SBI Bank" data-testid="input-landmark" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentSection === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select>
                    <SelectTrigger data-testid="select-property-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">Independent House</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floors">No. of Floors</Label>
                    <Input id="floors" type="number" placeholder="2" data-testid="input-floors" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Total Area (sq.ft)</Label>
                    <Input id="area" type="number" placeholder="1200" data-testid="input-area" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Property Condition</Label>
                  <Select>
                    <SelectTrigger data-testid="select-condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Inspection Remarks</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Enter your observations..."
                    rows={4}
                    data-testid="input-remarks"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentSection === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Photo Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Capture photos of the property from different angles. Minimum 4 photos required.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo, index) => (
                    <div
                      key={photo}
                      className="relative aspect-square bg-muted rounded-lg overflow-hidden"
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <Camera className="w-8 h-8 text-primary/50" />
                      </div>
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        data-testid={`remove-photo-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded">
                        Photo {index + 1}
                      </span>
                    </div>
                  ))}

                  <button
                    onClick={addPhoto}
                    className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                    data-testid="add-photo"
                  >
                    <Camera className="w-8 h-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  {photos.length}/4 photos captured
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentSection === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review & Submit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Case ID</span>
                    <span className="font-medium">C-001</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Insured Name</span>
                    <span className="font-medium">Rahul Sharma</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">GPS Captured</span>
                    <span className="font-medium text-emerald-600">Yes</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Photos</span>
                    <span className="font-medium">{photos.length} uploaded</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Please review all details before submitting. Once submitted, changes cannot be made.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border flex gap-3">
        {currentSection > 0 && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setCurrentSection(currentSection - 1)}
            data-testid="prev-section"
          >
            Previous
          </Button>
        )}
        {currentSection < 3 ? (
          <Button
            className="flex-1"
            onClick={() => setCurrentSection(currentSection + 1)}
            data-testid="next-section"
          >
            Next
          </Button>
        ) : (
          <Button className="flex-1" onClick={handleSubmit} data-testid="submit-inspection">
            Submit Inspection
          </Button>
        )}
      </div>
    </div>
  );
}
