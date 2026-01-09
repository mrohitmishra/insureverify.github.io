import { useMemo, useState } from "react";
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
  X,
  Navigation,
  Loader2,
} from "lucide-react";

type VehicleCategory = "two-wheeler" | "four-wheeler";
type Answer = "yes" | "no" | "na";

type InspectionItem = {
  id: string;
  label: string;
};

type InspectionSection = {
  id: string;
  label: string;
  items: InspectionItem[];
};

const FORM_SECTIONS = [
  { id: "vehicle", label: "Vehicle", progress: 25 },
  { id: "inspection", label: "Inspection", progress: 50 },
  { id: "photos", label: "Photos", progress: 75 },
  { id: "submit", label: "Submit", progress: 100 },
] as const;

const INSPECTION_STRUCTURE: Record<VehicleCategory, InspectionSection[]> = {
  "two-wheeler": [
    {
      id: "front",
      label: "Front Section",
      items: [
        { id: "tw_front_mudguard_damaged", label: "Front mudguard damaged" },
        { id: "tw_headlight_broken", label: "Headlight broken" },
        { id: "tw_indicator_damaged", label: "Indicator damaged" },
        { id: "tw_front_suspension_issue", label: "Front suspension issue" },
        { id: "tw_handle_misalignment", label: "Handle misalignment" },
      ],
    },
    {
      id: "side",
      label: "Side Body (Left / Right)",
      items: [
        { id: "tw_side_panel_scratches_dents", label: "Side panel scratches / dents" },
        { id: "tw_footrest_damage", label: "Footrest damage" },
        { id: "tw_gear_lever_damage", label: "Gear lever damage" },
        { id: "tw_brake_pedal_damage", label: "Brake pedal damage" },
        { id: "tw_exhaust_damage", label: "Exhaust damage" },
      ],
    },
    {
      id: "rear",
      label: "Rear Section",
      items: [
        { id: "tw_rear_mudguard_damage", label: "Rear mudguard damaged" },
        { id: "tw_tail_light_damage", label: "Tail light damaged" },
        { id: "tw_rear_indicator_damage", label: "Rear indicator damaged" },
        { id: "tw_saree_guard_damage", label: "Saree guard damage" },
        { id: "tw_rear_number_plate_damage", label: "Rear number plate damage" },
      ],
    },
    {
      id: "wheels",
      label: "Wheels & Tyres",
      items: [
        { id: "tw_front_tyre_condition", label: "Front tyre condition issue" },
        { id: "tw_rear_tyre_condition", label: "Rear tyre condition issue" },
        { id: "tw_rim_alloy_damage", label: "Rim / alloy damage" },
        { id: "tw_wheel_alignment_issue", label: "Wheel alignment issue" },
      ],
    },
    {
      id: "engine_electrical",
      label: "Engine & Electrical",
      items: [
        { id: "tw_engine_oil_leakage", label: "Engine oil leakage" },
        { id: "tw_abnormal_engine_noise", label: "Abnormal engine noise" },
        { id: "tw_self_start_issue", label: "Self-start not functioning" },
        { id: "tw_horn_issue", label: "Horn not functioning" },
        { id: "tw_indicator_function_issue", label: "Indicator not functioning" },
        { id: "tw_brake_light_issue", label: "Brake light not functioning" },
      ],
    },
  ],
  "four-wheeler": [
    {
      id: "front",
      label: "Front Section",
      items: [
        { id: "fw_front_bumper_damage", label: "Front bumper scratches / cracks" },
        { id: "fw_bonnet_damage", label: "Bonnet dents / scratches" },
        { id: "fw_headlight_damage", label: "Headlight damage" },
        { id: "fw_fog_lamp_damage", label: "Fog lamp damage" },
      ],
    },
    {
      id: "side",
      label: "Side Body (Left / Right)",
      items: [
        { id: "fw_front_door_damage", label: "Front door dents / scratches" },
        { id: "fw_rear_door_damage", label: "Rear door dents / scratches" },
        { id: "fw_orvm_damage", label: "ORVM damage" },
        { id: "fw_side_cladding_damage", label: "Side cladding damage" },
      ],
    },
    {
      id: "rear",
      label: "Rear Section",
      items: [
        { id: "fw_rear_bumper_damage", label: "Rear bumper damage" },
        { id: "fw_boot_damage", label: "Boot damage" },
        { id: "fw_tail_lamp_damage", label: "Tail lamp damage" },
        { id: "fw_rear_number_plate_damage", label: "Rear number plate damage" },
      ],
    },
    {
      id: "roof_glass",
      label: "Roof & Glass",
      items: [
        { id: "fw_roof_dents_scratches", label: "Roof dents / scratches" },
        { id: "fw_windshield_glass_damage", label: "Windshield / side glass damage" },
      ],
    },
    {
      id: "wheels_engine_bay",
      label: "Wheels, Tyres & Engine Bay",
      items: [
        { id: "fw_tyre_condition_issue", label: "Tyre condition issue" },
        { id: "fw_alloy_damage", label: "Alloy damage" },
        { id: "fw_spare_wheel_missing", label: "Spare wheel missing" },
        { id: "fw_oil_leakage", label: "Oil leakage" },
        { id: "fw_coolant_leakage", label: "Coolant leakage" },
        { id: "fw_battery_condition_issue", label: "Battery condition issue" },
      ],
    },
    {
      id: "interior_safety",
      label: "Interior & Safety",
      items: [
        { id: "fw_dashboard_damage", label: "Dashboard damage" },
        { id: "fw_seat_condition_issue", label: "Seat condition issue" },
        { id: "fw_airbag_deployed", label: "Airbag deployed" },
      ],
    },
  ],
};

