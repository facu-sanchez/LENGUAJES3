/* Trabajo Práctico N° 7: Consumo de APIs con AJAX y DOM */
document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'https://rickandmortyapi.com/api/character/';
    const inputBusqueda = document.getElementById('busqueda');
    const btnBuscar     = document.getElementById('btnBuscar');
    const divResultado  = document.getElementById('resultado');

    // REGISTRO DE EVENTOS
    /*
      addEventListener('click', callback): registra una función que se ejecuta
      cada vez que el usuario hace clic en el botón
      separamndo la definición de la función (buscarPersonaje) de su registro
      como listener: hace el código más legible y reutilizable
     */
    btnBuscar.addEventListener('click', buscarPersonaje);

    /*
      'keydown': evento que se dispara al presionar cualquier tecla
      verificamos si la tecla presionada fue enter 
     */
    inputBusqueda.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            buscarPersonaje();
        }
    });

    //FUNCIÓN PRINCIPAL
    /* buscarPersonaje()
     coordina la lógica completa de búsqueda:
        lee el valor del input y lo limpia con trim()
        valida que no esté vacío
        determina el tipo de búsqueda (por ID o por nombre)
        construye la URL 
        llama a la API con fetch()
        maneja la respuesta y los errores */
    
        function buscarPersonaje() {

        /* value → propiedad del elemento <input> que contiene el texto escrit
         trim() → elimina espacios en blanco al inicio y al final del string */
       
         const valorIngresado = inputBusqueda.value.trim();
        if (valorIngresado === '') {
            mostrarVacio('Por favor, ingresá un nombre o un ID');
            return; // Interrumpe la ejecución si no hay nada que buscar
        }

        // isNaN() (is Not a Number): devuelve true si el argumento NO es un número
        /*  
        isNaN('Rick') → true  
          isNaN('42')   → false 
          isNaN convierte implícitamente el argumento a número antes de evaluar */
        const esBusquedaPorID = !isNaN(valorIngresado);
        //  URL de la API
        const url = esBusquedaPorID
            ? `${BASE_URL}${valorIngresado}`
            : `${BASE_URL}?name=${encodeURIComponent(valorIngresado)}`;
        // encodeURIComponent(): convierte caracteres especiales del texto //
        // Mostramos un spinner mientras se espera la respuesta de la API
        mostrarSpinner();
        fetch(url)
            .then((response) => {

                /*
                 response.ok → true si el código HTTP es 2xx (200, 201...)
                 si el personaje no existe, la API devuelve HTTP 404 (Not Found)
                 */
                if (!response.ok) {
                    throw new Error('Personaje no encontrado');
                }
                return response.json();
            })
            .then((data) => {
                const personaje = esBusquedaPorID ? data : data.results[0];
                // Si por alguna razón results[0] no existe
                if (!personaje) {
                    throw new Error('Personaje no encontrado');
                }
                // Mostramos la card con los datos del personaje
                mostrarCard(personaje);
            })
            .catch((error) => {

                /* El .catch() recibe el error  por throw o por un fallo de red
                  error.message contiene el string que pasamos a new Error() */
                mostrarError(error.message || 'Personaje no encontrado');
            });
    }

    // FUNCIÓN: MOSTRAR CARD
    /*
      mostrarCard(personaje)
      recibe el objeto personaje de la API y genera la card html
      dinámicamente dentro del div#resultado usando innerHTML
     */
    function mostrarCard(personaje) {
        const statusClass  = personaje.status.toLowerCase();
        const badgeClass   = `badge-estado badge-${statusClass}`;

        /* La card contiene:
           1 imagen del personaje
           2 nombre
           3 estado (con badge de color dinámico)
           4 especie
           5 ultima ubicación conocida */
        const cardHTML = `
            <div class="col-auto">
                <div class="personaje-card ${statusClass}">
                    <!Imagen del personaje>
                    <img
                        src="${personaje.image}"
                        alt="Imagen de ${personaje.name}"
                        class="card-img-personaje"
                    >
                    <div class="card-body-rm">

                        <!Nombre>
                        <h2 class="card-nombre">${personaje.name}</h2>

                        <!Estado con badge de color dinámico>
                        <div class="mb-3">
                            <span class="${badgeClass}">${personaje.status}</span>
                        </div>

                        <!Especie >
                        <div class="info-row">
                            <div class="info-label">Especie</div>
                            <div class="info-value">${personaje.species}</div>
                        </div>

                        <!ultima ubicación conocida>
                        <div class="info-row">
                            <div class="info-label">Última ubicación</div>
                            <div class="info-value">${personaje.location.name}</div>
                        </div>

                    </div>
                </div>
            </div>
        `;
    
        divResultado.innerHTML = cardHTML;
    }

    //FUNCIÓN: MOSTRAR ERROR
    /**
      mostrarError(mensaje)
      Muestra un mensaje de error estilizado en el div#resultado.
      @param {string} mensaje - Texto del error a mostrar.
     */
    function mostrarError(mensaje) {
        divResultado.innerHTML = `
            <div class="col-12">
                <div class="msg-box">
                    <span class="msg-icon">🔍</span>
                    <p class="msg-texto">${mensaje}</p>
                    <p class="msg-sub">Intentá con otro nombre o un ID diferente.</p>
                </div>
            </div>
        `;
    }
    // FUNCIÓN: MOSTRAR CAMPO VACIIO
    /**
      mostrarVacio(mensaje)
     * Muestra un mensaje cuando el campo está vacío.
      @param {string} mensaje  Texto de advertencia 
     */
    
      function mostrarVacio(mensaje) {
        divResultado.innerHTML = `
            <div class="col-12">
                <div class="msg-box">
                    <span class="msg-icon">⚠️</span>
                    <p class="msg-texto">${mensaje}</p>
                    <p class="msg-sub">Ejemplo: <strong>Rick</strong> &nbsp;|&nbsp; <strong>1</strong></p>
                </div>
            </div>
        `;
    }
    //FUNCIÓN: MOSTRAR SPINNER
    function mostrarSpinner() {
        divResultado.innerHTML = `
            <div class="col-12">
                <div class="msg-box">
                    <div class="spinner-border" role="status" style="color: var(--rm-green); width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="msg-sub mt-2">Buscando personaje...</p>
                </div>
            </div>
        `;
    }
});