-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.doctors enable row level security;
alter table public.rooms enable row level security;
alter table public.room_allocations enable row level security;
alter table public.operation_theaters enable row level security;
alter table public.ot_schedules enable row level security;
alter table public.xrays enable row level security;
alter table public.bills enable row level security;

-- Profiles policies
create policy "Users can view all profiles"
  on public.profiles for select
  using (auth.uid() is not null);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Patients policies (accessible by all authenticated users)
create policy "Authenticated users can view patients"
  on public.patients for select
  using (auth.uid() is not null);

create policy "Authenticated users can insert patients"
  on public.patients for insert
  with check (auth.uid() is not null);

create policy "Authenticated users can update patients"
  on public.patients for update
  using (auth.uid() is not null);

-- Doctors policies
create policy "Authenticated users can view doctors"
  on public.doctors for select
  using (auth.uid() is not null);

create policy "Admins can manage doctors"
  on public.doctors for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Rooms policies
create policy "Authenticated users can view rooms"
  on public.rooms for select
  using (auth.uid() is not null);

create policy "Authenticated users can manage rooms"
  on public.rooms for all
  using (auth.uid() is not null);

-- Room allocations policies
create policy "Authenticated users can view room allocations"
  on public.room_allocations for select
  using (auth.uid() is not null);

create policy "Authenticated users can manage room allocations"
  on public.room_allocations for all
  using (auth.uid() is not null);

-- Operation theaters policies
create policy "Authenticated users can view OTs"
  on public.operation_theaters for select
  using (auth.uid() is not null);

create policy "Authenticated users can manage OTs"
  on public.operation_theaters for all
  using (auth.uid() is not null);

-- OT schedules policies
create policy "Authenticated users can view OT schedules"
  on public.ot_schedules for select
  using (auth.uid() is not null);

create policy "Authenticated users can manage OT schedules"
  on public.ot_schedules for all
  using (auth.uid() is not null);

-- X-rays policies
create policy "Authenticated users can view xrays"
  on public.xrays for select
  using (auth.uid() is not null);

create policy "Authenticated users can manage xrays"
  on public.xrays for all
  using (auth.uid() is not null);

-- Bills policies
create policy "Authenticated users can view bills"
  on public.bills for select
  using (auth.uid() is not null);

create policy "Authenticated users can manage bills"
  on public.bills for all
  using (auth.uid() is not null);
