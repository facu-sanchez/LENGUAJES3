// indica si el formulario ya fue validado correctamente
let formulariovalido = false;

// valida que el nombre sea solo letras y minimo 3 caracteres
function validarNombre() {
  const valornombre = document.getElementById("nombre").value.trim();
  const errornombre = document.getElementById("errornombre");
  // patron que acepta letrascon tildes y ñ y espacios
  const patronletras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (valornombre.length < 3) {
    errornombre.innerHTML = "Tiene que tener minimo 3 caracteres.";
    return false;
  }
  if (!patronletras.test(valornombre)) {
    errornombre.innerHTML = "Solo se permiten letras, sin números ni simbolos.";
    return false;
  }
  errornombre.innerHTML = "";
  return true;
}

// valida que el dni sea solo numerico y de 8 digitos
function validarDni() {
  const valordni = document.getElementById("dni").value.trim();
  const errordni = document.getElementById("errordni");

  // isnan detecta si el valor no es un numero
  if (valordni === "" || isNaN(valordni)) {
    errordni.innerHTML = "El DNI solo puede tener números.";
    return false;
  }
  if (valordni.length !== 8) {
    errordni.innerHTML = "El DNI tiene que  tener exactamente 8 dígitos.";
    return false;
  }
  errordni.innerHTML = "";
  return true;
}

// valida que la persona sea mayor de 18 años usando el date
function validarFecha() {
  const valorfecha = document.getElementById("fecha").value;
  const errorfecha = document.getElementById("errorfecha");

  if (valorfecha === "") {
    errorfecha.innerHTML = " Ingrese su fecha de nacimiento.";
    return false;
  }

  // calcula la edad comparando la fecha de nacimiento con la fecha actual
  const fechanacimiento = new Date(valorfecha);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechanacimiento.getFullYear();
  const diferenciames = hoy.getMonth() - fechanacimiento.getMonth();

  // resta un año si todavia no cumplio en el año en curso
  if (diferenciames < 0 || (diferenciames === 0 && hoy.getDate() < fechanacimiento.getDate())) {
    edad--;
  }

  if (edad < 18) {
    errorfecha.innerHTML = "Debe ser mayor de 18 años.";
    return false;
  }
  errorfecha.innerHTML = "";
  return true;
}

// ejecuta todas las validaciones cuando enviamos
function enviarFormulario() {
  const resultado = document.getElementById("resultado");
  const seccionpreguntas = document.getElementById("seccionpreguntas");

  // se evaluan los 3 campos de forma independiente
  const nombreok = validarNombre();
  const dniok = validarDni();
  const fechaok = validarFecha();

  if (nombreok && dniok && fechaok) {
    resultado.innerHTML = "Formulario enviado correctamente!";
    resultado.className = "resultado exito";
    formulariovalido = true;
    // despues de validar formulario ahora si se habilita la seccion de preguntas
    seccionpreguntas.style.display = "block";
  } else {
    resultado.innerHTML = "Hay campos invalidos. Revisá los errores.";
    resultado.className = "resultado error";
    formulariovalido = false;
    seccionpreguntas.style.display = "none";
  }
}

// hace las 3 preguntas progresivas y muestra las respuestas en el dom
function hacerPreguntas() {
  if (!formulariovalido) {
    return;
  }

  const nacionalidad = prompt("¿Cuál es tu nacionalidad?");
  const nivel = prompt("¿Cuál es tu nivel de conocimiento en programación? (Básico / Intermedio / Avanzado)");
  const motivo = prompt("¿Por qué elegiste esta carrera?");

  // si el usuario cancela prompt devuelve null
  const respuesta1 = nacionalidad === null ? "No respondio esta pregunta." : nacionalidad;
  const respuesta2 = nivel === null ? "No respondio esta pregunta." : nivel;
  const respuesta3 = motivo === null ? "No respondio esta pregunta." : motivo;

  // muestra las 3 respuestas juntas en el dom
  const respuestas = document.getElementById("respuestas");
  respuestas.innerHTML =
    "<p><strong>Pregunta 1:</strong> " + respuesta1 + "</p>" +
    "<p><strong>Pregunta 2:</strong> " + respuesta2 + "</p>" + 
    "<p><strong>Pregunta 3:</strong> " + respuesta3 + "</p>";
}

// asocia los botones con sus funciones
document.getElementById("botonenviar").addEventListener("click", enviarFormulario);
document.getElementById("botonpreguntas").addEventListener("click", hacerPreguntas);
