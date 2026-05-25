-- =============================================
-- FiguTrade 2026 - Schema de base de datos
-- Ejecutar esto en el SQL Editor de Supabase
-- =============================================

-- Tabla de perfiles (extiende auth.users de Supabase)
create table public.perfiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nombre text not null,
  created_at timestamptz default now()
);

-- Tabla de grupos
create table public.grupos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  codigo text not null unique,
  creado_por uuid references public.perfiles(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- Tabla de invitaciones (un token por grupo, para compartir el link)
create table public.invitaciones (
  id uuid default gen_random_uuid() primary key,
  token text not null unique,
  grupo_id uuid references public.grupos(id) on delete cascade not null,
  creado_por uuid references public.perfiles(id) on delete cascade not null,
  activa boolean not null default true,
  created_at timestamptz default now()
);

-- Tabla de miembros de cada grupo
create table public.miembros_grupo (
  id uuid default gen_random_uuid() primary key,
  grupo_id uuid references public.grupos(id) on delete cascade not null,
  usuario_id uuid references public.perfiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(grupo_id, usuario_id)
);

-- Tabla de figuritas repetidas (las que tenés para dar)
create table public.figuritas (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references public.perfiles(id) on delete cascade not null,
  numero text not null,
  repetidas integer not null default 1 check (repetidas >= 1),
  created_at timestamptz default now(),
  unique(usuario_id, numero)
);

-- Tabla de figuritas que faltan (las que necesitás)
create table public.me_faltan (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references public.perfiles(id) on delete cascade not null,
  numero text not null,
  created_at timestamptz default now(),
  unique(usuario_id, numero)
);

-- =============================================
-- Row Level Security (RLS) - Seguridad
-- =============================================

alter table public.perfiles enable row level security;
alter table public.grupos enable row level security;
alter table public.invitaciones enable row level security;
alter table public.miembros_grupo enable row level security;
alter table public.figuritas enable row level security;
alter table public.me_faltan enable row level security;

-- Perfiles: cada uno ve y edita solo el suyo,
-- y los compañeros de grupo pueden ver el nombre
create policy "Ver perfil propio" on public.perfiles
  for select using (auth.uid() = id);

create policy "Ver perfiles de mi grupo" on public.perfiles
  for select using (
    exists (
      select 1 from public.miembros_grupo mg1
      join public.miembros_grupo mg2 on mg1.grupo_id = mg2.grupo_id
      where mg1.usuario_id = auth.uid() and mg2.usuario_id = perfiles.id
    )
  );

create policy "Insertar perfil propio" on public.perfiles
  for insert with check (auth.uid() = id);

create policy "Actualizar perfil propio" on public.perfiles
  for update using (auth.uid() = id);

-- Grupos
create policy "Ver grupos propios" on public.grupos
  for select using (
    auth.uid() = creado_por or
    exists (
      select 1 from public.miembros_grupo
      where grupo_id = grupos.id and usuario_id = auth.uid()
    )
  );

create policy "Crear grupos" on public.grupos
  for insert with check (auth.uid() = creado_por);

create policy "Actualizar grupo propio" on public.grupos
  for update using (auth.uid() = creado_por);

-- Invitaciones: cualquiera puede leer una invitación por token (para poder registrarse)
-- pero solo el creador puede crearlas/desactivarlas
create policy "Leer invitacion por token" on public.invitaciones
  for select using (true);

create policy "Crear invitacion" on public.invitaciones
  for insert with check (auth.uid() = creado_por);

create policy "Desactivar invitacion propia" on public.invitaciones
  for update using (auth.uid() = creado_por);

-- Miembros
create policy "Ver miembros de mis grupos" on public.miembros_grupo
  for select using (
    exists (
      select 1 from public.miembros_grupo mg2
      where mg2.grupo_id = miembros_grupo.grupo_id and mg2.usuario_id = auth.uid()
    )
  );

create policy "Unirse a grupos" on public.miembros_grupo
  for insert with check (auth.uid() = usuario_id);

create policy "Salir de grupos" on public.miembros_grupo
  for delete using (auth.uid() = usuario_id);

-- Figuritas
create policy "Ver figuritas de mi grupo" on public.figuritas
  for select using (
    auth.uid() = usuario_id or
    exists (
      select 1 from public.miembros_grupo mg1
      join public.miembros_grupo mg2 on mg1.grupo_id = mg2.grupo_id
      where mg1.usuario_id = auth.uid() and mg2.usuario_id = figuritas.usuario_id
    )
  );

create policy "Gestionar figuritas propias" on public.figuritas
  for all using (auth.uid() = usuario_id);

-- Me faltan
create policy "Ver me_faltan de mi grupo" on public.me_faltan
  for select using (
    auth.uid() = usuario_id or
    exists (
      select 1 from public.miembros_grupo mg1
      join public.miembros_grupo mg2 on mg1.grupo_id = mg2.grupo_id
      where mg1.usuario_id = auth.uid() and mg2.usuario_id = me_faltan.usuario_id
    )
  );

create policy "Gestionar me_faltan propias" on public.me_faltan
  for all using (auth.uid() = usuario_id);

-- =============================================
-- Trigger: crear perfil automáticamente al registrarse
-- =============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles (id, nombre)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
