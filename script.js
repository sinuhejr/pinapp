// Función para actualizar la fecha y hora automáticamente cada minuto
function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes} horas`;

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

function formatNames(names) {
    const comisarios = names.filter(name => name.startsWith('Comisario'));
    const subinspectores = names.filter(name => name.startsWith('Subinspector'));
    const oficiales = names.filter(name => name.startsWith('Oficial'));
    const suboficiales = names.filter(name => name.startsWith('Suboficial'));

    let comisarioText = comisarios.length === 1
        ? `del ${comisarios[0]}`
        : `de los ${comisarios.join(', ')}`;

    let subinspectorText = '';
    if (subinspectores.length === 1) {
        subinspectorText = `del ${subinspectores[0]}`;
    } else if (subinspectores.length > 1) {
        subinspectorText = `de los Subinspectores ${subinspectores.join(', ')}`;
    }

    let oficialText = '';
    if (oficiales.length === 1) {
        oficialText = `del ${oficiales[0]}`;
    } else if (oficiales.length > 1) {
        oficialText = `de los Oficiales ${oficiales.slice(0, -1).join(', ')} y ${oficiales[oficiales.length - 1]}`;
    }

   let suboficialesText = '';
if (suboficiales.length > 0) {
    const suboficialNames = suboficiales.map(name => name.replace('Suboficial ', ''));
    const isOnlyWomen = suboficialNames.every(name => ['Alondra Sandoval Vázquez', 'Celeste García Alemán'].includes(name));
    const hasMale = suboficialNames.some(name => !['Alondra Sandoval Vázquez', 'Celeste García Alemán'].includes(name));

    if (isOnlyWomen) {
        // Caso de solo mujeres (Alondra y Celeste)
        suboficialesText = `de las Suboficiales ${suboficialNames.join(' y ')}`;
    } else if (hasMale) {
        // Caso de mezcla de hombres y mujeres (o solo hombres)
        const prefix = suboficialNames.length === 1 
            ? 'de la Suboficial' 
            : 'de los Suboficiales'; // Ajustar a 'los' si hay más de un suboficial
        const formattedNames = suboficialNames.length > 2
            ? `${suboficialNames.slice(0, -1).join(', ')} y ${suboficialNames[suboficialNames.length - 1]}`
            : suboficialNames.join(' y ');

        suboficialesText = `${prefix} ${formattedNames}`;
    }
}


    let combinedText = [];
    if (comisarios.length > 0) combinedText.push(comisarioText);
    if (subinspectores.length > 0) combinedText.push(subinspectorText);
    if (oficiales.length > 0) combinedText.push(oficialText);
    if (suboficiales.length > 0) combinedText.push(suboficialesText);

    // Generar el texto combinado con la coma antes del "y"
    if (combinedText.length > 1) {
        const last = combinedText.pop();
        return `${combinedText.join(', ')} y ${last}`;
    }
    return combinedText.join(', ');
}

document.getElementById('generatePinButton').addEventListener('click', function() {
    const pinType = document.getElementById('pinType').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const selectedNames = Array.from(document.querySelectorAll('#names input:checked')).map(checkbox => checkbox.value);
    const selectedVehicles = Array.from(document.querySelectorAll('#vehicles input:checked')).map(checkbox => checkbox.value);
    const selectedPlaces = Array.from(document.querySelectorAll('#places input:checked')).map(checkbox => checkbox.value);
    const signingOfficer = document.getElementById('signingOfficer').value;

    // Obtener el valor del campo "Otro(a):"
    const otherPlace = document.getElementById('otroLugar').value.trim();
    if (otherPlace) {
        selectedPlaces.push(otherPlace);  // Si hay un lugar adicional, lo agregamos
    }

    const namesIntro = formatNames(selectedNames);

    // Verificamos si el lugar ya comienza con "a" para evitar duplicar
    let placesText = selectedPlaces.join(', ');
    if (!placesText.startsWith('a ')) {
        placesText = 'a ' + placesText;
    }

    const vehiclesText = selectedVehicles.map(vehicle => `•${vehicle}`).join('\n');

    const now = new Date();
    const hour = now.getHours();
    const greeting = getGreeting(hour);

    // Lógica para determinar si es "quien se dirige" o "quienes se dirigen" para "salida"
    const actionText = selectedNames.length === 1 
        ? (pinType === 'salida' ? 'quien se dirige' : 'quien se dirigió') 
        : (pinType === 'salida' ? 'quienes se dirigen' : 'quienes se dirigieron');

    const pinText = `*SECRETARÍA DE SEGURIDAD PÚBLICA*
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

// Función para copiar el PIN al portapapeles
document.getElementById('copyPinButton').addEventListener('click', function() {
    const pinText = document.getElementById('pinOutput').textContent;

    navigator.clipboard.writeText(pinText).then(function() {
        alert('El PIN ha sido copiado al portapapeles');
    }).catch(function(err) {
        alert('Error al copiar el PIN: ', err);
    });
});
