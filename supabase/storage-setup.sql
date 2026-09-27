insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'media',
  'media',
  true,
  52428800,
  array[
    'video/*',
    'audio/*',
    'image/*',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can list clan media" on storage.objects;
create policy "Public can list clan media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'media');

drop policy if exists "Public can upload approved clan media" on storage.objects;
create policy "Public can upload approved clan media"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'media'
  and split_part(name, '/', 1) in ('montages', 'gallery', 'members')
  and lower(storage.extension(name)) = any (array[
    'mp4', 'webm', 'mov', 'avi', 'mkv', 'mp3', 'wav', 'm4a', 'ogg',
    'jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf', 'txt', 'csv', 'zip',
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
  ])
);