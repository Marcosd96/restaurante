# Mesa Compartida

Página del piloto de encuentros en restaurantes con el personal de la biblioteca.
Es un sitio estático (HTML, CSS y JS), sin build.

## Ver en local

Abre `index.html` en el navegador, o:

```bash
npx serve .
```

## Desplegar en Vercel

**Opción A: desde GitHub**
1. Sube esta carpeta a un repositorio en GitHub.
2. En vercel.com → *Add New → Project* → importa el repositorio.
3. Framework Preset: **Other**. Deja vacíos Build Command y Output Directory.
4. *Deploy*. Cada `git push` vuelve a desplegar.

**Opción B: desde la terminal**
```bash
npx vercel        # despliegue de prueba
npx vercel --prod # producción
```

## Guardar los registros

Las inscripciones y las experiencias se guardan en una hoja de cálculo de Google
(pestañas *Inscripciones* y *Experiencias*). Las fotos quedan en la carpeta
*Mesa Compartida - Fotos* de Google Drive, y la hoja guarda su enlace.

Mientras `FORM_ENDPOINT` esté vacío en `script.js`, los formularios están en
**modo demo**: validan los datos, pero no los guardan. Para activarlo:

1. Crea una hoja de cálculo nueva en Google Sheets (por ejemplo, "Mesa Compartida - Registros").
2. Menú *Extensiones → Apps Script*. Borra el contenido y pega el de `apps-script/Code.gs`. Guarda.
3. *Implementar → Nueva implementación* → tipo **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. *Implementar*, autoriza los permisos (hoja y Drive) y copia la URL que termina en `/exec`.
5. Pégala en `FORM_ENDPOINT` dentro de `script.js` y vuelve a desplegar el sitio.

Para enviar los registros, comparte la hoja o descárgala en *Archivo → Descargar*.
Si cambias `Code.gs`, publica de nuevo en *Implementar → Gestionar implementaciones →
Editar → Nueva versión* para que la URL siga igual.
