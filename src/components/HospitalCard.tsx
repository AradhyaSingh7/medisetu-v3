import { Hospital } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Droplet, Wind, Bed, Ambulance, AlertTriangle } from "lucide-react";

interface HospitalCardProps {
  hospital: Hospital;
  onRequestClick: (hospital: Hospital) => void;
}

const getStatusBadge = (quantity: number, type: string) => {
  if (quantity === 0) {
    return <Badge variant="destructive" className="flex items-center gap-1">
      <AlertTriangle className="h-3 w-3" />
      Unavailable
    </Badge>;
  }
  if (quantity < 5) {
    return <Badge className="bg-warning text-warning-foreground flex items-center gap-1">
      <AlertTriangle className="h-3 w-3" />
      Low Stock
    </Badge>;
  }
  return <Badge className="bg-success text-success-foreground">Available</Badge>;
};

export const HospitalCard = ({ hospital, onRequestClick }: HospitalCardProps) => {
  return (
    <Card className="p-6 hover:shadow-card-hover transition-all duration-300 border-border/50 bg-gradient-card">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-foreground">{hospital.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{hospital.location} • {hospital.distance} km away</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">Blood Units</p>
                <p className="text-lg font-bold text-foreground">{hospital.bloodUnits}</p>
              </div>
            </div>
            {getStatusBadge(hospital.bloodUnits, 'blood')}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">Oxygen</p>
                <p className="text-lg font-bold text-foreground">{hospital.oxygenCylinders}</p>
              </div>
            </div>
            {getStatusBadge(hospital.oxygenCylinders, 'oxygen')}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">ICU Beds</p>
                <p className="text-lg font-bold text-foreground">{hospital.icuBeds}</p>
              </div>
            </div>
            {getStatusBadge(hospital.icuBeds, 'icu')}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <Ambulance className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Ambulances</p>
                <p className="text-lg font-bold text-foreground">{hospital.ambulances}</p>
              </div>
            </div>
            {getStatusBadge(hospital.ambulances, 'ambulance')}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{hospital.contactNumber}</span>
        </div>

        <Button 
          onClick={() => onRequestClick(hospital)}
          className="w-full"
        >
          Request Resource
        </Button>
      </div>
    </Card>
  );
};
