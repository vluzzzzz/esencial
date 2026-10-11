update public.products set
  image   = 'images/serie11black.webp',
  gallery = array[]::text[],
  colors  = '[
    {"name":"Negro", "hex":"#1A1A1A", "img":"images/serie11black.webp", "swatch":"images/miniblack11.webp"},
    {"name":"Oro",   "hex":"#E3C08D", "img":"images/serie11oro.webp",   "swatch":"images/minioro.webp"},
    {"name":"Gris",  "hex":"#8E8E93", "img":"images/grisserie11.webp",  "swatch":"images/miniserie11gris.webp"}
  ]'::jsonb
where slug = 'apple-watch-serie-10';

select slug, name, image, jsonb_array_length(coalesce(colors,'[]'::jsonb)) as colores
from public.products where slug = 'apple-watch-serie-10';
