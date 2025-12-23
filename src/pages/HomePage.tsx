import { useState, useEffect } from "react";
import { HospitalCard } from "@/components/HospitalCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Heart, Building2, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";


export const HomePage = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [resourceType, setResourceType] = useState<string>("all");
  const [range, setRange] = useState(10);

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<any[]>([]);
useEffect(() => {
  const fetchHospitals = async () => {
    const { data: hospitalsData, error: hErr } = await supabase
      .from("hospitals")
      .select("*");

    const { data: inventoryData, error: iErr } = await supabase
      .from("inventory")
      .select("*");

    if (hErr || iErr) {
      console.error(hErr || iErr);
      return;
    }

    // merge inventory into hospitals
    const enrichedHospitals = hospitalsData.map((h: any) => {
      const inv = inventoryData.filter(
        (i: any) => i.hospital_id === h.id
      );

      const inventoryMap: Record<string, number> = {};
      inv.forEach((i: any) => {
        inventoryMap[i.resource_type] = i.quantity;
      });

      return {
        ...h,
        inventory: inventoryMap,
      };
    });

    setHospitals(enrichedHospitals);
    setFilteredHospitals(enrichedHospitals);
  };

  fetchHospitals();
}, []);




  const handleSearch = () => {
    let filtered = hospitals.filter(h => h.distance <= range);

    if (location) {
      filtered = filtered.filter(h => 
        h.location.toLowerCase().includes(location.toLowerCase()) ||
        h.name.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (resourceType !== "all") {
      filtered = filtered.filter(h => {
        switch (resourceType) {
          case "blood":
            return (h.inventory?.blood ?? 0) > 0;
          case "oxygen":
            return (h.inventory?.oxygen ?? 0) > 0;
          case "icu":
            return (h.inventory?.icu ?? 0) > 0;
          case "ambulance":
            return (h.inventory?.ambulance ?? 0) > 0;
          default:
            return true;
        }
  });
}


    setFilteredHospitals(filtered);
  };

const handleRequestClick = (hospital: any) => {
  navigate("/raise-request", {
    state: {
      resourceType: resourceType !== "all" ? resourceType : "blood",
      location: hospital.location,
    },
  });
};


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Your Medical <span className="text-accent">Lifeline</span>
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-white/90">Always Available</p>
          <p className="text-lg mb-8 text-white/80">
            Connecting hope with help. Find life-saving medical resources instantly when every second counts.
          </p>

          {/* Resource Type Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <Card className="p-6 text-center hover:shadow-card-hover transition-all cursor-pointer bg-white/10 backdrop-blur border-white/20">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-white mb-1">Blood Bank</h3>
              <p className="text-sm text-white/80">Find blood donors & banks</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-card-hover transition-all cursor-pointer bg-white/10 backdrop-blur border-white/20">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-white mb-1">ICU Beds</h3>
              <p className="text-sm text-white/80">Available ICU beds nearby</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-card-hover transition-all cursor-pointer bg-white/10 backdrop-blur border-white/20">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-white mb-1">Oxygen Supply</h3>
              <p className="text-sm text-white/80">Oxygen cylinders & concentrators</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-card-hover transition-all cursor-pointer bg-white/10 backdrop-blur border-white/20">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-warning" />
              </div>
              <h3 className="font-semibold text-white mb-1">Ambulance</h3>
              <p className="text-sm text-white/80">Emergency transport services</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <Card className="p-6 shadow-card-hover bg-card">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="location" className="mb-2 block">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Enter city or hospital"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="resource" className="mb-2 block">Resource Type</Label>
              <Select value={resourceType} onValueChange={setResourceType}>
                <SelectTrigger id="resource">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="blood">Blood</SelectItem>
                  <SelectItem value="oxygen">Oxygen</SelectItem>
                  <SelectItem value="icu">ICU Beds</SelectItem>
                  <SelectItem value="ambulance">Ambulance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="range" className="mb-2 block">Range: {range} km</Label>
              <Input
                id="range"
                type="range"
                min="1"
                max="50"
                value={range}
                onChange={(e) => setRange(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="md:col-span-1 flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">
          Available Hospitals ({filteredHospitals.length})
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onRequestClick={handleRequestClick}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
