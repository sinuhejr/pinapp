// Función para actualizar la fecha y hora automáticamente cada minuto
function updateDateTime() {
    var now = new Date();
    var day = String(now.getDate()).padStart(2, '0');
    var month = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
    var year = now.getFullYear();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');

    var formattedDate = `${day}/${month}/${year}`;
    var formattedTime = `${hours}:${minutes} horas`;

    document.getElementById('date').value = formattedDate;
    document.getElementById('time').value = formattedTime;
}

// Llamar a updateDateTime() al cargar la página
updateDateTime();

// Actualizar la fecha y hora automáticamente cada minuto
setInterval(updateDateTime, 60000);

// Esta función determina el saludo basado en la hora
function getGreeting(hour) {
    if (hour >= 5 && hour < 12) {
        return 'Buenos días';
    } else if (hour >= 12 && hour < 19) {
        return 'Buenas tardes';
    } else {
        return 'Buenas noches';
    }
}

// Esta función maneja la redacción de los nombres dependiendo del rango
function formatNames(names) {
    const comisarios = names.filter(name => name.startsWith('Comisario'));
    const suboficiales = names.filter(name => name.startsWith('Suboficial'));
    
    let comisarioText = comisarios.length === 1
        ? `del ${comisarios[0]}`
        : `de los ${comisarios.join(', ')}`;

    let suboficialesText = '';
    if (suboficiales.length === 1) {
        suboficialesText = `del ${suboficiales[0]}`;
    } else if (suboficiales.length > 1) {
        // Eliminamos "Suboficial" de los nombres para no repetirlo
        const suboficialNames = suboficiales.map(name => name.replace('Suboficial ', ''));
        suboficialesText = `de los Suboficiales ${suboficialNames.join(', ').replace(/,([^,]*)$/, ' y$1')}`;
    }

    if (comisarios.length > 0 && suboficiales.length > 0) {
        return `${comisarioText} y ${suboficialesText}`;
    } else if (comisarios.length > 0) {
        return comisarioText;
    } else if (suboficiales.length > 0) {
        return suboficialesText;
    }
    return '';
}

// Esta función se ejecuta cuando se hace clic en el botón "Generar PIN"
document.getElementById('generatePinButton').addEventListener('click', function() {
    var pinType = document.getElementById('pinType').value;
    var date = document.getElementById('date').value;
    var time = document.getElementById('time').value;

    var selectedNames = Array.from(document.querySelectorAll('#names input:checked')).map(checkbox => checkbox.value);
    var selectedVehicles = Array.from(document.querySelectorAll('#vehicles input:checked')).map(checkbox => checkbox.value);
    var selectedPlaces = Array.from(document.querySelectorAll('#places input:checked')).map(checkbox => checkbox.value);
    var signingOfficer = document.getElementById('signingOfficer').value;

    var namesIntro = formatNames(selectedNames);
    
    // Verificamos si el lugar ya comienza con "a" para evitar duplicar
    var placesText = selectedPlaces.join(', ');
    if (!placesText.startsWith('a ')) {
        placesText = 'a ' + placesText;
    }

    var vehiclesText = selectedVehicles.map(vehicle => `•${vehicle}`).join('\n');

    var now = new Date();
    var hour = now.getHours();
    var greeting = getGreeting(hour);

    // Lógica para determinar si es "quien" o "quienes"
    var actionText = selectedNames.length === 1 ? 'quien se dirige' : 'quienes se dirigen';

    var pinText = `*SECRETARÍA DE SEGURIDAD PÚBLICA*
*DIRECCIÓN GENERAL DE POLICÍA CIBERNÉTICA*
*AGUASCALIENTES, AGS.*

*Fecha*
${date}

*QTR*
${time}

*${greeting}*
Para conocimiento de la superioridad, por medio del presente me permito informar ${pinType === 'salida' ? 'la salida' : 'el regreso'} ${namesIntro}, ${actionText} ${placesText}.

*Vehículos*
${vehiclesText}

*Respetuosamente*
${signingOfficer}`;

    // Aquí se actualiza el contenido del elemento 'pinOutput' con el texto del PIN generado
    document.getElementById('pinOutput').textContent = pinText;
});

// Función para copiar el PIN generado al portapapeles
document.getElementById('copyPinButton').addEventListener('click', function() {
    var pinText = document.getElementById('pinOutput').textContent;

    // Verifica si hay contenido para copiar
    if (pinText) {
        // Crear un campo de texto temporal
        var tempInput = document.createElement('textarea');
        tempInput.value = pinText;
        document.body.appendChild(tempInput);

        // Seleccionar el texto y copiar
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        alert('PIN copiado al portapapeles.');
    } else {
        alert('No hay ningún PIN generado para copiar.');
    }
});