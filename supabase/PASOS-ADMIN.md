# Dejar el panel listo para el cliente

Cinco pasos. La primera vez toma unos quince minutos; después no se toca más.

Todo pasa en **[supabase.com](https://supabase.com)** → entrás con tu cuenta →
elegís el proyecto **sfcuiptbnsqvnzzraoee**.

---

## 1 · Correr los dos SQL que faltan

Menú de la izquierda → **SQL Editor** → botón **New query**.

Pegás el contenido de un archivo, apretás **Run** (o `Ctrl+Enter`), esperás el
`Success`, y repetís con el otro. El orden importa.

| Orden | Archivo | Para qué |
|---|---|---|
| 1º | `supabase/add-commerce-fields.sql` | Precio anterior y stock, para el chip de descuento y el aviso de "quedan N" |
| 2º | `supabase/add-site-config.sql` | Banners, categorías, portada y reseñas desde el panel |

Los dos se pueden correr varias veces sin romper nada.

> Si el segundo tira error sobre `products_category_check`, no pasa nada:
> significa que ese candado ya estaba suelto.

---

## 2 · Crear la cuenta del cliente

Menú de la izquierda → **Authentication** → pestaña **Users** → botón
**Add user** → **Create new user**.

- **Email**: el correo del cliente
- **Password**: una contraseña provisoria
- **Auto Confirm User**: dejalo **encendido**

Sin ese último tilde, Supabase le manda un correo de confirmación y no puede
entrar hasta que lo abra.

Anotá el correo y la contraseña: eso es lo que le pasás.

---

## 3 · Cerrar el registro público

**Este paso es el que evita que cualquiera se meta.** Sin él, un desconocido
puede crearse una cuenta y editar tu catálogo.

Menú de la izquierda → **Authentication** → **Sign In / Providers** →
**Email** → apagá **Allow new users to sign up** → **Save**.

Desde ahí, los únicos que entran son los usuarios que creaste a mano.

---

## 4 · Dejar solo tus correos con permiso de escribir

Abrí `supabase/acceso-admin.sql`, cambiá los dos correos de ejemplo por el
tuyo y el del cliente, y corrélo en el **SQL Editor** igual que el paso 1.

```sql
select lower(auth.jwt() ->> 'email') in (
  'tucorreo@gmail.com',
  'correodelcliente@gmail.com'
);
```

Los correos van **en minusculas**. Supabase los guarda asi y la comparacion
distingue mayusculas: con `Juan@gmail.com` en la lista, el permiso falla.

Con esto, aunque alguien consiga entrar, no puede tocar nada si su correo no
está en la lista.

Para sumar o sacar a alguien más adelante: cambiás la lista y volvés a correr
el archivo.

---

## 5 · Probar que entra

Andá a **tusitio.cl/admin**, iniciá sesión con el correo del cliente y revisá
que pueda:

- Entrar sin error
- Ver las cinco pestañas
- Cambiar un precio y guardarlo
- Subir una imagen

Si al guardar dice *"no se pudo guardar"*, casi siempre es el paso 4: el
correo con el que entró no está en la lista del `acceso-admin.sql`.

---

# Cómo se usa el panel

## Precios

**Catálogo** → buscás el producto → **Precio al por mayor · 1 a 10 unidades**.

Cada fila es un tramo: la cantidad a la izquierda, el precio **por unidad** a
la derecha, y un interruptor para encenderlo o apagarlo.

- Encendé solo los tramos que quieras ofrecer.
- El precio es **por unidad**, no el total.
- Los tramos apagados no aparecen en la tienda.

Al terminar, **Guardar** en esa tarjeta.

## Producto nuevo

**Catálogo** → arriba de todo, escribís el nombre → **Crear producto**.

Aparece la tarjeta vacía al principio de la lista. Le cargás la foto, la
descripción, los precios y la categoría. La categoría tiene que escribirse
**igual** que en la pestaña Categorías, si no la tarjeta de esa categoría se
abre vacía.

## Banners

**Banners** → **Agregar banner** → **Subir** la imagen.

- Escritorio: **1920 × 560**
- Móvil: **1080 × 1080** (si lo dejás vacío se usa el de escritorio)

Las flechas ↑ ↓ cambian el orden en que se ven. Al final, **Guardar banners**.

## Reseñas

**Reseñas** → el desplegable filtra por producto → **Agregar reseña**.

**Compra verificada** deja el sello a la vista. Conviene encenderlo solo con
la venta respaldada: es una afirmación sobre la tienda y el SERNAC puede pedir
que se sostenga.

## Portada

**Portada** → marcás qué productos van en cada fila y los ordenás con las
flechas. Los que no marcás siguen en la tienda: se llega por las categorías y
el buscador.

---

## Cosas que conviene saber

**Nada se guarda solo.** Cuando hay cambios sin guardar aparece una barra abajo
que lo dice. Si cerrás la pestaña antes de guardar, se pierden.

**Los cambios se ven al recargar la tienda.** Guardar en el panel no refresca
la página del visitante que ya la tenía abierta.

**Si Supabase se cae, la tienda sigue.** Muestra lo último que quedó escrito en
los archivos del sitio. No se ve un error, se ve la tienda.

**Las fotos se guardan en Supabase**, no en el repositorio. Subir una imagen
desde el panel no toca el código.
