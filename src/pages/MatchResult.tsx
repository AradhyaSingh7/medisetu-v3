import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, Phone, ArrowRight } from "lucide-react";
import { resourceRequests, hospitals } from "@/data/mockData";
import { toast } from "sonner";

export const MatchResult = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const request = resourceRequests.find(r => r.id === requestId);
  const hospital = request?.assignedHospitalId 
    ? hospitals.find(h => h.id === request.assignedHospitalId)
    : null;

  if (!request || !hospital) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Request not found</h2>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </Card>
      </div>
    );
  }


  const resourceTypeLabels = {
    blood: "Blood Units",
    oxygen: "Oxygen Cylinders",
    icu: "ICU Bed",
    ambulance: "Ambulance"
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Match Found!</h1>
          <p className="text-lg text-muted-foreground">
            We've found the best hospital for your emergency
          </p>
        </div>

        {/* Request Details */}
        <Card className="p-6 mb-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Request Details</h2>
            <Badge className="bg-success text-success-foreground">Matched</Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <p className="text-lg font-semibold text-foreground">{request.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resource Type</p>
              <p className="text-lg font-semibold text-foreground">
                {resourceTypeLabels[request.resourceType]}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Units Required</p>
              <p className="text-lg font-semibold text-foreground">{request.unitsRequired}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-lg font-semibold text-foreground">{request.location}</p>
            </div>
          </div>

          {request.additionalNotes && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Additional Notes</p>
              <p className="text-foreground">{request.additionalNotes}</p>
            </div>
          )}
        </Card>

        {/* Assigned Hospital */}
        <Card className="p-6 mb-6 shadow-card-hover border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Assigned Hospital</h2>
            <Badge className="bg-primary text-primary-foreground">Best Match</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">{hospital.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <MapPin className="h-5 w-5" />
                <span>{hospital.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <span className="font-semibold">{hospital.contactNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4">
              <div className="p-4 rounded-lg bg-gradient-card text-center">
                <p className="text-sm text-muted-foreground mb-1">Blood Units</p>
                <p className="text-2xl font-bold text-foreground">{hospital.bloodUnits}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-card text-center">
                <p className="text-sm text-muted-foreground mb-1">Oxygen</p>
                <p className="text-2xl font-bold text-foreground">{hospital.oxygenCylinders}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-card text-center">
                <p className="text-sm text-muted-foreground mb-1">ICU Beds</p>
                <p className="text-2xl font-bold text-foreground">{hospital.icuBeds}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-card text-center">
                <p className="text-sm text-muted-foreground mb-1">Ambulances</p>
                <p className="text-2xl font-bold text-foreground">{hospital.ambulances}</p>
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-accent" />
                <p className="font-semibold text-foreground">Distance</p>
              </div>
              <p className="text-2xl font-bold text-accent">{hospital.distance} km away</p>
              <p className="text-sm text-muted-foreground mt-1">Estimated travel time: ~{Math.ceil(hospital.distance * 3)} minutes</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full h-14 text-lg"
          >
            View Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
