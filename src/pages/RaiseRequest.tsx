import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const RaiseRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: "",
    resourceType: "blood" as "blood" | "oxygen" | "icu" | "ambulance",
    unitsRequired: 1,
    location: "",
    additionalNotes: ""
  });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.patientName || !formData.location) {
    toast.error("Please fill all required fields");
    return;
  }

  const { data, error } = await supabase
    .from("resource_requests")
    .insert({
      requester_name: formData.patientName,
      resource_type: formData.resourceType,
      units_required: formData.unitsRequired,
      location: formData.location,
      status: "pending",
    })
    .select()
    .single();
    if (data?.id) {
      await supabase.rpc("match_request", {
        request_id: data.id,
  });
}



  if (error) {
    console.error(error);
    toast.error("Failed to submit request");
    return;
  }


  await supabase.from("audit_logs").insert({
    action: "New Emergency Request",
    user_email: "system",
    details: {
      resourceType: formData.resourceType,
      units: formData.unitsRequired,
    },
  });

  toast.success("Emergency request submitted successfully!");


  navigate("/dashboard");
};


  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Raise Emergency Request</h1>
          <p className="text-lg text-muted-foreground">
            Fill in the details below and we'll find the best hospital for you
          </p>
        </div>

        <Card className="p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Enter patient name"
                required
              />
            </div>

            <div>
              <Label htmlFor="resourceType">Emergency Type *</Label>
              <Select
                value={formData.resourceType}
                onValueChange={(value: any) => setFormData({ ...formData, resourceType: value })}
              >
                <SelectTrigger id="resourceType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blood">Blood</SelectItem>
                  <SelectItem value="oxygen">Oxygen</SelectItem>
                  <SelectItem value="icu">ICU Bed</SelectItem>
                  <SelectItem value="ambulance">Ambulance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unitsRequired">Units Required *</Label>
              <Input
                id="unitsRequired"
                type="number"
                min="1"
                value={formData.unitsRequired}
                onChange={(e) => setFormData({ ...formData, unitsRequired: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location / Address *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter your current location"
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Any additional information (blood type, severity, etc.)"
                rows={4}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-destructive hover:bg-destructive/90">
                Submit Emergency Request
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
