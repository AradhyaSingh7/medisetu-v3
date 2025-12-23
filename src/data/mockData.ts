export interface Hospital {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  distance: number;
  bloodUnits: number;
  oxygenCylinders: number;
  icuBeds: number;
  ambulances: number;
  contactNumber: string;
  address: string;
}

export interface ResourceRequest {
  id: string;
  patientName: string;
  resourceType: 'blood' | 'oxygen' | 'icu' | 'ambulance';
  unitsRequired: number;
  location: string;
  additionalNotes: string;
  status: 'pending' | 'matched' | 'enroute' | 'completed';
  assignedHospitalId?: string;
  createdAt: string;
  matchedAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  userId: string;
  details: string;
}

export const hospitals: Hospital[] = [
  {
    id: "H001",
    name: "Apollo Hospital",
    location: "Delhi",
    latitude: 28.5494,
    longitude: 77.2001,
    distance: 2.5,
    bloodUnits: 45,
    oxygenCylinders: 28,
    icuBeds: 12,
    ambulances: 8,
    contactNumber: "+91-11-26925858",
    address: "Sarita Vihar, Delhi"
  },
  {
    id: "H002",
    name: "Max Super Speciality Hospital",
    location: "Delhi",
    latitude: 28.5355,
    longitude: 77.2502,
    distance: 4.2,
    bloodUnits: 0,
    oxygenCylinders: 15,
    icuBeds: 3,
    ambulances: 5,
    contactNumber: "+91-11-26515050",
    address: "Saket, Delhi"
  },
  {
    id: "H003",
    name: "Fortis Hospital",
    location: "Mumbai",
    latitude: 19.0760,
    longitude: 72.8777,
    distance: 5.8,
    bloodUnits: 32,
    oxygenCylinders: 2,
    icuBeds: 8,
    ambulances: 6,
    contactNumber: "+91-22-67676767",
    address: "Mulund West, Mumbai"
  },
  {
    id: "H004",
    name: "AIIMS Delhi",
    location: "Delhi",
    latitude: 28.5672,
    longitude: 77.2100,
    distance: 3.1,
    bloodUnits: 67,
    oxygenCylinders: 42,
    icuBeds: 18,
    ambulances: 12,
    contactNumber: "+91-11-26588500",
    address: "Ansari Nagar, Delhi"
  },
  {
    id: "H005",
    name: "Lilavati Hospital",
    location: "Mumbai",
    latitude: 19.0596,
    longitude: 72.8295,
    distance: 7.3,
    bloodUnits: 28,
    oxygenCylinders: 34,
    icuBeds: 6,
    ambulances: 4,
    contactNumber: "+91-22-26567000",
    address: "Bandra West, Mumbai"
  },
  {
    id: "H006",
    name: "Medanta - The Medicity",
    location: "Gurugram",
    latitude: 28.4089,
    longitude: 77.0322,
    distance: 15.2,
    bloodUnits: 54,
    oxygenCylinders: 38,
    icuBeds: 22,
    ambulances: 10,
    contactNumber: "+91-124-4141414",
    address: "Sector 38, Gurugram"
  },
  {
    id: "H007",
    name: "Manipal Hospital",
    location: "Bangalore",
    latitude: 12.9716,
    longitude: 77.5946,
    distance: 8.5,
    bloodUnits: 41,
    oxygenCylinders: 0,
    icuBeds: 14,
    ambulances: 7,
    contactNumber: "+91-80-25023344",
    address: "HAL Airport Road, Bangalore"
  },
  {
    id: "H008",
    name: "Kokilaben Dhirubhai Ambani Hospital",
    location: "Mumbai",
    latitude: 19.1876,
    longitude: 72.8263,
    distance: 6.1,
    bloodUnits: 4,
    oxygenCylinders: 26,
    icuBeds: 11,
    ambulances: 9,
    contactNumber: "+91-22-30999999",
    address: "Andheri West, Mumbai"
  }
];

export let resourceRequests: ResourceRequest[] = [
  {
    id: "R001",
    patientName: "Rajesh Kumar",
    resourceType: "blood",
    unitsRequired: 3,
    location: "Connaught Place, Delhi",
    additionalNotes: "O+ Blood Type needed urgently",
    status: "matched",
    assignedHospitalId: "H001",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    matchedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: "R002",
    patientName: "Priya Sharma",
    resourceType: "oxygen",
    unitsRequired: 2,
    location: "Andheri, Mumbai",
    additionalNotes: "Patient with severe respiratory distress",
    status: "enroute",
    assignedHospitalId: "H003",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    matchedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString()
  },
  {
    id: "R003",
    patientName: "Amit Patel",
    resourceType: "icu",
    unitsRequired: 1,
    location: "Saket, Delhi",
    additionalNotes: "Post-surgery monitoring required",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  }
];

export let auditLogs: AuditLog[] = [
  {
    id: "A001",
    action: "Resource Updated: Blood Units",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    userId: "admin@apollo.com",
    details: "Updated blood units from 50 to 45 at Apollo Hospital"
  },
  {
    id: "A002",
    action: "New Emergency Request",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    userId: "system",
    details: "Emergency request R001 created for O+ Blood"
  },
  {
    id: "A003",
    action: "Resource Matched",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    userId: "system",
    details: "Request R001 matched with Apollo Hospital"
  },
  {
    id: "A004",
    action: "Ambulance Dispatched",
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    userId: "admin@fortis.com",
    details: "Ambulance dispatched for request R002"
  }
];

// Helper functions
export const addResourceRequest = (request: ResourceRequest) => {
  resourceRequests = [request, ...resourceRequests];
};

export const updateResourceRequest = (id: string, updates: Partial<ResourceRequest>) => {
  resourceRequests = resourceRequests.map(req => 
    req.id === id ? { ...req, ...updates } : req
  );
};

export const addAuditLog = (log: AuditLog) => {
  auditLogs = [log, ...auditLogs];
};

export const updateHospitalInventory = (hospitalId: string, updates: Partial<Hospital>) => {
  const hospitalIndex = hospitals.findIndex(h => h.id === hospitalId);
  if (hospitalIndex !== -1) {
    hospitals[hospitalIndex] = { ...hospitals[hospitalIndex], ...updates };
    addAuditLog({
      id: `A${Date.now()}`,
      action: `Resource Updated at ${hospitals[hospitalIndex].name}`,
      timestamp: new Date().toISOString(),
      userId: "admin",
      details: `Inventory updated: ${JSON.stringify(updates)}`
    });
  }
};

export const findBestMatch = (request: ResourceRequest): Hospital | null => {
  let availableHospitals = hospitals.filter(h => {
    switch (request.resourceType) {
      case 'blood':
        return h.bloodUnits >= request.unitsRequired;
      case 'oxygen':
        return h.oxygenCylinders >= request.unitsRequired;
      case 'icu':
        return h.icuBeds >= request.unitsRequired;
      case 'ambulance':
        return h.ambulances >= request.unitsRequired;
      default:
        return false;
    }
  });

  if (availableHospitals.length === 0) return null;

  // Sort by distance and return closest
  availableHospitals.sort((a, b) => a.distance - b.distance);
  return availableHospitals[0];
};
