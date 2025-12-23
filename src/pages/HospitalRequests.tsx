// import { useState, useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { supabase } from "@/integrations/supabase/client";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Ambulance, MapPin, User, Package } from "lucide-react";
// import { toast } from "sonner";

// export default function HospitalRequests() {
//   const navigate = useNavigate();
//   const [requests, setRequests] = useState<any[]>([]);
//   const [hospitals, setHospitals] = useState<any[]>([]);
//   const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

//   const selectedHospital = hospitals.find(
//   h => h.id === selectedHospitalId
// );

//   useEffect(() => {
//   const loadData = async () => {
//   const { data: hosp } = await supabase.from("hospitals").select("*");
//   const { data: reqs } = await supabase
//       .from("resource_requests")
//       .select("*")
//       .eq("status", "matched");

//     setHospitals(hosp || []);
//     setRequests(reqs || []);

//     if (hosp && hosp.length > 0) {
//       setSelectedHospitalId(hosp[0].id);
//     }
//   };

//   loadData();
//   }, []);

//     const hospitalRequests = requests.filter(
//     r => r.matched_hospital_id === selectedHospitalId
//   );


//   const handleDispatch = async (requestId: string) => {
//   const { error } = await supabase.rpc("dispatch_request", {
//     request_id: requestId,
//   });

//   if (error) {
//     console.error(error);
//     toast.error("Dispatch failed");
//     return;
//   }

//   toast.success("Resource dispatched successfully");

//   // refresh
//   const { data } = await supabase
//     .from("resource_requests")
//     .select("*")
//     .eq("status", "matched");

//   setRequests(data || []);
// };


//   const resourceTypeLabels = {
//     blood: "Blood Units",
//     oxygen: "Oxygen Cylinders",
//     icu: "ICU Beds",
//     ambulance: "Ambulances"
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-4xl font-bold text-foreground mb-2">Hospital Requests</h1>
//             <p className="text-muted-foreground">Manage incoming emergency requests and dispatch ambulances</p>
//           </div>
//           <Button variant="outline" onClick={() => navigate('/dashboard')}>
//             View All Requests
//           </Button>
//         </div>

//         <Card className="p-6">
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium mb-2 block">Select Hospital</label>
//               <Select value={selectedHospitalId} onValueChange={setSelectedHospitalId}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {hospitals.map((hospital) => (
//                     <SelectItem key={hospital.id} value={hospital.id}>
//                       {hospital.name} - {hospital.location}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {selectedHospital && (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary/30 rounded-lg">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Blood Units</p>
//                   <p className="text-2xl font-bold text-foreground">{selectedHospital.bloodUnits}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Oxygen</p>
//                   <p className="text-2xl font-bold text-foreground">{selectedHospital.oxygenCylinders}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">ICU Beds</p>
//                   <p className="text-2xl font-bold text-foreground">{selectedHospital.icuBeds}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Ambulances</p>
//                   <p className="text-2xl font-bold text-foreground">{selectedHospital.ambulances}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </Card>

//         <Card className="p-6">
//           <h2 className="text-2xl font-bold text-foreground mb-4">Pending Dispatch ({hospitalRequests.length})</h2>
          
//           {hospitalRequests.length === 0 ? (
//             <div className="text-center py-12">
//               <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//               <p className="text-muted-foreground">No pending requests for this hospital</p>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Request ID</TableHead>
//                   <TableHead>Patient</TableHead>
//                   <TableHead>Resource</TableHead>
//                   <TableHead>Units</TableHead>
//                   <TableHead>Location</TableHead>
//                   <TableHead>Time</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {hospitalRequests.map((request) => (
//                   <TableRow key={request.id}>
//                     <TableCell className="font-mono text-sm">{request.id}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <User className="h-4 w-4 text-muted-foreground" />
//                         {request.requester_name}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline">
//                         {resourceTypeLabels[request.resource_type]}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="font-semibold">{request.units_required}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <MapPin className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm">{request.location}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-sm text-muted-foreground">
//                       {new Date(request.created_at).toLocaleTimeString()}
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         size="sm"
//                         onClick={() => handleDispatch(request.id)}
//                         className="w-full"
//                       >
//                         <Ambulance className="mr-2 h-4 w-4" />
//                         Dispatch
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </Card>

//         <p className="text-sm text-muted-foreground text-center">
//           All dispatches are logged in the audit trail and inventory is updated automatically
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ambulance, MapPin, User, Package } from "lucide-react";
import { toast } from "sonner";

export default function HospitalRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadData = async () => {
      const { data: hosp, error: hErr } = await supabase
        .from("hospitals")
        .select("*");

      const { data: reqs, error: rErr } = await supabase
        .from("resource_requests")
        .select("*")
        .eq("status", "matched");

      if (hErr || rErr) {
        console.error(hErr || rErr);
        toast.error("Failed to load data");
        return;
      }

      setHospitals(hosp ?? []);
      setRequests(reqs ?? []);

      if (hosp && hosp.length > 0) {
        setSelectedHospitalId(hosp[0].id);
      }
    };

    loadData();
  }, []);

  /* ---------------- DERIVED STATE ---------------- */
  const selectedHospital = hospitals.find(
    h => h.id === selectedHospitalId
  );

  const hospitalRequests = requests.filter(
    r => r.matched_hospital_id === selectedHospitalId
  );

  /* ---------------- ACTIONS ---------------- */
    const handleDispatch = async (requestId: string) => {
    const { error } = await supabase.rpc("dispatch_request", {
      request_id: requestId,
    });

    if (error) {
      console.error(error);
      toast.error("Dispatch failed");
      return;
    }

    toast.success("Resource dispatched successfully");

    //MOVE TO DASHBOARD AFTER DISPATCH
    navigate("/dashboard");
  };


  const resourceTypeLabels: Record<string, string> = {
    blood: "Blood Units",
    oxygen: "Oxygen Cylinders",
    icu: "ICU Beds",
    ambulance: "Ambulances",
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Hospital Requests</h1>
            <p className="text-muted-foreground">
              Manage incoming emergency requests and dispatch resources
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            View All Requests
          </Button>
        </div>

        {/* Hospital Selector */}
        <Card className="p-6">
          <label className="text-sm font-medium mb-2 block">
            Select Hospital
          </label>
          <Select
            value={selectedHospitalId ?? ""}
            onValueChange={setSelectedHospitalId}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map(h => (
                <SelectItem key={h.id} value={h.id}>
                  {h.name} – {h.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* Inventory Snapshot */}
        {selectedHospital && (
          <Card className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Blood</p>
              <p className="text-xl font-bold">{selectedHospital.blood_units}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Oxygen</p>
              <p className="text-xl font-bold">{selectedHospital.oxygen_cylinders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ICU</p>
              <p className="text-xl font-bold">{selectedHospital.icu_beds}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ambulances</p>
              <p className="text-xl font-bold">{selectedHospital.ambulances}</p>
            </div>
          </Card>
        )}

        {/* Requests Table */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            Pending Dispatch ({hospitalRequests.length})
          </h2>

          {hospitalRequests.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No pending requests for this hospital
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitalRequests.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-sm">{r.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {r.requester_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {resourceTypeLabels[r.resource_type]}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.units_required}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {r.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(r.created_at).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleDispatch(r.id)}>
                        <Ambulance className="mr-2 h-4 w-4" />
                        Dispatch
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}

