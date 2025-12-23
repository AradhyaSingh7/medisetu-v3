#  MediSetu  
### Emergency Medical Resource Coordination Platform

MediSetu is a full-stack web platform designed to **coordinate emergency medical resources in real time** between patients and hospitals. It enables patients to raise urgent resource requests, hospitals to manage inventory, and administrators to monitor, dispatch, and track requests end-to-end.

The system is built using **React + TypeScript** on the frontend and **Supabase (PostgreSQL, RLS, RPC)** on the backend, focusing on correctness, security, and real-world workflows.

---

## Problem Statement

During medical emergencies, delays in finding:
- available hospitals
- critical medical resources
- real-time confirmations  

can cost lives.

Existing systems are often:
- fragmented
- manually updated
- poorly synchronized  

**MediSetu solves this by acting as a single, real-time coordination layer.**

---

## Key Features

### Patient / Requester
- Raise emergency requests for:
  - Blood
  - Oxygen
  - ICU beds
  - Ambulances
- Provide location, required units, and notes
- Automatic hospital matching based on availability
- Track request status in real time

---

### Hospital Admin
- View and manage hospital inventory
- Update resource quantities:
  - Blood units
  - Oxygen cylinders
  - ICU beds
  - Ambulances
- Inventory changes persist securely in the database
- Protected by **Row Level Security (RLS)**

---

### Hospital Requests (Dispatch Panel)
- View matched requests per hospital
- Dispatch resources with one click
- Automatic:
  - request status update (`matched → enroute`)
  - inventory deduction
- Powered by database **RPCs** for consistency

---

### Central Dashboard
- Live overview of all emergency requests
- Categorized views:
  - Pending
  - Matched
  - Dispatched / Completed
- Status badges and timestamps
- Data fetched directly from Supabase (no mock data)

---

### Security & Data Integrity
- Row Level Security (RLS) enabled on all critical tables
- Controlled access to:
  - inventory updates
  - request state transitions
- Business logic enforced at the **database level** using PostgreSQL functions (RPC)

---

## System Architecture
Frontend (React + TypeScript)
|
v
Supabase Client SDK
|
v
PostgreSQL (Supabase)
- Tables
- RLS Policies
- RPC Functions


**Why this design?**
- Prevents frontend tampering
- Keeps business rules centralized
- Ensures consistency under concurrent actions

---

## Database Schema (Core Tables)

### `hospitals`
Stores hospital metadata.
- `id`
- `name`
- `location`
- `distance`

---

### `inventory`
Tracks per-hospital resource availability.
- `hospital_id`
- `resource_type` (`blood | oxygen | icu | ambulance`)
- `quantity`

---

### `resource_requests`
Tracks the lifecycle of emergency requests.
- `id`
- `requester_name`
- `resource_type`
- `units_required`
- `location`
- `status` (`pending | matched | enroute | completed`)
- `matched_hospital_id`
- timestamps

---

## Database Functions (RPCs)

### `dispatch_request(request_id)`
- Moves request from `matched → enroute`
- Deducts inventory atomically
- Enforced with RLS

### `complete_request(request_id)`
- Marks request as completed
- Finalizes request lifecycle

Using RPCs ensures:
- atomic updates
- no race conditions
- backend-enforced logic

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons

### Backend
- Supabase
- PostgreSQL
- Row Level Security (RLS)
- PostgreSQL Functions (RPC)


