-- Add single operation theater for the hospital
insert into public.operation_theaters (ot_number, ot_name, status, equipment_details) values
('OT-1', 'Main Operating Theater', 'available', 'Full surgical suite with advanced monitoring')
on conflict (ot_number) do nothing;
