// Obtener el elemento donde mostraremos el contenido del JSON
const jsonContentArea = document.getElementById('jsonContent');

// Ruta relativa al archivo JSON (funciona cuando se sirve desde un servidor web)
const jsonFilePath = 'data.json';

// Usar fetch para cargar el archivo JSON
fetch(jsonFilePath)
    .then(response => {
        // Verificar si la respuesta fue exitosa (código de estado 200-299)
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        // Parsear la respuesta como JSON
        return response.json();
    })
    .then(data => {
        // Aquí tienes los datos del archivo data.json como un objeto JavaScript
        console.log('Datos cargados desde data.json:', data);

        // Ahora puedes usar estos datos para actualizar tu página
        // Por ejemplo, mostrarlo en la área de contenido (formateado para legibilidad)
        jsonContentArea.textContent = JSON.stringify(data, null, 2); // null, 2 para formato indentado

        // Puedes acceder a propiedades específicas, por ejemplo:
        // if (data && data.titulo) {
        //     document.querySelector('h1').textContent = data.titulo;
        // }

    })
    .catch(error => {
        // Manejar errores (por ejemplo, si el archivo no se encuentra o hay un error de parsing)
        console.error('Error al cargar o parsear el archivo JSON:', error);
        jsonContentArea.textContent = `Error al cargar los datos: ${error.message}`;

        // Mostrar un mensaje más amigable si es un error común como "Archivo no encontrado"
        if (error.message.includes('404')) {
             jsonContentArea.textContent = `Error: El archivo "${jsonFilePath}" no se encontró. Asegúrate de que está en la misma carpeta y de que estás sirviendo los archivos con un servidor web.`;
        }
    });

// El código del input type="file" que estaba antes ya no es necesario para este propósito.
// Si lo tenías, puedes comentarlo o eliminarlo.