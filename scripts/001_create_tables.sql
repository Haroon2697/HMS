-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('admin', 'receptionist', 'doctor')),
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create patients table
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  patient_id text unique not null,
  full_name text not null,
  date_of_birth date not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  blood_group text,
  phone text not null,
  email text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  medical_history text,
  allergies text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create doctors table
create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  doctor_id text unique not null,
  specialization text not null,
  qualification text not null,
  experience_years integer,
  consultation_fee decimal(10,2),
  available_days text[], -- Array of days: ['monday', 'tuesday', etc.]
  available_time_start time,
  available_time_end time,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create rooms table
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  room_number text unique not null,
  room_type text not null check (room_type in ('general', 'private', 'icu', 'emergency')),
  floor integer not null,
  bed_capacity integer not null default 1,
  occupied_beds integer not null default 0,
  status text not null check (status in ('available', 'occupied', 'maintenance')) default 'available',
  rate_per_day decimal(10,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create room allocations table
create table if not exists public.room_allocations (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete cascade,
  admission_date timestamp with time zone not null,
  discharge_date timestamp with time zone,
  status text not null check (status in ('active', 'discharged')) default 'active',
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create operation theaters table
create table if not exists public.operation_theaters (
  id uuid primary key default gen_random_uuid(),
  ot_number text unique not null,
  ot_name text not null,
  status text not null check (status in ('available', 'occupied', 'maintenance')) default 'available',
  equipment_details text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create OT schedules table
create table if not exists public.ot_schedules (
  id uuid primary key default gen_random_uuid(),
  ot_id uuid references public.operation_theaters(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete cascade,
  doctor_id uuid references public.doctors(id) on delete cascade,
  surgery_type text not null,
  scheduled_date date not null,
  scheduled_time_start time not null,
  scheduled_time_end time not null,
  status text not null check (status in ('scheduled', 'in-progress', 'completed', 'cancelled')) default 'scheduled',
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create x-rays table
create table if not exists public.xrays (
  id uuid primary key default gen_random_uuid(),
  xray_id text unique not null,
  patient_id uuid references public.patients(id) on delete cascade,
  doctor_id uuid references public.doctors(id),
  body_part text not null,
  xray_type text not null,
  status text not null check (status in ('pending', 'completed', 'reported')) default 'pending',
  findings text,
  report_url text,
  requested_date timestamp with time zone default now(),
  completed_date timestamp with time zone,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create bills table
create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  bill_number text unique not null,
  patient_id uuid references public.patients(id) on delete cascade,
  consultation_charges decimal(10,2) default 0,
  room_charges decimal(10,2) default 0,
  surgery_charges decimal(10,2) default 0,
  xray_charges decimal(10,2) default 0,
  medicine_charges decimal(10,2) default 0,
  other_charges decimal(10,2) default 0,
  total_amount decimal(10,2) not null,
  paid_amount decimal(10,2) default 0,
  payment_status text not null check (payment_status in ('unpaid', 'partial', 'paid')) default 'unpaid',
  payment_method text,
  bill_date timestamp with time zone default now(),
  due_date date,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better query performance
create index if not exists idx_patients_patient_id on public.patients(patient_id);
create index if not exists idx_patients_phone on public.patients(phone);
create index if not exists idx_doctors_doctor_id on public.doctors(doctor_id);
create index if not exists idx_room_allocations_patient on public.room_allocations(patient_id);
create index if not exists idx_room_allocations_status on public.room_allocations(status);
create index if not exists idx_ot_schedules_date on public.ot_schedules(scheduled_date);
create index if not exists idx_xrays_patient on public.xrays(patient_id);
create index if not exists idx_xrays_status on public.xrays(status);
create index if not exists idx_bills_patient on public.bills(patient_id);
create index if not exists idx_bills_payment_status on public.bills(payment_status);
