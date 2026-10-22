// URL donde se envían las inscripciones (por ejemplo, un endpoint de Formspree:
// "https://formspree.io/f/xxxxxxx"). Mientras esté vacía, el formulario funciona
// en modo demo: valida y muestra confirmación, pero no guarda nada.
const FORM_ENDPOINT = "";

const form = document.getElementById("form-inscripcion");
const status = document.getElementById("form-status");

function setStatus(message, kind) {
  status.textContent = message;
  status.className = "status" + (kind ? " " + kind : "");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  data.sin_hablar = form.elements.sin_hablar.checked ? "Sí" : "No";

  if (!FORM_ENDPOINT) {
    console.info("Modo demo, inscripción no enviada:", data);
    setStatus("¡Gracias, " + data.nombre + "! (Modo demo: la inscripción aún no se guarda.)", "ok");
    form.reset();
    return;
  }

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  setStatus("Enviando…");

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    setStatus("¡Gracias, " + data.nombre + "! Recibimos tu inscripción.", "ok");
    form.reset();
  } catch (error) {
    console.error(error);
    setStatus("No se pudo enviar. Intenta de nuevo en un momento.", "error");
  } finally {
    button.disabled = false;
  }
});
