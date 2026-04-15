alter table public.users
  add column if not exists admin_id text,
  add column if not exists document_type text,
  add column if not exists document_number text,
  add column if not exists registration_key_hash text;

create unique index if not exists users_admin_id_key
  on public.users (admin_id)
  where admin_id is not null;

create unique index if not exists users_document_type_document_number_key
  on public.users (document_type, document_number)
  where document_type is not null and document_number is not null;
