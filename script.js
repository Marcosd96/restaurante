// URL de la aplicación web de Google Apps Script que guarda los registros en una
// hoja de cálculo (ver README y apps-script/Code.gs). Mientras esté vacía, los
// formularios funcionan en modo demo: validan y muestran confirmación, pero no
// guardan nada.
const FORM_ENDPOINT = "";

const MAX_FOTO_MB = 10;

function setStatus(form, message, kind) {
  const status = form.querySelector(".status");
  status.textContent = message;
  status.className = "status" + (kind ? " " + kind : "");
}

function leerFoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      nombre: file.name,
      tipo: file.type,
      datos: reader.result.split(",")[1],
    });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Conecta un formulario al endpoint. `prepare` recibe el formulario y devuelve
// los datos a enviar (o lanza un Error con un mensaje para el usuario).
function connect(form, tipo, prepare) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;

    try {
      const data = { tipo, ...(await prepare(form)) };

      if (!FORM_ENDPOINT) {
        console.info("Modo demo, registro no enviado:", data);
        setStatus(form, "¡Gracias, " + data.nombre + "! (Modo demo: aún no se guarda.)", "ok");
        form.reset();
        return;
      }

      setStatus(form, "Enviando…");
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        // text/plain evita la consulta CORS previa, que Apps Script no responde.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || "HTTP " + response.status);
      setStatus(form, "¡Gracias, " + data.nombre + "! Recibimos tu registro.", "ok");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus(form, error.userMessage || "No se pudo enviar. Intenta de nuevo en un momento.", "error");
    } finally {
      button.disabled = false;
    }
  });
}

connect(document.getElementById("form-inscripcion"), "inscripcion", (form) => {
  const data = Object.fromEntries(new FormData(form));
  data.sin_hablar = form.elements.sin_hablar.checked ? "Sí" : "No";
  return data;
});

connect(document.getElementById("form-experiencia"), "experiencia", async (form) => {
  const data = Object.fromEntries(new FormData(form));
  delete data.foto;

  const file = form.elements.foto.files[0];
  if (file) {
    if (file.size > MAX_FOTO_MB * 1024 * 1024) {
      const error = new Error("Foto demasiado grande");
      error.userMessage = "La foto pesa más de " + MAX_FOTO_MB + " MB. Elige una más liviana.";
      throw error;
    }
    data.foto = await leerFoto(file);
  }
  return data;
});
