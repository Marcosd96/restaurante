// Recibe los registros del sitio Mesa Compartida y los guarda en la hoja de
// cálculo a la que está vinculado este script. Las fotos de las experiencias
// quedan en una carpeta de Google Drive y en la hoja se guarda su enlace.
// Instrucciones de instalación en el README del repositorio.

const CARPETA_FOTOS = "Mesa Compartida - Fotos";

const HOJAS = {
  inscripcion: {
    nombre: "Inscripciones",
    columnas: ["fecha", "nombre", "restaurante", "direccion", "tema", "sin_hablar"],
  },
  experiencia: {
    nombre: "Experiencias",
    columnas: ["fecha", "nombre", "restaurante", "experiencia", "foto"],
  },
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const destino = HOJAS[data.tipo];
    if (!destino) throw new Error("Tipo de registro desconocido: " + data.tipo);

    data.fecha = new Date();
    if (data.foto) data.foto = guardarFoto(data.foto);

    const hoja = obtenerHoja(destino);
    hoja.appendRow(destino.columnas.map((columna) => data[columna] ?? ""));
    return responder({ ok: true });
  } catch (error) {
    return responder({ ok: false, error: String(error) });
  }
}

function obtenerHoja(destino) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(destino.nombre);
  if (!hoja) {
    hoja = libro.insertSheet(destino.nombre);
    hoja.appendRow(destino.columnas);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function guardarFoto(foto) {
  const carpetas = DriveApp.getFoldersByName(CARPETA_FOTOS);
  const carpeta = carpetas.hasNext() ? carpetas.next() : DriveApp.createFolder(CARPETA_FOTOS);
  const blob = Utilities.newBlob(Utilities.base64Decode(foto.datos), foto.tipo, foto.nombre);
  return carpeta.createFile(blob).getUrl();
}

function responder(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
