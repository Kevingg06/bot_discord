const fs = require('fs');
const path = require('path');

async function cargarCommands(client) {
    const commandsPath = path.join(__dirname, '../Commands/Public');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);  // Carga el comando desde el archivo

        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);  // Añadir el comando a la colección
            console.log(`Comando cargado: ${command.data.name}`);  // Solo para verificar si se cargan correctamente
        } else {
            console.log(`El comando en el archivo ${file} no tiene data o execute`);
        }
    }
}

module.exports = { cargarCommands };
