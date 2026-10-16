begin;
select plan(4);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.reservations'::regclass),
  'row level security is enabled'
);
select ok(
  not has_table_privilege('anon', 'public.reservations', 'select,insert,update,delete'),
  'anon has no table privileges'
);
select ok(
  not has_table_privilege('authenticated', 'public.reservations', 'select,insert,update,delete'),
  'authenticated has no table privileges'
);
select ok(
  has_table_privilege('service_role', 'public.reservations', 'select,insert,update,delete'),
  'service_role has the privileges required by the server repository'
);

select * from finish();
rollback;