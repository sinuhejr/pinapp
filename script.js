// Función para actualizar la fecha y hora automáticamente cada minuto
function updateDateTime() {
    var now = new Date();
    var day = String(now.getDate()).padStart(2, '0');
    var month = String(now.getMonth() + 1).padStart(2, '0'); // Enero es 0
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

// Esta función se ejecuta cuando se hace clic en el botón "Generar PIN"
document.getElementById('generatePinButton').addEventListener('click', function() {
    var pinType = document.getElementById('pinType').value;
    var date = document.getElementById('date').value;
    var time = document.getElementById('time').value;

    var selectedNames = Array.from(document.querySelectorAll('#names input:checked')).map(checkbox => checkbox.value);
    var selectedVehicles = Array.from(document.querySelectorAll('#vehicles input:checked')).map(checkbox => checkbox.value);
    var selectedPlaces = Array.from(document.querySelectorAll('#places input:checked')).map(checkbox => checkbox.value);

    // Verificamos que haya personas seleccionadas
    if (selectedNames.length === 0) {
        alert('Por favor selecciona al menos una persona.');
        return;
    }

    // Verificamos que haya lugares seleccionados
    if (selectedPlaces.length === 0) {
        alert('Por favor selecciona al menos un lugar.');
        return;
    }

    var namesIntro = selectedNames.join(', ');

    // Verificamos si el lugar ya comienza con "a" para evitar duplicar
    var placesText = selectedPlaces.join(', ');
    if (!placesText.startsWith('a ')) {
        placesText = 'a ' + placesText;
    }

    var vehiclesText = selectedVehicles.map(vehicle => `•${vehicle}`).join('\n');

    // Determinamos si es "quien" o "quienes" y si es "dirige" o "dirigió"
    var actionText = selectedNames.length === 1
        ? (pinType === 'salida' ? 'quien se dirige' : 'quien se dirigió')
        : (pinType === 'salida' ? 'quienes se dirigen' : 'quienes se dirigieron');

    var pinText = `*SECRETARÍA DE SEGURIDAD PÚBLICA*\n*DIRECCIÓN GENERAL DE POLICÍA CIBERNÉTICA*\n*AGUASCALIENTES, AGS.*\n\n*Fecha*\n${date}\n\n*QTR*\n${time}\n\nPara conocimiento de la superioridad, por medio del presente me permito informar ${pinType === 'salida' ? 'la salida' : 'el regreso'} de ${namesIntro}, ${actionText} ${placesText}.\n\n*Vehículos*\n${vehiclesText}\n\n*Respetuosamente*\nSuboficial Jiménez Rivera Sinuhé`;

    // Aquí se actualiza el contenido del elemento 'pinOutput' con el texto del PIN generado
    document.getElementById('pinOutput').textContent = pinText;
});

});
