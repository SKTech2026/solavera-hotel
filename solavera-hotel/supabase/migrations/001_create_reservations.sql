create extension if not exists pgcrypto;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_number text not null unique,
  guest_first_name text not null,
  guest_last_name text not null,
  guest_email text not null,
  guest_phone text not null default '',
  guest_country text not null default '',
  guest_address text not null default '',
  room_id text not null,
  room_slug text not null,
  room_name text not null,
  assigned_room_ids jsonb not null default '[]'::jsonb,
  check_in date not null,
  check_out date not null,
  adults integer not null default 1,
  children integer not null default 0,
  rooms integer not null default 1,
  nights integer not null default 0,
  room_rate integer not null default 0,
  room_subtotal integer not null default 0,
  extras jsonb not null default '[]'::jsonb,
  extras_subtotal integer not null default 0,
  grand_total integer not null default 0,
  arrival_time text not null default '15:00',
  payment_method text not null check (payment_method in ('pay_at_hotel', 'bank_online')),
  payment_status text not null check (payment_status in ('pending', 'partially_paid', 'paid', 'refunded', 'failed')),
  reservation_status text not null check (reservation_status in ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
  special_requests text not null default '',
  receipt_token_hash text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reservations enable row level security;
revoke all on table public.reservations from anon, authenticated;
grant all on table public.reservations to service_role;

create index if not exists reservations_lookup_idx on public.reservations (reservation_number);
create index if not exists reservations_email_idx on public.reservations (guest_email);
create index if not exists reservations_created_idx on public.reservations (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger reservations_set_updated_at
before update on public.reservations
for each row
execute function public.set_updated_at();
