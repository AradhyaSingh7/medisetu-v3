import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Hospital as Building,
  Droplet,
  Wind,
  Bed,
  Ambulance,
  Save,
} from "lucide-react";
import { toast } from "sonner";

type ResourceType = "blood" | "oxygen" | "icu" | "ambulance";

export const HospitalAdmin = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [editedInventory, setEditedInventory] = useState<Record<ResourceType, number>>(
    {} as Record<ResourceType, number>
  );

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadData = async () => {
      const { data: hospitalsData, error: hErr } = await supabase
        .from("hospitals")
        .select("*");

      const { data: inventoryData, error: iErr } = await supabase
        .from("inventory")
        .select("*");

      if (hErr || iErr) {
        console.error(hErr || iErr);
        toast.error("Failed to load hospital data");
        return;
      }

      setHospitals(hospitalsData ?? []);
      setInventory(inventoryData ?? []);

      if (hospitalsData && hospitalsData.length > 0) {
        setSelectedHospital(hospitalsData[0].id);
      }
    };

    loadData();
  }, []);

  /* ---------------- DERIVED DATA ---------------- */
  const currentHospital = hospitals.find(h => h.id === selectedHospital);

  const currentInventory = inventory.filter(
    i => i.hospital_id === selectedHospital
  );

  const getQuantity = (type: ResourceType) =>
    editedInventory[type] ??
    currentInventory.find(i => i.resource_type === type)?.quantity ??
    0;

  /* ---------------- ACTIONS ---------------- */
  const handleUpdate = (type: ResourceType, value: number) => {
    setEditedInventory(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  // const handleSave = async () => {
  //   if (!selectedHospital || Object.keys(editedInventory).length === 0) {
  //     toast.error("No changes to save");
  //     return;
  //   }
  const handleSave = async () => {
  if (!selectedHospital || Object.keys(editedInventory).length === 0) {
    toast.error("No changes to save");
    return;
  }

  for (const [resource_type, quantity] of Object.entries(
    editedInventory
  ) as [ResourceType, number][]) {
    const { error } = await supabase
      .from("inventory")
      .upsert(
        {
          hospital_id: selectedHospital,
          resource_type,
          quantity,
        },
        { onConflict: "hospital_id,resource_type" }
      );

    if (error) {
      console.error("UPSERT ERROR:", error);
      toast.error(error.message);
      return;
    }
  }

  toast.success("Inventory updated successfully!");

  setEditedInventory({} as Record<ResourceType, number>);

  const { data: refreshed, error: refreshErr } = await supabase
    .from("inventory")
    .select("*");

  if (refreshErr) {
    console.error(refreshErr);
    toast.error("Failed to refresh inventory");
    return;
  }

  setInventory(refreshed ?? []);
};


  const getStatusColor = (quantity: number) => {
    if (quantity === 0) return "text-destructive";
    if (quantity < 5) return "text-warning";
    return "text-success";
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Hospital Inventory Manager</h1>
            <p className="text-muted-foreground">
              Manage and update resource availability
            </p>
          </div>
        </div>

        {/* Loading guard */}
        {!selectedHospital || hospitals.length === 0 ? (
          <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">
            Loading hospital inventory…
          </div>
        ) : (
          <>
            {/* Hospital Selector */}
            <Card className="p-6 mb-6">
              <Label className="mb-3 block font-semibold">Select Hospital</Label>
              <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                <SelectTrigger className="w-full md:w-96">
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

            {/* Hospital Info */}
            {currentHospital && (
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold">{currentHospital.name}</h2>
                <p className="text-muted-foreground">
                  {currentHospital.location}
                </p>
              </Card>
            )}

            {/* Inventory Table */}
            <Card className="p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Resource Inventory</h2>
                <Button
                  onClick={handleSave}
                  disabled={Object.keys(editedInventory).length === 0}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(
                    [
                      ["blood", "Blood Units (Emergency)", Droplet],
                      ["oxygen", "Oxygen Cylinders", Wind],
                      ["icu", "ICU Beds", Bed],
                      ["ambulance", "Ambulances", Ambulance],
                    ] as [ResourceType, string, any][]
                  ).map(([type, label, Icon]) => {
                    const qty = getQuantity(type);
                    return (
                      <TableRow key={type}>
                        <TableCell className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          {label}
                        </TableCell>
                        <TableCell className={`font-bold ${getStatusColor(qty)}`}>
                          {qty}
                        </TableCell>
                        <TableCell>
                          {qty === 0 ? (
                            <Badge variant="destructive">Unavailable</Badge>
                          ) : qty < 5 ? (
                            <Badge className="bg-warning">Low Stock</Badge>
                          ) : (
                            <Badge className="bg-success">Available</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            value={qty}
                            onChange={e =>
                              handleUpdate(type, Number(e.target.value))
                            }
                            className="w-32"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