export default function InspectionForm() {
  const [, navigate] = useLocation();
  const [currentSection, setCurrentSection] = useState(0);
  const [category, setCategory] = useState<VehicleCategory | "">("");

  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleNumber: "",
    engineNumber: "",
    chassisNumber: "",
    makeModel: "",
    manufacturingYear: "",
    odometer: "",
    fuelType: "",
  });

  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
  const [photosByItem, setPhotosByItem] = useState<Record<string, string[]>>({});
  const [additionalRemarks, setAdditionalRemarks] = useState("");

  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "success">("idle");
  const [gpsCoords, setGpsCoords] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const captureGPS = () => {
    setGpsStatus("loading");
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);
          setGpsCoords(`${lat}, ${lng}`);
          setGpsStatus("success");
        },
        () => {
          setGpsCoords("19.123400, 72.567800");
          setGpsStatus("success");
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
      return;
    }
    setTimeout(() => {
      setGpsCoords("19.123400, 72.567800");
      setGpsStatus("success");
    }, 1200);
  };

  const setAnswer = (itemId: string, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  };

  const addPhotoForItem = (itemId: string) => {
    setPhotosByItem((prev) => {
      const existing = prev[itemId] ?? [];
      return { ...prev, [itemId]: [...existing, `photo-${existing.length + 1}`] };
    });
  };

  const removePhotoForItem = (itemId: string, index: number) => {
    setPhotosByItem((prev) => {
      const existing = prev[itemId] ?? [];
      return { ...prev, [itemId]: existing.filter((_, i) => i !== index) };
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate("/field");
    }, 2000);
  };

  const inspectionSections = useMemo(() => {
    if (!category) return [];
    return INSPECTION_STRUCTURE[category];
  }, [category]);

  const allInspectionItems = useMemo(() => {
    return inspectionSections.flatMap((s) => s.items);
  }, [inspectionSections]);

  const yesItemIds = useMemo(() => {
    return allInspectionItems
      .map((i) => i.id)
      .filter((id) => answers[id] === "yes");
  }, [allInspectionItems, answers]);

  const missingRequiredPhotoItemIds = useMemo(() => {
    return yesItemIds.filter((id) => (photosByItem[id]?.length ?? 0) === 0);
  }, [yesItemIds, photosByItem]);

  const totalPhotoCount = useMemo(() => {
    return Object.values(photosByItem).reduce((sum, arr) => sum + (arr?.length ?? 0), 0);
  }, [photosByItem]);

  const canGoNext = useMemo(() => {
    if (currentSection === 0) {
      return Boolean(category) && gpsStatus === "success";
    }
    if (currentSection === 1) {
      return Boolean(vehicleDetails.vehicleNumber) && Boolean(vehicleDetails.chassisNumber);
    }
    if (currentSection === 2) {
      return missingRequiredPhotoItemIds.length === 0;
    }
    return true;
  }, [category, currentSection, gpsStatus, missingRequiredPhotoItemIds.length, vehicleDetails.chassisNumber, vehicleDetails.vehicleNumber]);

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
              Vehicle Inspection
            </h1>
            <p className="text-xs text-muted-foreground">Case #C-001 • Rahul Sharma</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{FORM_SECTIONS[currentSection].label}</span>
            <span>{FORM_SECTIONS[currentSection].progress}%</span>
          </div>
          <Progress value={FORM_SECTIONS[currentSection].progress} className="h-2" />
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
                  Evidence Capture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Category</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as VehicleCategory)}>
                      <SelectTrigger data-testid="select-vehicle-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="two-wheeler">Two-Wheeler (Bike / Scooter)</SelectItem>
                        <SelectItem value="four-wheeler">Four-Wheeler (Car)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timestamp</Label>
                    <Input value={new Date().toLocaleString()} readOnly data-testid="timestamp" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>GPS Location</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={gpsStatus === "success" ? gpsCoords : "Tap to capture"}
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

                <p className="text-xs text-muted-foreground">
                  Photos captured for any marked damage are mandatory and will be included with timestamp and geo-location.
                </p>
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
                <CardTitle className="text-lg">Vehicle Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                    <Input
                      id="vehicleNumber"
                      placeholder="e.g., MH01AB1234"
                      value={vehicleDetails.vehicleNumber}
                      onChange={(e) => setVehicleDetails((p) => ({ ...p, vehicleNumber: e.target.value }))}
                      data-testid="input-vehicle-number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="makeModel">Make & Model</Label>
                    <Input
                      id="makeModel"
                      placeholder="e.g., Honda Activa"
                      value={vehicleDetails.makeModel}
                      onChange={(e) => setVehicleDetails((p) => ({ ...p, makeModel: e.target.value }))}
                      data-testid="input-make-model"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engineNumber">Engine Number</Label>
                    <Input
                      id="engineNumber"
                      placeholder="Engine number"
                      value={vehicleDetails.engineNumber}
                      onChange={(e) => setVehicleDetails((p) => ({ ...p, engineNumber: e.target.value }))}
                      data-testid="input-engine-number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chassisNumber">Chassis Number *</Label>
                    <Input
                      id="chassisNumber"
                      placeholder="Chassis number"
                      value={vehicleDetails.chassisNumber}
                      onChange={(e) => setVehicleDetails((p) => ({ ...p, chassisNumber: e.target.value }))}
                      data-testid="input-chassis-number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturingYear">Manufacturing Year</Label>
                    <Input
                      id="manufacturingYear"
                      placeholder="e.g., 2021"
                      value={vehicleDetails.manufacturingYear}
                      onChange={(e) => setVehicleDetails((p) => ({ ...p, manufacturingYear: e.target.value }))}
                      data-testid="input-manufacturing-year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="odometer">Odometer Reading</Label>
                    <Input
                      id="odometer"
                      placeholder="e.g., 24500"
                      value={vehicleDetails.odometer}
                      onChange={(e) => setVehicleDetails((p) => ({ ...p, odometer: e.target.value }))}
                      data-testid="input-odometer"
                    />
                  </div>
                </div>

                {category === "four-wheeler" && (
                  <div className="space-y-2">
                    <Label>Fuel Type</Label>
                    <Select
                      value={vehicleDetails.fuelType}
                      onValueChange={(v) => setVehicleDetails((p) => ({ ...p, fuelType: v }))}
                    >
                      <SelectTrigger data-testid="select-fuel-type">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Card className="border border-card-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Predefined Inspection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!category ? (
                      <p className="text-sm text-muted-foreground">Select a vehicle category in the previous step.</p>
                    ) : (
                      inspectionSections.map((section) => (
                        <div key={section.id} className="space-y-3">
                          <p className="text-sm font-medium">{section.label}</p>
                          <div className="space-y-3">
                            {section.items.map((item) => (
                              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                <p className="text-sm">{item.label}</p>
                                <Select
                                  value={answers[item.id]}
                                  onValueChange={(v) => setAnswer(item.id, v as Answer)}
                                >
                                  <SelectTrigger data-testid={`select-${item.id}`}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                    <SelectItem value="na">Not Applicable</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}

                    <div className="space-y-2 pt-2">
                      <Label htmlFor="additionalRemarks">Additional Observations</Label>
                      <Textarea
                        id="additionalRemarks"
                        placeholder="If anything is not covered above, write it here..."
                        rows={3}
                        value={additionalRemarks}
                        onChange={(e) => setAdditionalRemarks(e.target.value)}
                        data-testid="input-additional-remarks"
                      />
                    </div>
                  </CardContent>
                </Card>
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
                  If any inspection point is marked as Yes, at least one photo is required for that item.
                </p>

                {yesItemIds.length === 0 ? (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">No damage items marked as Yes. Photos are optional.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {yesItemIds.map((itemId) => {
                      const label = allInspectionItems.find((i) => i.id === itemId)?.label ?? itemId;
                      const itemPhotos = photosByItem[itemId] ?? [];
                      return (
                        <div key={itemId} className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div>
                              <p className="text-sm font-medium">{label}</p>
                              <p className="text-xs text-muted-foreground">Photo required</p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addPhotoForItem(itemId)}
                              data-testid={`add-photo-${itemId}`}
                            >
                              <Camera className="w-4 h-4" />
                              Add photo
                            </Button>
                          </div>

                          {itemPhotos.length === 0 ? (
                            <p className="text-xs text-destructive">Missing required photo</p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {itemPhotos.map((photo, index) => (
                                <div key={photo} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                                    <Camera className="w-8 h-8 text-primary/50" />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removePhotoForItem(itemId, index)}
                                    className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                                    data-testid={`remove-photo-${itemId}-${index}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                  <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded">
                                    Photo {index + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {missingRequiredPhotoItemIds.length > 0 && (
                  <p className="text-sm text-destructive mt-4" data-testid="missing-photo-warning">
                    Add required photos before continuing.
                  </p>
                )}
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
                    <span className="text-muted-foreground">Vehicle Category</span>
                    <span className="font-medium">
                      {category === "two-wheeler" ? "Two-Wheeler" : category === "four-wheeler" ? "Four-Wheeler" : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Vehicle Number</span>
                    <span className="font-medium">{vehicleDetails.vehicleNumber || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Chassis Number</span>
                    <span className="font-medium">{vehicleDetails.chassisNumber || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">GPS Captured</span>
                    <span className="font-medium text-emerald-600">Yes</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">GPS</span>
                    <span className="font-medium">{gpsCoords || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Damage Marked</span>
                    <span className="font-medium">{yesItemIds.length}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Photos</span>
                    <span className="font-medium">{totalPhotoCount} uploaded</span>
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
            disabled={!canGoNext}
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
