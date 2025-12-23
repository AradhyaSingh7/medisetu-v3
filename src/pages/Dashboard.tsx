import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

import { Clock, MapPin, User, Package, CheckCircle2, AlertCircle, Truck } from "lucide-react";

export const Dashboard = () => {
  const [resourceRequests, setResourceRequests] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  useEffect(() => {
    const loadData = async () => {
      const { data: requests } = await supabase
        .from("resource_requests")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: hospitalsData } = await supabase
        .from("hospitals")
        .select("*");

      setResourceRequests(requests || []);
      setHospitals(hospitalsData || []);
    };

    loadData();
  }, []);


  const pendingRequests = resourceRequests.filter(r => r.status === "pending");
  const matchedRequests = resourceRequests.filter(r => r.status === "matched");
  const dispatchedRequests = resourceRequests.filter(r => r.status === "enroute" || r.status === "completed");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "matched":
        return <Badge className="bg-success text-success-foreground">Matched</Badge>;
      case "enroute":
        return <Badge className="bg-primary text-primary-foreground">En Route</Badge>;
      case "completed":
        return <Badge className="bg-accent text-accent-foreground">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getResourceLabel = (type: string) => {
    const labels: Record<string, string> = {
      blood: "Blood",
      oxygen: "Oxygen",
      icu: "ICU Bed",
      ambulance: "Ambulance"
    };
    return labels[type] || type;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const RequestCard = ({ request }: { request: any }) => {
    // const hospital = request.assignedHospitalId 
    const hospital = request.matched_hospital_id
      ? hospitals.find(h => h.id === request.matched_hospital_id)
      : null;
      

    return (
      <Card className="p-5 hover:shadow-card-hover transition-all">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-mono text-sm text-muted-foreground">{request.id}</p>
              {getStatusBadge(request.status)}
            </div>
            <h3 className="text-lg font-bold text-foreground">{request.requester_name}</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              {formatTime(request.created_at)}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Resource:</span>
            <span className="font-semibold text-foreground">
              {getResourceLabel(request.resource_type)} ({request.units_required} unit{request.units_required > 1 ? 's' : ''})
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Location:</span>
            <span className="text-foreground">{request.location}</span>
          </div>

          {hospital && (
            <div className="p-3 bg-accent/10 rounded-lg mt-3 border border-accent/20">
              <p className="text-sm font-semibold text-accent mb-1">Assigned Hospital</p>
              <p className="font-bold text-foreground">{hospital.name}</p>
              <p className="text-sm text-muted-foreground">{hospital.location} • {hospital.distance} km</p>
            </div>
          )}
        </div>

        {request.status === "enroute" && (
          <Button
            className="w-full mt-3"
            onClick={async () => {
              await supabase.rpc("complete_request", {
                request_id: request.id,
              });
              window.location.reload();
            }}
          >
            Mark Completed
          </Button>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Active Emergencies Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Real-time monitoring of all emergency resource requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-foreground">{resourceRequests.length}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-3xl font-bold text-warning">{pendingRequests.length}</p>
              </div>
              <Clock className="h-10 w-10 text-warning" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Matched</p>
                <p className="text-3xl font-bold text-success">{matchedRequests.length}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dispatched</p>
                <p className="text-3xl font-bold text-primary">{dispatchedRequests.length}</p>
              </div>
              <Truck className="h-10 w-10 text-primary" />
            </div>
          </Card>
        </div>

        {/* Request Lists */}
        <div className="space-y-8">
          {/* Pending */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-6 w-6 text-warning" />
              <h2 className="text-2xl font-bold text-foreground">Pending Requests</h2>
              <Badge className="bg-warning text-warning-foreground">{pendingRequests.length}</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map(request => <RequestCard key={request.id} request={request} />)
              ) : (
                <Card className="p-8 text-center col-span-full">
                  <p className="text-muted-foreground">No pending requests</p>
                </Card>
              )}
            </div>
          </div>

          {/* Matched */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-success" />
              <h2 className="text-2xl font-bold text-foreground">Matched Requests</h2>
              <Badge className="bg-success text-success-foreground">{matchedRequests.length}</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedRequests.length > 0 ? (
                matchedRequests.map(request => <RequestCard key={request.id} request={request} />)
              ) : (
                <Card className="p-8 text-center col-span-full">
                  <p className="text-muted-foreground">No matched requests</p>
                </Card>
              )}
            </div>
          </div>

          {/* Dispatched */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Dispatched / Completed</h2>
              <Badge className="bg-primary text-primary-foreground">{dispatchedRequests.length}</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dispatchedRequests.length > 0 ? (
                dispatchedRequests.map(request => <RequestCard key={request.id} request={request} />)
              ) : (
                <Card className="p-8 text-center col-span-full">
                  <p className="text-muted-foreground">No dispatched requests</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
