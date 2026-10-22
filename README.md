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

## Guardar las inscripciones

Ahora el formulario está en **modo demo**: valida los datos, pero no los guarda.
Para recibir las respuestas:
1. Crea un formulario gratuito en https://formspree.io y copia su URL.
2. Pégala en `FORM_ENDPOINT` dentro de `script.js`.
