-- Create users table
create table users (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique not null,
  username text unique not null,
  name text not null,
  avatar text,
  bio text,
  background text,
  is_email_verified boolean default false,
  password_hash text not null,
  ip_address text
);

-- Create links table
create table links (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references users(id) on delete cascade not null,
  url text not null,
  title text not null,
  icon text,
  position integer default 0
);

-- Create indexes for better performance
create index idx_users_email on users(email);
create index idx_users_username on users(username);
create index idx_links_user_id on links(user_id);
create index idx_links_position on links(position);

-- Enable Row Level Security (RLS)
alter table users enable row level security;
alter table links enable row level security;

-- Create policies for users table
create policy "Users can view their own data" on users
  for select using (id = auth.uid());

create policy "Users can update their own data" on users
  for update using (id = auth.uid());

-- Create policies for links table
create policy "Users can view their own links" on links
  for select using (user_id = auth.uid());

create policy "Users can insert their own links" on links
  for insert with check (user_id = auth.uid());

create policy "Users can update their own links" on links
  for update using (user_id = auth.uid());

create policy "Users can delete their own links" on links
  for delete using (user_id = auth.uid());

-- Create a function to get user data with links
create or replace function get_user_data(user_id uuid)
returns json as $$
begin
  return (
    select row_to_json(u)
    from (
      select 
        u.id,
        u.created_at,
        u.email,
        u.username,
        u.name,
        u.avatar,
        u.bio,
        u.background,
        u.is_email_verified,
        (
          select json_agg(l order by l.position)
          from links l
          where l.user_id = u.id
        ) as links
      from users u
      where u.id = user_id
    ) u
  );
end;
$$ language plpgsql;